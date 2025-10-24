import { Router } from 'express';
import { PairingController } from '../controllers/pairingController';

const router = Router();
const pairingController = new PairingController();

// Route to get all pairings
router.get('/', pairingController.getPairings.bind(pairingController));

// Route to add a new pairing
router.post('/', pairingController.addPairing.bind(pairingController));

// Route to get expert pairings
router.get('/expert', pairingController.getExpertPairings.bind(pairingController));

export default router;