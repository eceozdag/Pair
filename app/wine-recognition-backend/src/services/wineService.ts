import { v4 as uuidv4 } from 'uuid';

interface Wine {
    id: string;
    name: string;
    type: string;
    region: string;
    vintage?: string;
    grapeVariety?: string;
    description?: string;
}

export class WineService {
    private wines: Wine[];

    constructor() {
        this.wines = [];
        this.initializeWines();
    }

    private initializeWines() {
        this.wines = [
            { 
                id: '1', 
                name: 'Cabernet Sauvignon', 
                type: 'red', 
                region: 'Napa Valley', 
                vintage: '2020',
                grapeVariety: 'Cabernet Sauvignon',
                description: 'Full-bodied red with bold tannins'
            },
            { 
                id: '2', 
                name: 'Chardonnay', 
                type: 'white', 
                region: 'Burgundy', 
                vintage: '2021',
                grapeVariety: 'Chardonnay',
                description: 'Full-bodied white with apple and butter notes'
            },
            { 
                id: '3', 
                name: 'Pinot Noir', 
                type: 'red', 
                region: 'Oregon', 
                vintage: '2019',
                grapeVariety: 'Pinot Noir',
                description: 'Light to medium-bodied red with red fruit'
            },
            { 
                id: '4', 
                name: 'Sauvignon Blanc', 
                type: 'white', 
                region: 'New Zealand', 
                vintage: '2022',
                grapeVariety: 'Sauvignon Blanc',
                description: 'Crisp white with citrus notes'
            }
        ];
    }

    public async getWineById(id: string): Promise<Wine | null> {
        return this.wines.find(w => w.id === id) || null;
    }

    public async getAllWines(): Promise<Wine[]> {
        return this.wines;
    }

    public async addWine(wineData: Omit<Wine, 'id'>): Promise<Wine> {
        const newWine: Wine = {
            id: uuidv4(),
            ...wineData
        };
        this.wines.push(newWine);
        return newWine;
    }

    public async updateWine(id: string, wineData: Partial<Wine>): Promise<Wine | null> {
        const index = this.wines.findIndex(w => w.id === id);
        if (index === -1) return null;
        
        this.wines[index] = { ...this.wines[index], ...wineData };
        return this.wines[index];
    }

    public async deleteWine(id: string): Promise<boolean> {
        const index = this.wines.findIndex(w => w.id === id);
        if (index === -1) return false;
        
        this.wines.splice(index, 1);
        return true;
    }
}
