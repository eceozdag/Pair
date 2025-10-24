import { Request, Response } from 'express';
import { WineService } from '../services/wineService';

export class WineController {
    private wineService: WineService;

    constructor() {
        this.wineService = new WineService();
    }

    public async getWine(req: Request, res: Response): Promise<void> {
        try {
            const wineId = req.params.id;
            const wine = await this.wineService.getWineById(wineId);
            res.status(200).json(wine);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving wine data', error });
        }
    }

    public async addWine(req: Request, res: Response): Promise<void> {
        try {
            const wineData = req.body;
            const newWine = await this.wineService.addWine(wineData);
            res.status(201).json(newWine);
        } catch (error) {
            res.status(500).json({ message: 'Error adding wine', error });
        }
    }

    public async updateWine(req: Request, res: Response): Promise<void> {
        try {
            const wineId = req.params.id;
            const wineData = req.body;
            const updatedWine = await this.wineService.updateWine(wineId, wineData);
            res.status(200).json(updatedWine);
        } catch (error) {
            res.status(500).json({ message: 'Error updating wine', error });
        }
    }
}