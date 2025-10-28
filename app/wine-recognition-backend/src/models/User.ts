import mongoose, { Document, Schema } from 'mongoose';

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

export default mongoose.model<IUser>('User', UserSchema);
