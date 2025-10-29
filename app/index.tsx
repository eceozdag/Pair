import Colors from '../constants/colors';
import { useRouter } from 'expo-router';
import { Wine, Utensils, Users, User, TestTube, LogIn, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import MatchingDemo from '../components/MatchingDemo';
import { useAuth } from '../contexts/AuthContext';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showDemo, setShowDemo] = useState(false);
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // Show login/register screen if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.authContainer}>
            <View style={styles.authHeader}>
              <Wine size={64} color={Colors.light.primary} />
              <Text style={styles.authAppName}>WineMate</Text>
              <Text style={styles.authTagline}>
                Discover perfect wine and food pairings
              </Text>
            </View>

            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800' }}
              style={styles.authHeroImage}
            />

            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/login')}
              >
                <LogIn size={20} color="#FFF" />
                <Text style={styles.loginButtonText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => router.push('/register')}
              >
                <UserPlus size={20} color={Colors.light.primary} />
                <Text style={styles.registerButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.featuresPreview}>
              <Text style={styles.featuresTitle}>Features</Text>
              <View style={styles.featureItem}>
                <Wine size={20} color={Colors.light.primary} />
                <Text style={styles.featureText}>Scan wine labels</Text>
              </View>
              <View style={styles.featureItem}>
                <Utensils size={20} color={Colors.light.primary} />
                <Text style={styles.featureText}>Get pairing suggestions</Text>
              </View>
              <View style={styles.featureItem}>
                <Users size={20} color={Colors.light.primary} />
                <Text style={styles.featureText}>Join the community</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (showDemo) {
    return <MatchingDemo />;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome to</Text>
              <Text style={styles.appName}>WineMate</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
            >
              <User size={24} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.heroSection}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800' }}
              style={styles.heroImage}
            />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroText}>Discover Perfect</Text>
              <Text style={styles.heroTextBold}>Wine Pairings</Text>
            </View>
          </View>

          {/* Demo Button */}
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={() => setShowDemo(true)}
          >
            <TestTube size={20} color={Colors.light.primary} />
            <Text style={styles.demoButtonText}>Test Matching Logic</Text>
          </TouchableOpacity>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionCard, styles.primaryAction]}
              onPress={() => router.push('/scan-wine')}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Wine size={32} color="#FFFFFF" strokeWidth={2} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Scan Wine</Text>
                <Text style={styles.actionDescription}>
                  Identify any wine bottle instantly
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.secondaryAction]}
              onPress={() => router.push('/find-food')}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, styles.secondaryIcon]}>
                <Utensils size={32} color={Colors.light.primary} strokeWidth={2} />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, styles.secondaryTitle]}>Find a Wine</Text>
                <Text style={[styles.actionDescription, styles.secondaryDescription]}>
                  Get wine suggestions for your meal
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.communityCard}
            onPress={() => router.push('/community')}
            activeOpacity={0.9}
          >
            <View style={styles.communityHeader}>
              <Users size={24} color={Colors.light.primary} strokeWidth={2} />
              <Text style={styles.communityTitle}>Community</Text>
            </View>
            <Text style={styles.communityDescription}>
              Explore pairings shared by wine enthusiasts
            </Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '400' as const,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heroSection: {
    marginHorizontal: 24,
    marginTop: 20,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(139, 38, 53, 0.7)',
    justifyContent: 'center',
    paddingLeft: 32,
  },
  heroText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '400' as const,
  },
  heroTextBold: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryAction: {
    backgroundColor: Colors.light.primary,
  },
  secondaryAction: {
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryIcon: {
    backgroundColor: Colors.light.background,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  secondaryTitle: {
    color: Colors.light.text,
  },
  actionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400' as const,
  },
  secondaryDescription: {
    color: Colors.light.textSecondary,
  },
  communityCard: {
    marginHorizontal: 24,
    marginTop: 32,
    padding: 24,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
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
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  communityTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  communityDescription: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  authContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  authHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  authAppName: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  authTagline: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  authHeroImage: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    marginBottom: 32,
  },
  authButtons: {
    gap: 12,
    marginBottom: 40,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.card,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  registerButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  featuresPreview: {
    gap: 16,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 16,
    color: Colors.light.text,
  },
});
