import { Router } from 'express';
import {
    getStatus,
    recognizeWine,
    recognizeFood,
    getWinePairings,
    getFoodPairings,
    submitFeedback,
    upload
} from '../controllers/recognitionController';

const router = Router();

// GET /api/recognition/status - Check if recognition service is configured
router.get('/status', getStatus);

// POST /api/recognition/wine - Recognize wine from image upload
router.post('/wine', upload.single('image'), recognizeWine);

// POST /api/recognition/food - Recognize food from image upload
router.post('/food', upload.single('image'), recognizeFood);

// GET /api/recognition/pairing/wine/:food - Get wine suggestions for a food
router.get('/pairing/wine/:food', getWinePairings);

// GET /api/recognition/pairing/food/:wine - Get food suggestions for a wine
router.get('/pairing/food/:wine', getFoodPairings);

// POST /api/recognition/feedback - Submit feedback for recognition results
router.post('/feedback', submitFeedback);

export default router;
