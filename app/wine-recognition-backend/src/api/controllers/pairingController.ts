import { Request, Response } from 'express';
import { PairingService } from '../../services/pairingService';
import { FeedbackService } from '../../services/feedbackService';
import logger from '../../utils/logger';

const pairingService = new PairingService();
const feedbackService = new FeedbackService();

export const getPairings = async (req: Request, res: Response): Promise<void> => {
    try {
        const pairings = await pairingService.getAllPairings();
        res.status(200).json(pairings);
    } catch (error) {
        logger.error('Error retrieving pairings:', error);
        res.status(500).json({ message: 'Error retrieving pairings' });
    }
};

export const addPairing = async (req: Request, res: Response): Promise<void> => {
    try {
        const pairingData = req.body;

        // Basic validation
        if (!pairingData.wine || !pairingData.food || !Array.isArray(pairingData.food)) {
            res.status(400).json({
                message: 'Missing required fields: wine (string) and food (array) are required'
            });
            return;
        }

        const newPairing = await pairingService.addPairing(pairingData);
        res.status(201).json(newPairing);
    } catch (error) {
        logger.error('Error adding pairing:', error);
        res.status(500).json({ message: 'Error adding pairing' });
    }
};

export const getExpertPairings = async (req: Request, res: Response): Promise<void> => {
    try {
        const expertPairings = await pairingService.getExpertPairings();
        res.status(200).json(expertPairings);
    } catch (error) {
        logger.error('Error retrieving expert pairings:', error);
        res.status(500).json({ message: 'Error retrieving expert pairings' });
    }
};

export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
        const feedbackData = req.body;

        // Basic validation
        if (!feedbackData.userId || !feedbackData.pairingId || !feedbackData.rating) {
            res.status(400).json({
                message: 'Missing required fields: userId, pairingId, and rating are required'
            });
            return;
        }

        if (feedbackData.rating < 1 || feedbackData.rating > 5) {
            res.status(400).json({
                message: 'Rating must be between 1 and 5'
            });
            return;
        }

        await feedbackService.submitFeedback(feedbackData);
        res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        logger.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Error submitting feedback' });
    }
};