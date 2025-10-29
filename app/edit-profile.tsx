import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload, X } from 'lucide-react-native';
import Colors from '../constants/colors';

const WINE_TYPES = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert'];
const DIETARY_RESTRICTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'];

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl || '');
  const [bio, setBio] = useState(user?.preferences?.bio || '');
  const [favoriteWineTypes, setFavoriteWineTypes] = useState<string[]>(
    user?.preferences?.favoriteWineTypes || []
  );
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(
    user?.preferences?.dietaryRestrictions || []
  );
  const [sweetnessPreference, setSweetnessPreference] = useState(
    user?.preferences?.sweetnessPreference || 3
  );
  const [spicePreference, setSpicePreference] = useState(
    user?.preferences?.spicePreference || 3
  );

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow camera access');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const toggleWineType = (type: string) => {
    setFavoriteWineTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        firstName,
        lastName,
        profileImageUrl: profileImage,
        preferences: {
          bio,
          favoriteWineTypes,
          dietaryRestrictions,
          sweetnessPreference,
          spicePreference,
        },
      });
      
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: profileImage || 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
            {profileImage && (
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setProfileImage('')}
              >
                <X size={16} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Upload size={20} color={Colors.light.primary} />
              <Text style={styles.imageButtonText}>Upload</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Camera size={20} color={Colors.light.primary} />
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Wine Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Wine Types</Text>
          <View style={styles.chipContainer}>
            {WINE_TYPES.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  favoriteWineTypes.includes(type) && styles.chipSelected
                ]}
                onPress={() => toggleWineType(type)}
              >
                <Text style={[
                  styles.chipText,
                  favoriteWineTypes.includes(type) && styles.chipTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dietary Restrictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
          <View style={styles.chipContainer}>
            {DIETARY_RESTRICTIONS.map(restriction => (
              <TouchableOpacity
                key={restriction}
                style={[
                  styles.chip,
                  dietaryRestrictions.includes(restriction) && styles.chipSelected
                ]}
                onPress={() => toggleDietaryRestriction(restriction)}
              >
                <Text style={[
                  styles.chipText,
                  dietaryRestrictions.includes(restriction) && styles.chipTextSelected
                ]}>
                  {restriction}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferences Sliders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taste Preferences</Text>
          
          <View style={styles.sliderGroup}>
            <View style={styles.sliderHeader}>
              <Text style={styles.label}>Sweetness Preference</Text>
              <Text style={styles.sliderValue}>{sweetnessPreference}/5</Text>
            </View>
            <View style={styles.sliderDots}>
              {[1, 2, 3, 4, 5].map(val => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.dot,
                    val <= sweetnessPreference && styles.dotActive
                  ]}
                  onPress={() => setSweetnessPreference(val)}
                />
              ))}
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Dry</Text>
              <Text style={styles.sliderLabel}>Sweet</Text>
            </View>
          </View>

          <View style={styles.sliderGroup}>
            <View style={styles.sliderHeader}>
              <Text style={styles.label}>Spice Preference</Text>
              <Text style={styles.sliderValue}>{spicePreference}/5</Text>
            </View>
            <View style={styles.sliderDots}>
              {[1, 2, 3, 4, 5].map(val => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.dot,
                    val <= spicePreference && styles.dotActive
                  ]}
                  onPress={() => setSpicePreference(val)}
                />
              ))}
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Mild</Text>
              <Text style={styles.sliderLabel}>Spicy</Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
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
  imageSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.border,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  chipSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  chipTextSelected: {
    color: '#FFF',
  },
  sliderGroup: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  dotActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  saveButton: {
    marginHorizontal: 24,
    marginTop: 8,
    paddingVertical: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    alignItems: 'center',
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
});

