import wineDatabase from '../data/wineDatabase.json';
import logger from '../utils/logger';

interface Wine {
    id: string;
    name: string;
    alternativeNames: string[];
    type: string;
    grapeVariety: string;
    commonRegions: string[];
    characteristics: {
        body: string;
        tannin?: string;
        acidity: string;
        sweetness?: string;
        alcohol: string;
    };
    aromas: string[];
    pairings: string[];
}

interface WineMatchResult {
    wine: Wine;
    matchScore: number;
    matchReason: string;
}

export class WineMatchingService {
    private wines: Wine[];

    constructor() {
        this.wines = wineDatabase.wines as Wine[];
        logger.info(`📚 Loaded ${this.wines.length} wines from database`);
    }

    /**
     * Match detected text from wine label to wines in database
     * Returns best matching wine with confidence score
     */
    public matchWine(detectedText: string, vintage?: number, region?: string): WineMatchResult | null {
        if (!detectedText || detectedText.length < 2) {
            return null;
        }

        const searchText = detectedText.toLowerCase();
        let bestMatch: WineMatchResult | null = null;
        let highestScore = 0;

        for (const wine of this.wines) {
            let score = 0;
            const reasons: string[] = [];

            // Check exact name match
            if (searchText.includes(wine.name.toLowerCase())) {
                score += 100;
                reasons.push('exact name match');
            }

            // Check alternative names
            for (const altName of wine.alternativeNames) {
                if (searchText.includes(altName.toLowerCase())) {
                    score += 90;
                    reasons.push(`alternative name match: ${altName}`);
                    break;
                }
            }

            // Check grape variety match
            if (searchText.includes(wine.grapeVariety.toLowerCase())) {
                score += 80;
                reasons.push('grape variety match');
            }

            // Check region match
            if (region) {
                for (const commonRegion of wine.commonRegions) {
                    if (
                        region.toLowerCase().includes(commonRegion.toLowerCase()) ||
                        commonRegion.toLowerCase().includes(region.toLowerCase())
                    ) {
                        score += 50;
                        reasons.push(`region match: ${commonRegion}`);
                        break;
                    }
                }
            }

            // Check aromas match (bonus points)
            for (const aroma of wine.aromas) {
                if (searchText.includes(aroma.toLowerCase())) {
                    score += 10;
                    reasons.push(`aroma keyword: ${aroma}`);
                }
            }

            if (score > highestScore && score > 50) {
                highestScore = score;
                bestMatch = {
                    wine,
                    matchScore: Math.min(score / 100, 1.0), // Normalize to 0-1
                    matchReason: reasons.join(', ')
                };
            }
        }

        if (bestMatch) {
            logger.info(
                `🎯 Wine matched: ${bestMatch.wine.name} (score: ${(bestMatch.matchScore * 100).toFixed(0)}%) - ${bestMatch.matchReason}`
            );
        }

        return bestMatch;
    }

    /**
     * Get wine recommendations based on food
     */
    public getWineRecommendations(foodName: string, maxResults: number = 5): Wine[] {
        const searchFood = foodName.toLowerCase().trim();
        const recommendations: Array<{ wine: Wine; score: number }> = [];

        for (const wine of this.wines) {
            let score = 0;

            // Check if food is in pairings
            for (const pairing of wine.pairings) {
                if (
                    searchFood.includes(pairing.toLowerCase()) ||
                    pairing.toLowerCase().includes(searchFood)
                ) {
                    score += 100;
                    break;
                }
            }

            if (score > 0) {
                recommendations.push({ wine, score });
            }
        }

        // Sort by score and return top results
        const sorted = recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults)
            .map(r => r.wine);

        logger.info(`🍷 Found ${sorted.length} wine recommendations for "${foodName}"`);
        return sorted;
    }

    /**
     * Get all wines of a specific type
     */
    public getWinesByType(type: 'red' | 'white' | 'rosé' | 'sparkling' | 'fortified'): Wine[] {
        return this.wines.filter(wine => wine.type === type);
    }

    /**
     * Get all wines by grape variety
     */
    public getWinesByGrape(grapeVariety: string): Wine[] {
        const searchGrape = grapeVariety.toLowerCase();
        return this.wines.filter(wine =>
            wine.grapeVariety.toLowerCase().includes(searchGrape)
        );
    }

    /**
     * Get wine details by name
     */
    public getWineByName(name: string): Wine | null {
        const searchName = name.toLowerCase();
        return this.wines.find(wine =>
            wine.name.toLowerCase() === searchName ||
            wine.alternativeNames.some(alt => alt.toLowerCase() === searchName)
        ) || null;
    }

    /**
     * Get all wines
     */
    public getAllWines(): Wine[] {
        return this.wines;
    }
}

// Export singleton instance
export default new WineMatchingService();
