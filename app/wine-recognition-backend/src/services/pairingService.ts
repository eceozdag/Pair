import Pairing, { IPairing } from '../models/Pairing';
import Wine from '../models/Wine';
import logger from '../utils/logger';

export class PairingService {
    constructor() {
        this.initializeSamplePairings();
    }

    // Initialize with sample pairings if database is empty
    private async initializeSamplePairings() {
        try {
            const count = await Pairing.countDocuments();
            if (count === 0) {
                // Get sample wines to create pairings
                const wines = await Wine.find().limit(5);

                if (wines.length > 0) {
                    const samplePairings = [
                        {
                            wineId: wines[0]._id,
                            wineName: wines[0].name,
                            wineType: wines[0].type,
                            foodCategory: 'Meat',
                            foodName: 'Grilled Steak',
                            foodDescription: 'Premium ribeye steak with herbs',
                            pairingScore: 95,
                            pairingReason: 'Bold tannins complement rich meat',
                            complementaryFlavors: ['umami', 'char', 'fat'],
                            isVerified: true,
                            votes: 42
                        },
                        {
                            wineId: wines[0]._id,
                            wineName: wines[0].name,
                            wineType: wines[0].type,
                            foodCategory: 'Meat',
                            foodName: 'Lamb Chops',
                            foodDescription: 'Herb-crusted lamb chops',
                            pairingScore: 92,
                            pairingReason: 'Full-bodied wine matches rich lamb',
                            complementaryFlavors: ['herbs', 'fat', 'gamey'],
                            isVerified: true,
                            votes: 38
                        }
                    ];

                    if (wines.length > 1) {
                        samplePairings.push(
                            {
                                wineId: wines[1]._id,
                                wineName: wines[1].name,
                                wineType: wines[1].type,
                                foodCategory: 'Poultry',
                                foodName: 'Roasted Chicken',
                                foodDescription: 'Herb-roasted chicken with butter',
                                pairingScore: 88,
                                pairingReason: 'Creamy texture matches buttery chicken',
                                complementaryFlavors: ['butter', 'herbs', 'cream'],
                                isVerified: true,
                                votes: 35
                            },
                            {
                                wineId: wines[1]._id,
                                wineName: wines[1].name,
                                wineType: wines[1].type,
                                foodCategory: 'Seafood',
                                foodName: 'Lobster',
                                foodDescription: 'Butter-poached lobster tail',
                                pairingScore: 90,
                                pairingReason: 'Rich wine complements sweet lobster',
                                complementaryFlavors: ['butter', 'sweetness', 'richness'],
                                isVerified: true,
                                votes: 40
                            }
                        );
                    }

                    await Pairing.insertMany(samplePairings);
                    logger.info('✅ Sample pairings initialized in database');
                }
            }
        } catch (error) {
            logger.error('Error initializing sample pairings:', error);
        }
    }

    public async getAllPairings(filters?: {
        wineId?: string;
        foodCategory?: string;
        minScore?: number;
        verified?: boolean;
    }): Promise<IPairing[]> {
        try {
            const query: any = {};

            if (filters?.wineId) query.wineId = filters.wineId;
            if (filters?.foodCategory) query.foodCategory = new RegExp(filters.foodCategory, 'i');
            if (filters?.minScore) query.pairingScore = { $gte: filters.minScore };
            if (filters?.verified !== undefined) query.isVerified = filters.verified;

            return await Pairing.find(query)
                .populate('wineId', 'name type region')
                .sort({ pairingScore: -1, votes: -1 });
        } catch (error) {
            logger.error('Error fetching pairings:', error);
            return [];
        }
    }

    public async getPairingsByWineId(wineId: string): Promise<IPairing[]> {
        try {
            return await Pairing.find({ wineId })
                .sort({ pairingScore: -1 })
                .limit(10);
        } catch (error) {
            logger.error(`Error fetching pairings for wine ${wineId}:`, error);
            return [];
        }
    }

    public async addPairing(pairingData: {
        wineId: string;
        foodCategory: string;
        foodName: string;
        foodDescription?: string;
        pairingScore?: number;
        pairingReason?: string;
    }): Promise<IPairing> {
        try {
            // Get wine details
            const wine = await Wine.findById(pairingData.wineId);
            if (!wine) {
                throw new Error('Wine not found');
            }

            const pairing = new Pairing({
                wineId: pairingData.wineId,
                wineName: wine.name,
                wineType: wine.type,
                foodCategory: pairingData.foodCategory,
                foodName: pairingData.foodName,
                foodDescription: pairingData.foodDescription,
                pairingScore: pairingData.pairingScore || 50,
                pairingReason: pairingData.pairingReason,
                isVerified: false,
                votes: 0
            });

            await pairing.save();
            logger.info(`✅ Pairing created: ${pairing.foodName} + ${wine.name}`);
            return pairing;
        } catch (error) {
            logger.error('Error adding pairing:', error);
            throw error;
        }
    }

    public async getExpertPairings(minScore: number = 85): Promise<IPairing[]> {
        try {
            return await Pairing.find({
                pairingScore: { $gte: minScore },
                isVerified: true
            })
                .populate('wineId', 'name type region')
                .sort({ pairingScore: -1 })
                .limit(20);
        } catch (error) {
            logger.error('Error fetching expert pairings:', error);
            return [];
        }
    }

    public async updatePairing(id: string, pairingData: Partial<IPairing>): Promise<IPairing | null> {
        try {
            const pairing = await Pairing.findByIdAndUpdate(
                id,
                { $set: pairingData },
                { new: true, runValidators: true }
            );

            if (pairing) {
                logger.info(`✅ Pairing updated: ${pairing.foodName} (${pairing._id})`);
            }

            return pairing;
        } catch (error) {
            logger.error(`Error updating pairing ${id}:`, error);
            return null;
        }
    }

    public async deletePairing(id: string): Promise<boolean> {
        try {
            const result = await Pairing.findByIdAndDelete(id);
            if (result) {
                logger.info(`✅ Pairing deleted: ${result.foodName} (${result._id})`);
                return true;
            }
            return false;
        } catch (error) {
            logger.error(`Error deleting pairing ${id}:`, error);
            return false;
        }
    }

    public async votePairing(id: string, increment: number = 1): Promise<IPairing | null> {
        try {
            const pairing = await Pairing.findByIdAndUpdate(
                id,
                { $inc: { votes: increment } },
                { new: true }
            );

            return pairing;
        } catch (error) {
            logger.error(`Error voting on pairing ${id}:`, error);
            return null;
        }
    }
}