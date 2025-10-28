import mongoose, { Document, Schema } from 'mongoose';

export interface IPairing extends Document {
    wineId: mongoose.Types.ObjectId;
    wineName?: string;
    wineType?: string;
    foodCategory: string;
    foodName: string;
    foodDescription?: string;
    pairingScore: number; // 0-100
    pairingReason?: string;
    complementaryFlavors?: string[];
    contrastingFlavors?: string[];
    imageUrl?: string;
    userId?: mongoose.Types.ObjectId;
    isVerified: boolean;
    votes?: number;
    createdAt: Date;
    updatedAt: Date;
}

const PairingSchema = new Schema<IPairing>({
    wineId: {
        type: Schema.Types.ObjectId,
        ref: 'Wine',
        required: true,
        index: true
    },
    wineName: {
        type: String,
        trim: true
    },
    wineType: {
        type: String,
        trim: true
    },
    foodCategory: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    foodName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    foodDescription: {
        type: String,
        trim: true
    },
    pairingScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        index: true
    },
    pairingReason: {
        type: String,
        trim: true
    },
    complementaryFlavors: [{
        type: String,
        trim: true
    }],
    contrastingFlavors: [{
        type: String,
        trim: true
    }],
    imageUrl: {
        type: String,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    isVerified: {
        type: Boolean,
        default: false,
        index: true
    },
    votes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create compound indexes for common queries
PairingSchema.index({ wineId: 1, foodCategory: 1 });
PairingSchema.index({ foodName: 'text', foodDescription: 'text' });
PairingSchema.index({ pairingScore: -1, isVerified: 1 });

export default mongoose.model<IPairing>('Pairing', PairingSchema);
