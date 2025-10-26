import { v4 as uuidv4 } from 'uuid';

interface Feedback {
    id: string;
    userId: string;
    pairingId: string;
    rating: number;
    comment?: string;
    timestamp: number;
}

export class FeedbackService {
    private feedbacks: Feedback[];

    constructor() {
        this.feedbacks = [];
    }

    public async submitFeedback(feedbackData: { userId: string; pairingId: string; rating: number; comment?: string }): Promise<Feedback> {
        const newFeedback: Feedback = {
            id: uuidv4(),
            userId: feedbackData.userId,
            pairingId: feedbackData.pairingId,
            rating: feedbackData.rating,
            comment: feedbackData.comment,
            timestamp: Date.now()
        };
        this.feedbacks.push(newFeedback);
        return newFeedback;
    }

    public async getFeedbackByPairing(pairingId: string): Promise<Feedback[]> {
        return this.feedbacks.filter(f => f.pairingId === pairingId);
    }

    public async getAllFeedback(): Promise<Feedback[]> {
        return this.feedbacks;
    }
}