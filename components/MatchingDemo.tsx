import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../constants/colors';
import { findWinePairings, findFoodPairings, getWineDetails } from '../utils/matchingLogic';

export default function MatchingDemo() {
  const [selectedFood, setSelectedFood] = useState<string>('');
  const [selectedWine, setSelectedWine] = useState<string>('');
  const [pairings, setPairings] = useState<{ wines: string[], reasoning: string } | null>(null);
  const [foodPairings, setFoodPairings] = useState<{ foods: string[], reasoning: string } | null>(null);

  const testFoods = ['steak', 'salmon', 'chicken', 'pasta', 'cheese', 'chocolate'];
  const testWines = ['Cabernet Sauvignon', 'Pinot Noir', 'Chardonnay', 'Sauvignon Blanc', 'Champagne', 'Port'];

  const handleFoodSelect = (food: string) => {
    setSelectedFood(food);
    const result = findWinePairings(food);
    setPairings(result);
  };

  const handleWineSelect = (wine: string) => {
    setSelectedWine(wine);
    const result = findFoodPairings(wine);
    setFoodPairings(result);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🍷 Wine-Food Matching Demo</Text>
      
      {/* Food to Wine Matching */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Find Wine for Food</Text>
        <View style={styles.buttonGrid}>
          {testFoods.map((food) => (
            <TouchableOpacity
              key={food}
              style={[styles.button, selectedFood === food && styles.selectedButton]}
              onPress={() => handleFoodSelect(food)}
            >
              <Text style={[styles.buttonText, selectedFood === food && styles.selectedButtonText]}>
                {food}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {pairings && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Recommended Wines:</Text>
            {pairings.wines.map((wine, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultText}>🍷 {wine}</Text>
                {getWineDetails(wine) && (
                  <Text style={styles.resultDetails}>
                    {getWineDetails(wine)?.body} bodied • {getWineDetails(wine)?.type} wine
                  </Text>
                )}
              </View>
            ))}
            <Text style={styles.reasoning}>💡 {pairings.reasoning}</Text>
          </View>
        )}
      </View>

      {/* Wine to Food Matching */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Find Food for Wine</Text>
        <View style={styles.buttonGrid}>
          {testWines.map((wine) => (
            <TouchableOpacity
              key={wine}
              style={[styles.button, selectedWine === wine && styles.selectedButton]}
              onPress={() => handleWineSelect(wine)}
            >
              <Text style={[styles.buttonText, selectedWine === wine && styles.selectedButtonText]}>
                {wine}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {foodPairings && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Recommended Foods:</Text>
            {foodPairings.foods.map((food, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultText}>🍽️ {food}</Text>
              </View>
            ))}
            <Text style={styles.reasoning}>💡 {foodPairings.reasoning}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 15,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  selectedButton: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  results: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 10,
  },
  resultItem: {
    marginBottom: 8,
  },
  resultText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  resultDetails: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 20,
  },
  reasoning: {
    fontSize: 13,
    color: Colors.light.primary,
    fontStyle: 'italic',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
});
