import Wine, { IWine } from '../models/Wine';
import logger from '../utils/logger';

export class WineService {
    constructor() {
        this.initializeSampleWines();
    }

    // Initialize with sample wines if database is empty
    private async initializeSampleWines() {
        try {
            const count = await Wine.countDocuments();
            if (count === 0) {
                const sampleWines = [
                    {
                        name: 'Cabernet Sauvignon',
                        type: 'red' as const,
                        region: 'Napa Valley',
                        country: 'USA',
                        vintage: 2020,
                        grapeVariety: 'Cabernet Sauvignon',
                        description: 'Full-bodied red with bold tannins',
                        body: 4,
                        sweetness: 1,
                        acidity: 3,
                        tannin: 4,
                        alcohol: 14.5,
                        aromas: ['blackcurrant', 'oak', 'tobacco'],
                        rating: 4.5
                    },
                    {
                        name: 'Chardonnay',
                        type: 'white' as const,
                        region: 'Burgundy',
                        country: 'France',
                        vintage: 2021,
                        grapeVariety: 'Chardonnay',
                        description: 'Full-bodied white with apple and butter notes',
                        body: 3,
                        sweetness: 2,
                        acidity: 3,
                        alcohol: 13.5,
                        aromas: ['apple', 'butter', 'vanilla'],
                        rating: 4.3
                    },
                    {
                        name: 'Pinot Noir',
                        type: 'red' as const,
                        region: 'Oregon',
                        country: 'USA',
                        vintage: 2019,
                        grapeVariety: 'Pinot Noir',
                        description: 'Light to medium-bodied red with red fruit',
                        body: 2,
                        sweetness: 1,
                        acidity: 3,
                        tannin: 2,
                        alcohol: 13.0,
                        aromas: ['cherry', 'raspberry', 'earth'],
                        rating: 4.2
                    },
                    {
                        name: 'Sauvignon Blanc',
                        type: 'white' as const,
                        region: 'Marlborough',
                        country: 'New Zealand',
                        vintage: 2022,
                        grapeVariety: 'Sauvignon Blanc',
                        description: 'Crisp white with citrus notes',
                        body: 2,
                        sweetness: 1,
                        acidity: 4,
                        alcohol: 12.5,
                        aromas: ['lime', 'grapefruit', 'grass'],
                        rating: 4.0
                    }
                ];

                await Wine.insertMany(sampleWines);
                logger.info('✅ Sample wines initialized in database');
            }
        } catch (error) {
            logger.error('Error initializing sample wines:', error);
        }
    }

    public async getWineById(id: string): Promise<IWine | null> {
        try {
            return await Wine.findById(id);
        } catch (error) {
            logger.error(`Error fetching wine by ID ${id}:`, error);
            return null;
        }
    }

    public async getAllWines(filters?: {
        type?: string;
        region?: string;
        grapeVariety?: string;
        minRating?: number;
    }): Promise<IWine[]> {
        try {
            const query: any = {};

            if (filters?.type) query.type = filters.type;
            if (filters?.region) query.region = new RegExp(filters.region, 'i');
            if (filters?.grapeVariety) query.grapeVariety = new RegExp(filters.grapeVariety, 'i');
            if (filters?.minRating) query.rating = { $gte: filters.minRating };

            return await Wine.find(query).sort({ rating: -1, name: 1 });
        } catch (error) {
            logger.error('Error fetching wines:', error);
            return [];
        }
    }

    public async addWine(wineData: Partial<IWine>): Promise<IWine> {
        try {
            const wine = new Wine(wineData);
            await wine.save();
            logger.info(`✅ Wine created: ${wine.name} (${wine._id})`);
            return wine;
        } catch (error) {
            logger.error('Error adding wine:', error);
            throw error;
        }
    }

    public async updateWine(id: string, wineData: Partial<IWine>): Promise<IWine | null> {
        try {
            const wine = await Wine.findByIdAndUpdate(
                id,
                { $set: wineData },
                { new: true, runValidators: true }
            );

            if (wine) {
                logger.info(`✅ Wine updated: ${wine.name} (${wine._id})`);
            }

            return wine;
        } catch (error) {
            logger.error(`Error updating wine ${id}:`, error);
            return null;
        }
    }

    public async deleteWine(id: string): Promise<boolean> {
        try {
            const result = await Wine.findByIdAndDelete(id);
            if (result) {
                logger.info(`✅ Wine deleted: ${result.name} (${result._id})`);
                return true;
            }
            return false;
        } catch (error) {
            logger.error(`Error deleting wine ${id}:`, error);
            return false;
        }
    }

    public async searchWines(searchTerm: string): Promise<IWine[]> {
        try {
            return await Wine.find({
                $text: { $search: searchTerm }
            }).sort({ rating: -1 }).limit(20);
        } catch (error) {
            logger.error('Error searching wines:', error);
            return [];
        }
    }
}
