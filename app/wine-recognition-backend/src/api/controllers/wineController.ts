import { Request, Response } from 'express';
import { WineService } from '../../services/wineService';
import logger from '../../utils/logger';

const wineService = new WineService();

export const getAllWines = async (req: Request, res: Response): Promise<void> => {
    try {
        const wines = await wineService.getAllWines();
        res.status(200).json(wines);
    } catch (error) {
        logger.error('Error retrieving wines:', error);
        res.status(500).json({ message: 'Error retrieving wines' });
    }
};

export const getWine = async (req: Request, res: Response): Promise<void> => {
    try {
        const wineId = req.params.id;
        const wine = await wineService.getWineById(wineId);

        if (!wine) {
            res.status(404).json({ message: 'Wine not found' });
            return;
        }

        res.status(200).json(wine);
    } catch (error) {
        logger.error('Error retrieving wine:', error);
        res.status(500).json({ message: 'Error retrieving wine data' });
    }
};

export const addWine = async (req: Request, res: Response): Promise<void> => {
    try {
        const wineData = req.body;

        // Basic validation
        if (!wineData.name || !wineData.type || !wineData.region) {
            res.status(400).json({
                message: 'Missing required fields: name, type, and region are required'
            });
            return;
        }

        const newWine = await wineService.addWine(wineData);
        res.status(201).json(newWine);
    } catch (error) {
        logger.error('Error adding wine:', error);
        res.status(500).json({ message: 'Error adding wine' });
    }
};

export const updateWine = async (req: Request, res: Response): Promise<void> => {
    try {
        const wineId = req.params.id;
        const wineData = req.body;
        const updatedWine = await wineService.updateWine(wineId, wineData);

        if (!updatedWine) {
            res.status(404).json({ message: 'Wine not found' });
            return;
        }

        res.status(200).json(updatedWine);
    } catch (error) {
        logger.error('Error updating wine:', error);
        res.status(500).json({ message: 'Error updating wine' });
    }
};