import { Request, Response } from 'express';
import { WineService } from '../../services/wineService';

export class WineController {
    private wineService: WineService;

    constructor() {
        this.wineService = new WineService();
    }

    public async getAllWines(req: Request, res: Response): Promise<void> {
        try {
            const wines = await this.wineService.getAllWines();
            res.status(200).json(wines);
        } catch (error) {
            console.error('Error retrieving wines:', error);
            res.status(500).json({ message: 'Error retrieving wines' });
        }
    }

    public async getWine(req: Request, res: Response): Promise<void> {
        try {
            const wineId = req.params.id;
            const wine = await this.wineService.getWineById(wineId);

            if (!wine) {
                res.status(404).json({ message: 'Wine not found' });
                return;
            }

            res.status(200).json(wine);
        } catch (error) {
            console.error('Error retrieving wine:', error);
            res.status(500).json({ message: 'Error retrieving wine data' });
        }
    }

    public async addWine(req: Request, res: Response): Promise<void> {
        try {
            const wineData = req.body;

            // Basic validation
            if (!wineData.name || !wineData.type || !wineData.region) {
                res.status(400).json({
                    message: 'Missing required fields: name, type, and region are required'
                });
                return;
            }

            const newWine = await this.wineService.addWine(wineData);
            res.status(201).json(newWine);
        } catch (error) {
            console.error('Error adding wine:', error);
            res.status(500).json({ message: 'Error adding wine' });
        }
    }

    public async updateWine(req: Request, res: Response): Promise<void> {
        try {
            const wineId = req.params.id;
            const wineData = req.body;
            const updatedWine = await this.wineService.updateWine(wineId, wineData);

            if (!updatedWine) {
                res.status(404).json({ message: 'Wine not found' });
                return;
            }

            res.status(200).json(updatedWine);
        } catch (error) {
            console.error('Error updating wine:', error);
            res.status(500).json({ message: 'Error updating wine' });
        }
    }
}