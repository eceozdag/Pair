import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    pairingId: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    pairingId: {
        type: Schema.Types.ObjectId,
        ref: 'Pairing',
        required: true,
        index: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Create compound index for common queries
FeedbackSchema.index({ pairingId: 1, createdAt: -1 });
FeedbackSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
