import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../../models/User';
import { AuthRequest } from '../../middleware/auth';
import logger from '../../utils/logger';
import { sendPasswordResetEmail } from '../../services/emailService';

// Generate JWT token
const generateToken = (userId: string): string => {
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this';
    return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
};

// Register new user
export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, password, firstName, lastName } = req.body;

        // Validation
        if (!email || !username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email, username, and password are required.' 
            });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long.' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email: email.toLowerCase() }, { username }] 
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email already registered.' 
                });
            }
            return res.status(400).json({ 
                success: false, 
                message: 'Username already taken.' 
            });
        }

        // Create new user
        const user = new User({
            email: email.toLowerCase(),
            username,
            passwordHash: password, // Will be hashed by pre-save middleware
            firstName,
            lastName,
            isActive: true,
            isPremium: false
        });

        await user.save();

        // Generate token
        const token = generateToken(String(user._id));

        // Return user data (without password)
        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                token,
                user: {
                    id: String(user._id),
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isPremium: user.isPremium
                }
            }
        });
    } catch (error: any) {
        logger.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating user.', 
            error: error.message 
        });
    }
};

// Login user
export const login = async (req: Request, res: Response) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Validation
        if (!emailOrUsername || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email/username and password are required.' 
            });
        }

        // Find user by email or username (include passwordHash)
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername }
            ]
        }).select('+passwordHash');

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials.' 
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'Account is deactivated. Please contact support.' 
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials.' 
            });
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate token
        const token = generateToken(String(user._id));

        res.json({
            success: true,
            message: 'Login successful.',
            data: {
                token,
                user: {
                    id: String(user._id),
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isPremium: user.isPremium,
                    profileImageUrl: user.profileImageUrl
                }
            }
        });
    } catch (error: any) {
        logger.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error logging in.', 
            error: error.message 
        });
    }
};

// Get current user profile
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authenticated.' 
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: String(req.user._id),
                    email: req.user.email,
                    username: req.user.username,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    isPremium: req.user.isPremium,
                    profileImageUrl: req.user.profileImageUrl,
                    preferences: req.user.preferences
                }
            }
        });
    } catch (error: any) {
        logger.error('Get profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching profile.', 
            error: error.message 
        });
    }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authenticated.' 
            });
        }

        const { firstName, lastName, profileImageUrl, preferences } = req.body;

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found.' 
            });
        }

        // Update fields
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (profileImageUrl !== undefined) user.profileImageUrl = profileImageUrl;
        
        // Update preferences - merge with existing
        if (preferences !== undefined) {
            user.preferences = {
                ...user.preferences,
                ...preferences
            };
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully.',
            data: {
                user: {
                    id: String(user._id),
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isPremium: user.isPremium,
                    profileImageUrl: user.profileImageUrl,
                    preferences: user.preferences
                }
            }
        });
    } catch (error: any) {
        logger.error('Update profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating profile.', 
            error: error.message 
        });
    }
};

// Change password
export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authenticated.' 
            });
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password and new password are required.' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters long.' 
            });
        }

        // Get user with password
        const user = await User.findById(req.user._id).select('+passwordHash');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found.' 
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect.' 
            });
        }

        // Set new password (will be hashed by pre-save middleware)
        user.passwordHash = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (error: any) {
        logger.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password.',
            error: error.message
        });
    }
};

// Request password reset
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required.'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if user exists - always return success
            return res.json({
                success: true,
                message: 'If an account with that email exists, a reset link has been sent.'
            });
        }

        // Generate 6-digit reset code
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the token before storing
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save to user
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // Create reset URL (for deep linking in the app)
        const resetUrl = `winemate://reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        // Send email
        await sendPasswordResetEmail(email, resetToken, resetUrl);

        res.json({
            success: true,
            message: 'If an account with that email exists, a reset link has been sent.'
        });
    } catch (error: any) {
        logger.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing request.',
            error: error.message
        });
    }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email, token, and new password are required.'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.'
            });
        }

        // Hash the provided token to compare
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid reset token
        const user = await User.findOne({
            email: email.toLowerCase(),
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() }
        }).select('+resetPasswordToken +resetPasswordExpires');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token.'
            });
        }

        // Update password
        user.passwordHash = newPassword; // Will be hashed by pre-save middleware
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password has been reset successfully. You can now login with your new password.'
        });
    } catch (error: any) {
        logger.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password.',
            error: error.message
        });
    }
};

