import googleVisionService from './googleVisionService';
import wineMatchingService from './wineMatchingService';
import { foodWinePairings } from '../data/pairings';
import logger from '../utils/logger';

interface WineRecognitionResult {
    wineName: string;
    vintage?: number;
    grapeVariety?: string;
    region?: string;
    confidence: number;
    detectedText: string;
}

interface FoodRecognitionResult {
    foodName: string;
    confidence: number;
    allDetections: string[];
}

export class RecognitionService {
    constructor() {
        this.checkConfiguration();
    }

    private checkConfiguration() {
        if (!googleVisionService.isConfigured()) {
            logger.warn('⚠️ Google Vision API is not configured. Please set GOOGLE_CLOUD_VISION_API_KEY or GOOGLE_APPLICATION_CREDENTIALS');
        } else {
            logger.info('✅ Recognition Service initialized with Google Vision');
        }
    }

    /**
     * Recognize wine from an image
     * Converts Buffer to base64, uses Google Vision, then matches against wine database
     */
    public async recognizeWine(image: Buffer): Promise<WineRecognitionResult> {
        try {
            // Convert Buffer to base64
            const base64Image = image.toString('base64');

            // Use Google Vision to detect wine label text
            const visionResult = await googleVisionService.detectWineLabel(base64Image);

            // Try to match detected text with wine database
            const matchResult = wineMatchingService.matchWine(
                visionResult.detectedText,
                visionResult.vintage,
                visionResult.region
            );

            let finalResult: WineRecognitionResult;

            if (matchResult && matchResult.matchScore > 0.6) {
                // Use matched wine from database (higher confidence)
                logger.info(`✅ Wine matched in database: ${matchResult.wine.name} (${(matchResult.matchScore * 100).toFixed(0)}%)`);
                finalResult = {
                    wineName: matchResult.wine.name,
                    vintage: visionResult.vintage,
                    grapeVariety: matchResult.wine.grapeVariety,
                    region: visionResult.region || matchResult.wine.commonRegions[0],
                    confidence: matchResult.matchScore,
                    detectedText: visionResult.detectedText
                };
            } else {
                // Use Vision API result directly (lower confidence)
                logger.info(`⚠️ Wine not in database, using OCR result: ${visionResult.wineName}`);
                finalResult = {
                    wineName: visionResult.wineName,
                    vintage: visionResult.vintage,
                    grapeVariety: visionResult.grapeVariety,
                    region: visionResult.region,
                    confidence: visionResult.confidence,
                    detectedText: visionResult.detectedText
                };
            }

            logger.info(`🍷 Final wine recognized: ${finalResult.wineName}`);
            return finalResult;
        } catch (error) {
            logger.error('Error recognizing wine:', error);
            throw new Error('Failed to recognize wine from image');
        }
    }

    /**
     * Recognize food from an image
     * Converts Buffer to base64 and uses Google Vision
     */
    public async recognizeFood(image: Buffer): Promise<FoodRecognitionResult> {
        try {
            // Convert Buffer to base64
            const base64Image = image.toString('base64');

            // Use Google Vision to detect food
            const result = await googleVisionService.detectFood(base64Image);

            logger.info(`🍽️ Food recognized: ${result.detectedFood}`);

            return {
                foodName: result.detectedFood,
                confidence: result.confidence,
                allDetections: result.allLabels.map(label => label.description)
            };
        } catch (error) {
            logger.error('Error recognizing food:', error);
            throw new Error('Failed to recognize food from image');
        }
    }

    /**
     * Get wine pairing suggestions for a detected food
     * Uses wine database + local pairing rules
     */
    public async getPairingSuggestions(foodName: string): Promise<string[]> {
        try {
            const foodKey = foodName.toLowerCase().trim();

            // First try wine database matching (more detailed)
            const databaseMatches = wineMatchingService.getWineRecommendations(foodKey, 5);
            if (databaseMatches.length > 0) {
                const wineNames = databaseMatches.map(w => w.name);
                logger.info(`📋 Found ${wineNames.length} wine pairings from database for "${foodKey}"`);
                return wineNames;
            }

            // Fallback to simple pairing rules
            // Direct match
            if (foodWinePairings[foodKey]) {
                logger.info(`📋 Found pairing for "${foodKey}" in rules`);
                return foodWinePairings[foodKey];
            }

            // Fuzzy match - check if food name contains any key
            for (const [key, wines] of Object.entries(foodWinePairings)) {
                if (foodKey.includes(key) || key.includes(foodKey)) {
                    logger.info(`📋 Found fuzzy pairing for "${foodKey}" via "${key}"`);
                    return wines as string[];
                }
            }

            // Default fallback pairings
            logger.info(`📋 No specific pairing found for "${foodKey}", using defaults`);
            return ['Pinot Noir', 'Chardonnay', 'Sauvignon Blanc'];
        } catch (error) {
            logger.error('Error getting pairing suggestions:', error);
            return ['Pinot Noir', 'Chardonnay', 'Sauvignon Blanc'];
        }
    }

    /**
     * Get food pairing suggestions for a detected wine
     */
    public async getFoodPairings(wineName: string): Promise<string[]> {
        try {
            const wineKey = wineName.toLowerCase().trim();
            const pairings: string[] = [];

            // Find all foods that pair with this wine
            for (const [food, wines] of Object.entries(foodWinePairings)) {
                const wineArray = wines as string[];
                if (wineArray.some((wine: string) => wine.toLowerCase().includes(wineKey) || wineKey.includes(wine.toLowerCase()))) {
                    pairings.push(food);
                }
            }

            if (pairings.length > 0) {
                logger.info(`📋 Found food pairings for "${wineName}"`);
                return pairings;
            }

            // Default fallback
            logger.info(`📋 No specific food pairing found for "${wineName}", using defaults`);
            return ['steak', 'chicken', 'cheese'];
        } catch (error) {
            logger.error('Error getting food pairings:', error);
            return ['steak', 'chicken', 'cheese'];
        }
    }

    /**
     * Submit user feedback (placeholder for future ML training)
     */
    public async submitFeedback(wineLabel: string, feedback: string): Promise<void> {
        try {
            logger.info(`📝 Feedback received for "${wineLabel}": ${feedback}`);
            // TODO: Store feedback in database for future model training
        } catch (error) {
            logger.error('Error submitting feedback:', error);
        }
    }
}

// Export singleton instance
export default new RecognitionService();