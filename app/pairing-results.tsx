import { foodWinePairings, wineDescriptions } from '@/constants/pairings';
import Colors from '../constants/colors';

import { useApp } from '../contexts/AppContext';
import { findWinePairings, findFoodPairings, getWineDetails } from '../utils/matchingLogic';
// import { generateText } from '@rork/toolkit-sdk';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Wine, Bookmark, Share2, Sparkles, Loader } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';

interface WineData {
  name: string;
  type: string;
  region: string;
  vintage?: string;
  grapeVariety?: string;
}

interface FoodData {
  food: string;
}

export default function PairingResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { savePairing } = useApp();
  const [savedLocal, setSavedLocal] = useState(false);

  const type = params.type as string;
  const data = params.data ? JSON.parse(params.data as string) : null;

  const wineData: WineData | null = type === 'wine' ? data : null;
  const foodData: FoodData | null = type === 'food' ? data : null;

  const aiMutation = useMutation({
    mutationFn: async (food: string) => {
      // Mock AI implementation - in a real app, this would call an AI service
      const mockWines = [
        ['Cabernet Sauvignon', 'Malbec', 'Syrah'],
        ['Pinot Noir', 'Chardonnay', 'Sauvignon Blanc'],
        ['Riesling', 'Gewürztraminer', 'Chenin Blanc'],
        ['Zinfandel', 'Sangiovese', 'Barbera'],
        ['Champagne', 'Prosecco', 'Cava']
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockWines[Math.floor(Math.random() * mockWines.length)];
    },
  });

  const suggestedWines = useMemo((): string[] => {
    if (type === 'wine' && wineData) {
      return [];
    }

    if (type === 'food' && foodData) {
      // Use enhanced matching logic
      const smartPairings = findWinePairings(foodData.food);
      console.log('Smart pairings:', smartPairings);
      
      // If we have good smart pairings, use them
      if (smartPairings.wines.length > 0) {
        return smartPairings.wines;
      }

      // Fallback to original logic
      const food = foodData.food.toLowerCase();
      for (const [key, wines] of Object.entries(foodWinePairings)) {
        if (food.includes(key) || key.includes(food.split(' ')[0])) {
          return wines as string[];
        }
      }

      if (aiMutation.data) {
        return aiMutation.data as string[];
      }

      if (!aiMutation.isPending && !aiMutation.data) {
        aiMutation.mutate(foodData.food);
      }

      return ['Pinot Noir', 'Chardonnay', 'Sauvignon Blanc'];
    }

    return [];
  }, [type, wineData, foodData, aiMutation.data]);

  const suggestedFoods = useMemo(() => {
    if (type === 'food' || !wineData) return [];

    // Use enhanced matching logic for wine-to-food pairings
    const smartPairings = findFoodPairings(wineData.name);
    console.log('Smart food pairings:', smartPairings);
    
    if (smartPairings.foods.length > 0) {
      return smartPairings.foods;
    }

    // Fallback to original logic
    const wineType = wineData.grapeVariety || wineData.type;
    const foods: string[] = [];

    for (const [food, wines] of Object.entries(foodWinePairings)) {
      if (wines.some(w => wineType.toLowerCase().includes(w.toLowerCase()) || w.toLowerCase().includes(wineType.toLowerCase()))) {
        foods.push(food);
      }
    }

    return foods.slice(0, 8);
  }, [type, wineData]);

  const handleSave = () => {
    if (type === 'food' && foodData) {
      savePairing(foodData.food, suggestedWines);
      setSavedLocal(true);
      Alert.alert('Saved!', 'Pairing saved to your profile');
    }
  };

  const handleShare = () => {
    if (type === 'food' && foodData) {
      Alert.alert('Share', `Share pairing for ${foodData.food}`);
    } else if (type === 'wine' && wineData) {
      Alert.alert('Share', `Share ${wineData.name}`);
    }
  };

  if (aiMutation.isPending && suggestedWines.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Sparkles size={48} color={Colors.light.accent} />
          <Text style={styles.loadingText}>Finding perfect pairings...</Text>
          <Text style={styles.loadingSubtext}>Using AI to analyze your dish</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {type === 'wine' && wineData && (
          <View style={styles.wineInfoCard}>
            <View style={styles.wineIconContainer}>
              <Wine size={40} color={Colors.light.primary} strokeWidth={2} />
            </View>
            <Text style={styles.wineName}>{wineData.name}</Text>
            <Text style={styles.wineDetails}>{wineData.type}</Text>
            <Text style={styles.wineRegion}>{wineData.region}</Text>
            {wineData.vintage && (
              <Text style={styles.wineVintage}>Vintage {wineData.vintage}</Text>
            )}
          </View>
        )}

        {type === 'food' && foodData && (
          <View style={styles.foodInfoCard}>
            <Text style={styles.foodEmoji}>🍽️</Text>
            <Text style={styles.foodName}>{foodData.food}</Text>
          </View>
        )}

        {type === 'food' && suggestedWines.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended Wines</Text>
              {aiMutation.data && (
                <View style={styles.aiBadge}>
                  <Sparkles size={14} color={Colors.light.accent} />
                  <Text style={styles.aiBadgeText}>AI Powered</Text>
                </View>
              )}
            </View>

            <View style={styles.winesList}>
              {suggestedWines.map((wine, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.wineCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.wineCardIcon}>
                    <Wine size={24} color={Colors.light.primary} />
                  </View>
                  <View style={styles.wineCardContent}>
                    <Text style={styles.wineCardName}>{wine}</Text>
                    {wineDescriptions[wine] && (
                      <Text style={styles.wineCardDescription}>
                        {wineDescriptions[wine]}
                      </Text>
                    )}
                    {getWineDetails(wine) && (
                      <Text style={styles.wineCardDetails}>
                        {getWineDetails(wine)?.body} bodied • {getWineDetails(wine)?.type} wine
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, savedLocal && styles.actionButtonSaved]}
                onPress={handleSave}
                disabled={savedLocal}
              >
                <Bookmark size={20} color={savedLocal ? Colors.light.accent : Colors.light.primary} />
                <Text style={[styles.actionButtonText, savedLocal && styles.actionButtonTextSaved]}>
                  {savedLocal ? 'Saved' : 'Save Pairing'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Share2 size={20} color={Colors.light.primary} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {type === 'wine' && suggestedFoods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pairs Well With</Text>

            <View style={styles.foodsList}>
              {suggestedFoods.map((food, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.foodTag}
                  activeOpacity={0.7}
                >
                  <Text style={styles.foodTagText}>{food}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Share2 size={20} color={Colors.light.primary} />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        )}

        {type === 'food' && aiMutation.isPending && suggestedWines.length > 0 && (
          <View style={styles.loadingMore}>
            <Loader size={20} color={Colors.light.textSecondary} />
            <Text style={styles.loadingMoreText}>Loading more suggestions...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  wineInfoCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  wineIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wineName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  wineDetails: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  wineRegion: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  wineVintage: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  foodInfoCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  foodEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  foodName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.accent,
  },
  winesList: {
    gap: 12,
    marginBottom: 20,
  },
  wineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  wineCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wineCardContent: {
    flex: 1,
  },
  wineCardName: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  wineCardDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  wineCardDetails: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '500' as const,
    marginTop: 4,
  },
  foodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  foodTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  foodTagText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  actionButtonSaved: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.accent,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  actionButtonTextSaved: {
    color: Colors.light.accent,
  },
  loadingMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  loadingMoreText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
