import mongoose, { Document, Schema } from 'mongoose';

export interface IWine extends Document {
    name: string;
    type: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert';
    category?: string;
    region: string;
    country?: string;
    vintage?: number;
    grapeVariety?: string;
    description?: string;
    body?: number; // 1-4
    sweetness?: number; // 1-4
    acidity?: number; // 1-4
    tannin?: number; // 1-4
    alcohol?: number; // ABV percentage
    aromas?: string[];
    flavors?: string[];
    imageUrl?: string;
    rating?: number;
    price?: number;
    winery?: string;
    createdAt: Date;
    updatedAt: Date;
}

const WineSchema = new Schema<IWine>({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['red', 'white', 'rosé', 'sparkling', 'dessert'],
        index: true
    },
    category: {
        type: String,
        trim: true
    },
    region: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    country: {
        type: String,
        trim: true
    },
    vintage: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear() + 1
    },
    grapeVariety: {
        type: String,
        trim: true,
        index: true
    },
    description: {
        type: String,
        trim: true
    },
    body: {
        type: Number,
        min: 1,
        max: 4
    },
    sweetness: {
        type: Number,
        min: 1,
        max: 4
    },
    acidity: {
        type: Number,
        min: 1,
        max: 4
    },
    tannin: {
        type: Number,
        min: 1,
        max: 4
    },
    alcohol: {
        type: Number,
        min: 0,
        max: 25
    },
    aromas: [{
        type: String,
        trim: true
    }],
    flavors: [{
        type: String,
        trim: true
    }],
    imageUrl: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    price: {
        type: Number,
        min: 0
    },
    winery: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Create compound indexes for common queries
WineSchema.index({ name: 'text', description: 'text' });
WineSchema.index({ type: 1, region: 1 });
WineSchema.index({ grapeVariety: 1, vintage: -1 });

export default mongoose.model<IWine>('Wine', WineSchema);
