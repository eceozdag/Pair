import { Feedback } from '../db/models/Feedback'; // Assuming you have a Feedback model defined
import { Logger } from '../utils/logger';

export class FeedbackService {
    private logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    async submitFeedback(userId: string, wineId: string, rating: number, comments: string): Promise<void> {
        try {
            const feedback = new Feedback({
                userId,
                wineId,
                rating,
                comments,
                createdAt: new Date(),
            });
            await feedback.save();
            this.logger.info('Feedback submitted successfully');
        } catch (error) {
            this.logger.error('Error submitting feedback', error);
            throw new Error('Could not submit feedback');
        }
    }

    async getFeedbackForWine(wineId: string): Promise<Feedback[]> {
        try {
            const feedbacks = await Feedback.find({ wineId });
            this.logger.info(`Retrieved feedback for wine ID: ${wineId}`);
            return feedbacks;
        } catch (error) {
            this.logger.error('Error retrieving feedback', error);
            throw new Error('Could not retrieve feedback');
        }
    }
}