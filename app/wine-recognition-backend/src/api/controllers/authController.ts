import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { AuthRequest } from '../../middleware/auth';

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
        console.error('Registration error:', error);
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
        console.error('Login error:', error);
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
        console.error('Get profile error:', error);
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
        console.error('Update profile error:', error);
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
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error changing password.', 
            error: error.message 
        });
    }
};

