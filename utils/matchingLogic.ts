import { foodWinePairings, wineDescriptions } from '../constants/pairings';

export interface Wine {
  name: string;
  type: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert';
  body: 'light' | 'medium' | 'full';
  sweetness: 'dry' | 'off-dry' | 'semi-sweet' | 'sweet';
  acidity: 'low' | 'medium' | 'high';
  tannins: 'low' | 'medium' | 'high';
  description: string;
}

export interface Food {
  name: string;
  category: string;
  intensity: 'light' | 'medium' | 'bold';
  preparation: string;
  flavors: string[];
}

// Enhanced wine database
export const wineDatabase: Record<string, Wine> = {
  'Cabernet Sauvignon': {
    name: 'Cabernet Sauvignon',
    type: 'red',
    body: 'full',
    sweetness: 'dry',
    acidity: 'medium',
    tannins: 'high',
    description: 'Full-bodied red with bold tannins, black currant, and oak'
  },
  'Pinot Noir': {
    name: 'Pinot Noir',
    type: 'red',
    body: 'light',
    sweetness: 'dry',
    acidity: 'high',
    tannins: 'low',
    description: 'Light to medium-bodied red with red fruit, earthy, and silky'
  },
  'Malbec': {
    name: 'Malbec',
    type: 'red',
    body: 'full',
    sweetness: 'dry',
    acidity: 'medium',
    tannins: 'medium',
    description: 'Medium to full-bodied red with dark fruit and smooth finish'
  },
  'Syrah': {
    name: 'Syrah',
    type: 'red',
    body: 'full',
    sweetness: 'dry',
    acidity: 'medium',
    tannins: 'high',
    description: 'Full-bodied red with dark fruit, pepper, and smoky notes'
  },
  'Chardonnay': {
    name: 'Chardonnay',
    type: 'white',
    body: 'full',
    sweetness: 'dry',
    acidity: 'medium',
    tannins: 'low',
    description: 'Full-bodied white with apple, butter, and vanilla notes'
  },
  'Sauvignon Blanc': {
    name: 'Sauvignon Blanc',
    type: 'white',
    body: 'light',
    sweetness: 'dry',
    acidity: 'high',
    tannins: 'low',
    description: 'Crisp white with citrus, grass, and mineral notes'
  },
  'Pinot Grigio': {
    name: 'Pinot Grigio',
    type: 'white',
    body: 'light',
    sweetness: 'dry',
    acidity: 'high',
    tannins: 'low',
    description: 'Light white with citrus and floral notes'
  },
  'Riesling': {
    name: 'Riesling',
    type: 'white',
    body: 'light',
    sweetness: 'off-dry',
    acidity: 'high',
    tannins: 'low',
    description: 'Aromatic white with apple, honey, and floral notes'
  },
  'Champagne': {
    name: 'Champagne',
    type: 'sparkling',
    body: 'light',
    sweetness: 'dry',
    acidity: 'high',
    tannins: 'low',
    description: 'Sparkling with citrus, toast, and elegance'
  },
  'Port': {
    name: 'Port',
    type: 'dessert',
    body: 'full',
    sweetness: 'sweet',
    acidity: 'low',
    tannins: 'high',
    description: 'Fortified sweet wine with dark fruit and chocolate'
  }
};

// Enhanced food database
export const foodDatabase: Record<string, Food> = {
  'steak': {
    name: 'steak',
    category: 'red meat',
    intensity: 'bold',
    preparation: 'grilled',
    flavors: ['beefy', 'charred', 'umami']
  },
  'salmon': {
    name: 'salmon',
    category: 'fish',
    intensity: 'medium',
    preparation: 'grilled',
    flavors: ['oily', 'rich', 'delicate']
  },
  'chicken': {
    name: 'chicken',
    category: 'poultry',
    intensity: 'light',
    preparation: 'roasted',
    flavors: ['mild', 'tender', 'versatile']
  },
  'pasta': {
    name: 'pasta',
    category: 'carbohydrate',
    intensity: 'medium',
    preparation: 'boiled',
    flavors: ['starchy', 'neutral', 'comforting']
  },
  'cheese': {
    name: 'cheese',
    category: 'dairy',
    intensity: 'bold',
    preparation: 'aged',
    flavors: ['creamy', 'salty', 'complex']
  },
  'chocolate': {
    name: 'chocolate',
    category: 'dessert',
    intensity: 'bold',
    preparation: 'dark',
    flavors: ['sweet', 'bitter', 'rich']
  }
};

