import { v4 as uuidv4 } from 'uuid';

interface Pairing {
    id: string;
    wine: string;
    food: string[];
    rating?: number;
}

export class PairingService {
    private pairings: Pairing[];

    constructor() {
        this.pairings = [];
        this.initializePairings();
    }

    private initializePairings() {
        // Example pairings, this should be replaced with a database call
        this.pairings = [
            { id: '1', wine: 'Cabernet Sauvignon', food: ['Steak', 'Lamb'], rating: 5 },
            { id: '2', wine: 'Chardonnay', food: ['Chicken', 'Seafood'], rating: 4 },
            { id: '3', wine: 'Pinot Noir', food: ['Duck', 'Mushrooms'], rating: 5 },
            { id: '4', wine: 'Sauvignon Blanc', food: ['Salad', 'Fish'], rating: 4 },
            { id: '5', wine: 'Malbec', food: ['Beef', 'Burger'], rating: 5 }
        ];
    }

    public async getAllPairings(): Promise<Pairing[]> {
        return this.pairings;
    }

    public async addPairing(pairingData: { wine: string; food: string[] }): Promise<Pairing> {
        const newPairing: Pairing = {
            id: uuidv4(),
            wine: pairingData.wine,
            food: pairingData.food,
            rating: 0
        };
        this.pairings.push(newPairing);
        return newPairing;
    }

    public async getExpertPairings(): Promise<Pairing[]> {
        return this.pairings.filter(p => p.rating && p.rating >= 4);
    }
}