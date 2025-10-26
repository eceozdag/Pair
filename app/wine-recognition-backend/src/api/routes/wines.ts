import { Router } from 'express';
import { WineController } from '../controllers/wineController';

const router = Router();
const wineController = new WineController();

// Get all wines
router.get('/', wineController.getAllWines.bind(wineController));

// Get single wine by ID
router.get('/:id', wineController.getWine.bind(wineController));

// Add new wine
router.post('/', wineController.addWine.bind(wineController));

// Update wine
router.put('/:id', wineController.updateWine.bind(wineController));

export default router;