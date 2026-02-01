import { Request, Response } from 'express';
import multer from 'multer';
import recognitionService from '../../services/recognitionService';
import googleVisionService from '../../services/googleVisionService';
import logger from '../../utils/logger';

// Configure multer for memory storage (images stored as Buffer)
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Check if recognition service is configured
export const getStatus = async (req: Request, res: Response) => {
    try {
        const isConfigured = googleVisionService.isConfigured();

        res.json({
            success: true,
            data: {
                visionApiConfigured: isConfigured,
                status: isConfigured ? 'ready' : 'not_configured',
                message: isConfigured
                    ? 'Recognition service is ready'
                    : 'Google Vision API is not configured. Please set GOOGLE_CLOUD_VISION_API_KEY'
            }
        });
    } catch (error: any) {
        logger.error('Status check error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking service status',
            error: error.message
        });
    }
};

// Recognize wine from uploaded image
export const recognizeWine = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided. Please upload an image.'
            });
        }

        if (!googleVisionService.isConfigured()) {
            return res.status(503).json({
                success: false,
                message: 'Recognition service is not configured. Please set up Google Vision API.'
            });
        }

        logger.info(`Processing wine image: ${req.file.originalname} (${req.file.size} bytes)`);

        const result = await recognitionService.recognizeWine(req.file.buffer);

        // Get food pairings for the recognized wine
        const foodPairings = await recognitionService.getFoodPairings(result.wineName);

        res.json({
            success: true,
            data: {
                wine: {
                    name: result.wineName,
                    vintage: result.vintage,
                    grapeVariety: result.grapeVariety,
                    region: result.region,
                    confidence: result.confidence,
                    detectedText: result.detectedText
                },
                foodPairings
            }
        });
    } catch (error: any) {
        logger.error('Wine recognition error:', error);
        res.status(500).json({
            success: false,
            message: 'Error recognizing wine from image',
            error: error.message
        });
    }
};

// Recognize food from uploaded image
export const recognizeFood = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided. Please upload an image.'
            });
        }

        if (!googleVisionService.isConfigured()) {
            return res.status(503).json({
                success: false,
                message: 'Recognition service is not configured. Please set up Google Vision API.'
            });
        }

        logger.info(`Processing food image: ${req.file.originalname} (${req.file.size} bytes)`);

        const result = await recognitionService.recognizeFood(req.file.buffer);

        // Get wine pairings for the recognized food
        const winePairings = await recognitionService.getPairingSuggestions(result.foodName);

        res.json({
            success: true,
            data: {
                food: {
                    name: result.foodName,
                    confidence: result.confidence,
                    allDetections: result.allDetections
                },
                winePairings
            }
        });
    } catch (error: any) {
        logger.error('Food recognition error:', error);
        res.status(500).json({
            success: false,
            message: 'Error recognizing food from image',
            error: error.message
        });
    }
};

// Get wine pairing suggestions for a food name (text-based)
export const getWinePairings = async (req: Request, res: Response) => {
    try {
        const { food } = req.params;

        if (!food) {
            return res.status(400).json({
                success: false,
                message: 'Food name is required'
            });
        }

        const winePairings = await recognitionService.getPairingSuggestions(food);

        res.json({
            success: true,
            data: {
                food,
                winePairings
            }
        });
    } catch (error: any) {
        logger.error('Get wine pairings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting wine pairings',
            error: error.message
        });
    }
};

// Get food pairing suggestions for a wine name (text-based)
export const getFoodPairings = async (req: Request, res: Response) => {
    try {
        const { wine } = req.params;

        if (!wine) {
            return res.status(400).json({
                success: false,
                message: 'Wine name is required'
            });
        }

        const foodPairings = await recognitionService.getFoodPairings(wine);

        res.json({
            success: true,
            data: {
                wine,
                foodPairings
            }
        });
    } catch (error: any) {
        logger.error('Get food pairings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting food pairings',
            error: error.message
        });
    }
};

// Submit feedback for recognition results
export const submitFeedback = async (req: Request, res: Response) => {
    try {
        const { wineLabel, feedback, isCorrect } = req.body;

        if (!wineLabel || !feedback) {
            return res.status(400).json({
                success: false,
                message: 'Wine label and feedback are required'
            });
        }

        await recognitionService.submitFeedback(wineLabel, feedback);

        res.json({
            success: true,
            message: 'Feedback submitted successfully'
        });
    } catch (error: any) {
        logger.error('Submit feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback',
            error: error.message
        });
    }
};
