import Colors from '../constants/colors';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { Wine, Bookmark, Settings, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Modal,
} from 'react-native';

type Tab = 'saved' | 'pairings';

function ProfileContent() {
  const { savedPairings } = useApp();
  const { user: authUser, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('saved');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    console.log('Logging out...');
    await logout();
    setShowLogoutModal(false);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: authUser?.profileImageUrl || 'https://via.placeholder.com/100' }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>
            {authUser?.firstName && authUser?.lastName 
              ? `${authUser.firstName} ${authUser.lastName}` 
              : authUser?.username || 'User'}
          </Text>
          <Text style={styles.userEmail}>{authUser?.email}</Text>
          
          {authUser?.preferences?.bio && (
            <Text style={styles.userBio}>{authUser.preferences.bio}</Text>
          )}
          
          {authUser?.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>✨ Premium</Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/edit-profile')}
            >
              <Settings size={20} color={Colors.light.primary} />
              <Text style={styles.settingsButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={() => setShowLogoutModal(true)}
            >
              <LogOut size={20} color="#DC2626" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wine Preferences Section */}
        {authUser?.preferences?.favoriteWineTypes && authUser.preferences.favoriteWineTypes.length > 0 && (
          <View style={styles.preferencesSection}>
            <Text style={styles.preferencesTitle}>Favorite Wine Types</Text>
            <View style={styles.wineTypesList}>
              {authUser.preferences.favoriteWineTypes.map((type, index) => (
                <View key={index} style={styles.wineTypeChip}>
                  <Wine size={16} color={Colors.light.primary} />
                  <Text style={styles.wineTypeText}>{type}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Taste Preferences */}
        {(authUser?.preferences?.sweetnessPreference || authUser?.preferences?.spicePreference) && (
          <View style={styles.preferencesSection}>
            <Text style={styles.preferencesTitle}>Taste Preferences</Text>
            <View style={styles.tastePreferences}>
              {authUser.preferences.sweetnessPreference && (
                <View style={styles.tasteItem}>
                  <Text style={styles.tasteLabel}>Sweetness</Text>
                  <View style={styles.tasteDots}>
                    {[1, 2, 3, 4, 5].map(val => (
                      <View
                        key={val}
                        style={[
                          styles.tasteDot,
                          val <= (authUser.preferences?.sweetnessPreference || 0) && styles.tasteDotActive
                        ]}
                      />
                    ))}
                  </View>
                </View>
              )}
              {authUser.preferences.spicePreference && (
                <View style={styles.tasteItem}>
                  <Text style={styles.tasteLabel}>Spice Level</Text>
                  <View style={styles.tasteDots}>
                    {[1, 2, 3, 4, 5].map(val => (
                      <View
                        key={val}
                        style={[
                          styles.tasteDot,
                          val <= (authUser.preferences?.spicePreference || 0) && styles.tasteDotActive
                        ]}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

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

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>👋 Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleLogout}
              >
                <Text style={styles.modalConfirmText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
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
    marginBottom: 4,
  },
  userBio: {
    fontSize: 15,
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  premiumBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    marginTop: 8,
  },
  premiumText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#92400E',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  settingsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#DC2626',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  preferencesSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  wineTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wineTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  wineTypeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  tastePreferences: {
    gap: 16,
  },
  tasteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tasteLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  tasteDots: {
    flexDirection: 'row',
    gap: 6,
  },
  tasteDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.border,
  },
  tasteDotActive: {
    backgroundColor: Colors.light.primary,
  },
});
