import Colors from '../constants/colors';
import { useApp } from '../contexts/AppContext';
import { Wine, Bookmark, Settings } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

type Tab = 'saved' | 'pairings';

export default function ProfileScreen() {
  const { user, savedPairings } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('saved');

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Please log in</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}

          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color={Colors.light.primary} />
            <Text style={styles.settingsButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
            onPress={() => setActiveTab('saved')}
          >
            <Wine size={20} color={activeTab === 'saved' ? Colors.light.primary : Colors.light.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
              Saved Wines
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'pairings' && styles.tabActive]}
            onPress={() => setActiveTab('pairings')}
          >
            <Bookmark size={20} color={activeTab === 'pairings' ? Colors.light.primary : Colors.light.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'pairings' && styles.tabTextActive]}>
              Pairings
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'pairings' && (
            <View style={styles.pairingsList}>
              {savedPairings.length === 0 ? (
                <View style={styles.emptyState}>
                  <Bookmark size={48} color={Colors.light.textSecondary} />
                  <Text style={styles.emptyText}>No saved pairings</Text>
                  <Text style={styles.emptySubtext}>
                    Save pairings as you discover them
                  </Text>
                </View>
              ) : (
                savedPairings.map((pairing, index) => (
                  <View key={index} style={styles.pairingCard}>
                    <View style={styles.pairingHeader}>
                      <Text style={styles.pairingFood}>{pairing.food}</Text>
                    </View>
                    <View style={styles.pairingWines}>
                      {pairing.wines.map((wine, wineIndex) => (
                        <View key={wineIndex} style={styles.wineTag}>
                          <Text style={styles.wineTagText}>{wine}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'saved' && (
            <View style={styles.emptyState}>
              <Wine size={48} color={Colors.light.textSecondary} />
              <Text style={styles.emptyText}>No saved wines yet</Text>
              <Text style={styles.emptySubtext}>
                Start scanning and saving your favorite wines
              </Text>
            </View>
          )}
        </View>
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
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.border,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  userBio: {
    fontSize: 15,
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
    marginTop: 20,
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  tabActive: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.primary,
  },
  tabContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  pairingsList: {
    gap: 16,
  },
  pairingCard: {
    padding: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  pairingHeader: {
    marginBottom: 12,
  },
  pairingFood: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    textTransform: 'capitalize',
  },
  pairingWines: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wineTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  wineTagText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
