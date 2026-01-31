import { Router } from 'express';
import { getPairings, addPairing, getExpertPairings } from '../controllers/pairingController';

const router = Router();

// Route to get expert pairings (must come before general GET to avoid route collision)
router.get('/expert', getExpertPairings);

// Route to get all pairings
router.get('/', getPairings);

// Route to add a new pairing
router.post('/', addPairing);

export default router;