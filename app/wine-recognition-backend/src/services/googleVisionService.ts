import * as vision from '@google-cloud/vision';
import axios from 'axios';
import logger from '../utils/logger';

interface VisionLabel {
    description: string;
    score: number;
}

interface FoodDetectionResult {
    detectedFood: string;
    confidence: number;
    allLabels: VisionLabel[];
}

interface WineDetectionResult {
    wineName: string;
    vintage?: number;
    confidence: number;
    detectedText: string;
    grapeVariety?: string;
    region?: string;
}

export class GoogleVisionService {
    private client: vision.ImageAnnotatorClient | null = null;
    private apiKey: string;
    private useRestAPI: boolean = false;

    constructor() {
        this.apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY || '';

        // Check if using API key (REST) or Service Account (SDK)
        if (this.apiKey && this.apiKey !== 'your_api_key_here') {
            this.useRestAPI = true;
            logger.info('🔑 Google Vision: Using REST API with API Key');
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            try {
                this.client = new vision.ImageAnnotatorClient();
                logger.info('🔑 Google Vision: Using SDK with Service Account');
            } catch (error) {
                logger.error('Failed to initialize Vision SDK:', error);
            }
        } else {
            logger.warn('⚠️ Google Vision API credentials not configured');
        }
    }

    /**
     * Detect food items from an image
     * Uses label detection to identify food types
     */
    public async detectFood(imageBase64: string): Promise<FoodDetectionResult> {
        try {
            const labels = await this.detectLabels(imageBase64);

            // Food-related keywords to prioritize
            const foodKeywords = [
                'food', 'dish', 'cuisine', 'meal', 'meat', 'seafood', 'vegetable',
                'fruit', 'pasta', 'pizza', 'salad', 'soup', 'dessert', 'cheese',
                'steak', 'chicken', 'fish', 'salmon', 'beef', 'pork', 'lamb',
                'sushi', 'burger', 'sandwich', 'rice', 'bread', 'cake'
            ];

            // Find the best food-related label
            let bestFoodLabel = labels[0]; // Default to highest confidence label

            for (const label of labels) {
                const desc = label.description.toLowerCase();
                if (foodKeywords.some(keyword => desc.includes(keyword))) {
                    bestFoodLabel = label;
                    break;
                }
            }

            logger.info(`🍽️ Food detected: ${bestFoodLabel.description} (${(bestFoodLabel.score * 100).toFixed(1)}%)`);

            return {
                detectedFood: bestFoodLabel.description,
                confidence: bestFoodLabel.score,
                allLabels: labels.slice(0, 10) // Return top 10 labels
            };
        } catch (error) {
            logger.error('Error detecting food:', error);
            throw new Error('Failed to detect food from image');
        }
    }

    /**
     * Detect wine label information from an image
     * Uses text detection (OCR) to read wine labels
     */
    public async detectWineLabel(imageBase64: string): Promise<WineDetectionResult> {
        try {
            const detectedText = await this.detectText(imageBase64);

            // Parse wine information from text
            const parsed = this.parseWineText(detectedText);

            logger.info(`🍷 Wine detected: ${parsed.wineName}${parsed.vintage ? ` ${parsed.vintage}` : ''}`);

            return {
                wineName: parsed.wineName,
                vintage: parsed.vintage,
                confidence: parsed.confidence,
                detectedText: detectedText,
                grapeVariety: parsed.grapeVariety,
                region: parsed.region
            };
        } catch (error) {
            logger.error('Error detecting wine label:', error);
            throw new Error('Failed to detect wine label from image');
        }
    }

    /**
     * Detect labels from an image using Google Vision
     */
    private async detectLabels(imageBase64: string): Promise<VisionLabel[]> {
        const image = { content: imageBase64.replace(/^data:image\/\w+;base64,/, '') };

        if (this.useRestAPI) {
            // Use REST API with API Key
            const response = await axios.post(
                `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
                {
                    requests: [
                        {
                            image,
                            features: [{ type: 'LABEL_DETECTION', maxResults: 20 }]
                        }
                    ]
                }
            );

            const labels = response.data.responses[0]?.labelAnnotations || [];
            return labels.map((label: any) => ({
                description: label.description,
                score: label.score
            }));
        } else if (this.client) {
            // Use SDK with Service Account
            const [result] = await this.client.labelDetection({ image });
            const labels = result.labelAnnotations || [];
            return labels.map((label: any) => ({
                description: label.description || '',
                score: label.score || 0
            }));
        }

        throw new Error('Google Vision not properly configured');
    }

    /**
     * Detect text from an image using Google Vision OCR
     */
    private async detectText(imageBase64: string): Promise<string> {
        const image = { content: imageBase64.replace(/^data:image\/\w+;base64,/, '') };

        if (this.useRestAPI) {
            // Use REST API with API Key
            const response = await axios.post(
                `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
                {
                    requests: [
                        {
                            image,
                            features: [{ type: 'TEXT_DETECTION' }]
                        }
                    ]
                }
            );

            const textAnnotations = response.data.responses[0]?.textAnnotations || [];
            return textAnnotations[0]?.description || '';
        } else if (this.client) {
            // Use SDK with Service Account
            const [result] = await this.client.textDetection({ image });
            const detections = result.textAnnotations || [];
            return detections[0]?.description || '';
        }

        throw new Error('Google Vision not properly configured');
    }

    /**
     * Parse wine information from detected text
     */
    private parseWineText(text: string): {
        wineName: string;
        vintage?: number;
        confidence: number;
        grapeVariety?: string;
        region?: string;
    } {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        // Common grape varieties
        const grapeVarieties = [
            'Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Chardonnay',
            'Sauvignon Blanc', 'Riesling', 'Syrah', 'Shiraz', 'Malbec',
            'Zinfandel', 'Pinot Grigio', 'Pinot Gris', 'Tempranillo',
            'Sangiovese', 'Nebbiolo', 'Grenache', 'Cabernet Franc'
        ];

        // Common wine regions
        const regions = [
            'Napa Valley', 'Bordeaux', 'Burgundy', 'Tuscany', 'Rioja',
            'Champagne', 'Barolo', 'Chianti', 'Marlborough', 'Sonoma'
        ];

        let wineName = lines[0] || 'Unknown Wine';
        let vintage: number | undefined;
        let grapeVariety: string | undefined;
        let region: string | undefined;

        // Look for vintage year (4 digits between 1900-2099)
        const yearMatch = text.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
            vintage = parseInt(yearMatch[0]);
        }

        // Look for grape variety
        for (const grape of grapeVarieties) {
            if (text.toLowerCase().includes(grape.toLowerCase())) {
                grapeVariety = grape;
                break;
            }
        }

        // Look for region
        for (const reg of regions) {
            if (text.toLowerCase().includes(reg.toLowerCase())) {
                region = reg;
                break;
            }
        }

        // Use first meaningful line as wine name (skip common words)
        const skipWords = ['wine', 'vintage', 'product of', 'appellation'];
        for (const line of lines) {
            if (line.length > 3 && !skipWords.some(word => line.toLowerCase().includes(word))) {
                wineName = line;
                break;
            }
        }

        return {
            wineName,
            vintage,
            confidence: text.length > 10 ? 0.8 : 0.5, // Simple confidence based on text length
            grapeVariety,
            region
        };
    }

    /**
     * Check if the service is properly configured
     */
    public isConfigured(): boolean {
        return this.useRestAPI || this.client !== null;
    }
}

// Export singleton instance
export default new GoogleVisionService();
