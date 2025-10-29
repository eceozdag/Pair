import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request to include user
export interface AuthRequest extends Request {
    user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        // Verify token
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this';
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };

        // Find user
        const user = await User.findById(decoded.userId).select('-passwordHash');
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token. User not found.' 
            });
        }

        if (!user.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'Account is deactivated.' 
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token.' 
            });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired.' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Server error during authentication.' 
        });
    }
};

// Optional: Middleware to check if user is premium
export const requirePremium = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isPremium) {
        return res.status(403).json({ 
            success: false, 
            message: 'Premium subscription required.' 
        });
    }
    next();
};