// Smart matching algorithm
export function findWinePairings(foodName: string): { wines: string[], reasoning: string } {
  const food = foodDatabase[foodName.toLowerCase()];
  
  if (!food) {
    // Fallback to simple keyword matching
    return findPairingsByKeywords(foodName);
  }

  const suitableWines: string[] = [];
  const reasoning: string[] = [];

  // Match by intensity
  for (const [wineName, wine] of Object.entries(wineDatabase)) {
    let score = 0;
    let reasons: string[] = [];

    // Intensity matching
    if (food.intensity === 'bold' && wine.body === 'full') {
      score += 3;
      reasons.push('bold food pairs with full-bodied wine');
    } else if (food.intensity === 'light' && wine.body === 'light') {
      score += 3;
      reasons.push('light food pairs with light wine');
    } else if (food.intensity === 'medium' && wine.body === 'medium') {
      score += 3;
      reasons.push('medium intensity food pairs with medium-bodied wine');
    }

    // Category-specific matching
    if (food.category === 'red meat' && wine.type === 'red') {
      score += 2;
      reasons.push('red meat traditionally pairs with red wine');
    } else if (food.category === 'fish' && wine.type === 'white') {
      score += 2;
      reasons.push('fish pairs well with white wine');
    } else if (food.category === 'dessert' && wine.sweetness === 'sweet') {
      score += 2;
      reasons.push('dessert pairs with sweet wine');
    }

    // Acidity matching
    if (food.flavors.includes('acidic') && wine.acidity === 'high') {
      score += 1;
      reasons.push('high acidity wine cuts through acidic food');
    }

    // Tannin matching
    if (food.flavors.includes('fatty') && wine.tannins === 'high') {
      score += 1;
      reasons.push('tannins cut through fatty food');
    }

    if (score >= 3) {
      suitableWines.push(wineName);
      reasoning.push(`${wineName}: ${reasons.join(', ')}`);
    }
  }

  // Fallback to original pairings if no matches found
  if (suitableWines.length === 0) {
    return findPairingsByKeywords(foodName);
  }

  return {
    wines: suitableWines.slice(0, 5), // Return top 5 matches
    reasoning: reasoning.join('; ')
  };
}

// Fallback keyword matching
function findPairingsByKeywords(foodName: string): { wines: string[], reasoning: string } {
  const food = foodName.toLowerCase();
  
  for (const [key, wines] of Object.entries(foodWinePairings)) {
    if (food.includes(key) || key.includes(food.split(' ')[0])) {
      return {
        wines,
        reasoning: `Traditional pairing for ${key}`
      };
    }
  }

  // Default pairings
  return {
    wines: ['Pinot Noir', 'Chardonnay', 'Sauvignon Blanc'],
    reasoning: 'Versatile wines that pair with most foods'
  };
}

// Reverse pairing: find foods for a wine
export function findFoodPairings(wineName: string): { foods: string[], reasoning: string } {
  const wine = wineDatabase[wineName];
  
  if (!wine) {
    return {
      foods: ['chicken', 'pasta', 'cheese'],
      reasoning: 'Versatile foods that pair with most wines'
    };
  }

  const suitableFoods: string[] = [];
  const reasoning: string[] = [];

  for (const [foodName, food] of Object.entries(foodDatabase)) {
    let score = 0;
    let reasons: string[] = [];

    // Body matching
    if (wine.body === 'full' && food.intensity === 'bold') {
      score += 2;
      reasons.push('full-bodied wine pairs with bold food');
    } else if (wine.body === 'light' && food.intensity === 'light') {
      score += 2;
      reasons.push('light wine pairs with light food');
    }

    // Type-specific matching
    if (wine.type === 'red' && food.category === 'red meat') {
      score += 2;
      reasons.push('red wine pairs with red meat');
    } else if (wine.type === 'white' && food.category === 'fish') {
      score += 2;
      reasons.push('white wine pairs with fish');
    } else if (wine.type === 'sparkling' && food.category === 'appetizer') {
      score += 2;
      reasons.push('sparkling wine pairs with appetizers');
    }

    if (score >= 2) {
      suitableFoods.push(foodName);
      reasoning.push(`${foodName}: ${reasons.join(', ')}`);
    }
  }

  return {
    foods: suitableFoods.slice(0, 5),
    reasoning: reasoning.join('; ')
  };
}

// Get wine details
export function getWineDetails(wineName: string): Wine | null {
  return wineDatabase[wineName] || null;
}

// Get food details
export function getFoodDetails(foodName: string): Food | null {
  return foodDatabase[foodName] || null;
}
