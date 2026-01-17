import { Router } from 'express';
import { getAllWines, getWine, addWine, updateWine } from '../controllers/wineController';

const router = Router();

// Get all wines
router.get('/', getAllWines);

// Get single wine by ID
router.get('/:id', getWine);

// Add new wine
router.post('/', addWine);

// Update wine
router.put('/:id', updateWine);

export default router;