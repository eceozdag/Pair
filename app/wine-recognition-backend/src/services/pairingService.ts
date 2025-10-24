export class PairingService {
    private pairings: Map<string, string[]>;

    constructor() {
        this.pairings = new Map();
        this.initializePairings();
    }

    private initializePairings() {
        // Example pairings, this should be replaced with a database call
        this.pairings.set('Cabernet Sauvignon', ['Steak', 'Lamb']);
        this.pairings.set('Chardonnay', ['Chicken', 'Seafood']);
        this.pairings.set('Pinot Noir', ['Duck', 'Mushrooms']);
    }

    public getPairings(wine: string): string[] | null {
        return this.pairings.get(wine) || null;
    }

    public addPairing(wine: string, food: string): void {
        if (!this.pairings.has(wine)) {
            this.pairings.set(wine, []);
        }
        this.pairings.get(wine)?.push(food);
    }

    public getExpertPairings(): Map<string, string[]> {
        return this.pairings;
    }
}