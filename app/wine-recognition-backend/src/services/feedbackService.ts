import Feedback, { IFeedback } from '../models/Feedback';

export class FeedbackService {
    public async submitFeedback(feedbackData: { userId: string; pairingId: string; rating: number; comment?: string }): Promise<IFeedback> {
        const newFeedback = new Feedback({
            userId: feedbackData.userId,
            pairingId: feedbackData.pairingId,
            rating: feedbackData.rating,
            comment: feedbackData.comment
        });

        await newFeedback.save();
        return newFeedback;
    }

    public async getFeedbackByPairing(pairingId: string): Promise<IFeedback[]> {
        return await Feedback.find({ pairingId }).sort({ createdAt: -1 });
    }

    public async getAllFeedback(): Promise<IFeedback[]> {
        return await Feedback.find().sort({ createdAt: -1 });
    }
}