import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    username: string;
    passwordHash?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    preferences?: {
        favoriteWineTypes?: string[];
        favoriteRegions?: string[];
        favoriteGrapeVarieties?: string[];
        dietaryRestrictions?: string[];
        spicePreference?: number; // 1-5
        sweetnessPreference?: number; // 1-5
    };
    savedWines?: mongoose.Types.ObjectId[];
    savedPairings?: mongoose.Types.ObjectId[];
    favoriteRestaurants?: string[];
    isPremium: boolean;
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    passwordHash: {
        type: String,
        select: false // Don't include in queries by default
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    profileImageUrl: {
        type: String,
        trim: true
    },
    preferences: {
        bio: {
            type: String,
            trim: true
        },
        favoriteWineTypes: [{
            type: String,
            trim: true
        }],
        favoriteRegions: [{
            type: String,
            trim: true
        }],
        favoriteGrapeVarieties: [{
            type: String,
            trim: true
        }],
        dietaryRestrictions: [{
            type: String,
            trim: true
        }],
        spicePreference: {
            type: Number,
            min: 1,
            max: 5
        },
        sweetnessPreference: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    savedWines: [{
        type: Schema.Types.ObjectId,
        ref: 'Wine'
    }],
    savedPairings: [{
        type: Schema.Types.ObjectId,
        ref: 'Pairing'
    }],
    favoriteRestaurants: [{
        type: String,
        trim: true
    }],
    isPremium: {
        type: Boolean,
        default: false,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    lastLoginAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Create compound indexes for common queries
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ username: 1, isActive: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
    const user = this as IUser;
    
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('passwordHash')) {
        return next();
    }
    
    try {
        // Generate salt and hash password
        if (user.passwordHash) {
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    const user = this as IUser;
    if (!user.passwordHash) {
        return false;
    }
    return bcrypt.compare(candidatePassword, user.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
