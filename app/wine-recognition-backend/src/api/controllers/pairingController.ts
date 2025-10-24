import { Request, Response } from 'express';
import { PairingService } from '../services/pairingService';
import { FeedbackService } from '../services/feedbackService';

export class PairingController {
    private pairingService: PairingService;
    private feedbackService: FeedbackService;

    constructor() {
        this.pairingService = new PairingService();
        this.feedbackService = new FeedbackService();
    }

    public async getPairings(req: Request, res: Response): Promise<void> {
        try {
            const pairings = await this.pairingService.getAllPairings();
            res.status(200).json(pairings);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving pairings', error });
        }
    }

    public async addPairing(req: Request, res: Response): Promise<void> {
        try {
            const pairingData = req.body;
            const newPairing = await this.pairingService.addPairing(pairingData);
            res.status(201).json(newPairing);
        } catch (error) {
            res.status(500).json({ message: 'Error adding pairing', error });
        }
    }

    public async getExpertPairings(req: Request, res: Response): Promise<void> {
        try {
            const expertPairings = await this.pairingService.getExpertPairings();
            res.status(200).json(expertPairings);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving expert pairings', error });
        }
    }

    public async submitFeedback(req: Request, res: Response): Promise<void> {
        try {
            const feedbackData = req.body;
            await this.feedbackService.submitFeedback(feedbackData);
            res.status(200).json({ message: 'Feedback submitted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error submitting feedback', error });
        }
    }
}