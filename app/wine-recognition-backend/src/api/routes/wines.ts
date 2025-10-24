import { Router } from 'express';
import { WineController } from '../controllers/wineController';

const router = Router();
const wineController = new WineController();

router.get('/', wineController.getWine);
router.post('/', wineController.addWine);
router.put('/:id', wineController.updateWine);

export default router;