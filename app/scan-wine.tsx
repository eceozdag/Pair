import Colors from '../constants/colors';
// import { generateText } from '@rork/toolkit-sdk';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, Upload, X, Wine, Loader } from 'lucide-react-native';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanWineScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>('back');
  const [capturing, setCapturing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;

    try {
      setCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      });

      if (photo?.base64) {
        await analyzeWine(photo.base64);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setCapturing(false);
    }
  };

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      await analyzeWine(result.assets[0].base64);
    }
  };

  const analyzeWine = async (base64: string) => {
    try {
      setAnalyzing(true);

      // Mock implementation - in a real app, this would use AI to analyze the wine label
      const mockWines = [
        { name: 'Cabernet Sauvignon', type: 'red', region: 'Napa Valley', vintage: '2020', grapeVariety: 'Cabernet Sauvignon' },
        { name: 'Chardonnay', type: 'white', region: 'Burgundy', vintage: '2021', grapeVariety: 'Chardonnay' },
        { name: 'Pinot Noir', type: 'red', region: 'Oregon', vintage: '2019', grapeVariety: 'Pinot Noir' },
        { name: 'Sauvignon Blanc', type: 'white', region: 'New Zealand', vintage: '2022', grapeVariety: 'Sauvignon Blanc' },
        { name: 'Malbec', type: 'red', region: 'Argentina', vintage: '2020', grapeVariety: 'Malbec' }
      ];
      
      const randomWine = mockWines[Math.floor(Math.random() * mockWines.length)];
      console.log('Mock AI Response:', randomWine);

      router.push({
        pathname: '/pairing-results',
        params: {
          type: 'wine',
          data: JSON.stringify(randomWine),
        },
      });
    } catch (error) {
      console.error('Error analyzing wine:', error);
      Alert.alert('Error', 'Failed to analyze wine. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.loadingContainer}>
          <Loader size={32} color={Colors.light.primary} />
        </SafeAreaView>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.permissionContainer}>
          <Wine size={64} color={Colors.light.primary} />
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need your permission to scan wine labels
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  if (analyzing) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.analyzingContainer}>
          <Loader size={48} color={Colors.light.primary} />
          <Text style={styles.analyzingText}>Analyzing wine label...</Text>
          <Text style={styles.analyzingSubtext}>This may take a moment</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' ? (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <SafeAreaView style={styles.cameraOverlay}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <X size={28} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <View style={styles.middleContainer}>
              <View style={styles.frameContainer}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <Text style={styles.instructionText}>
                Position wine label within frame
              </Text>
            </View>

            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Upload size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.captureButton, capturing && styles.captureButtonDisabled]}
                onPress={handleCapture}
                disabled={capturing}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <View style={styles.placeholder} />
            </View>
          </SafeAreaView>
        </CameraView>
      ) : (
        <SafeAreaView style={styles.webContainer}>
          <View style={styles.webHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <X size={28} color={Colors.light.text} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.webTitle}>Scan Wine</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView contentContainerStyle={styles.webContent}>
            <Wine size={80} color={Colors.light.primary} />
            <Text style={styles.webMainText}>Upload Wine Label Photo</Text>
            <Text style={styles.webSubText}>
              Camera is not available on web. Please upload a photo of the wine label.
            </Text>
            <TouchableOpacity style={styles.webUploadButton} onPress={handleUpload}>
              <Upload size={24} color="#FFFFFF" />
              <Text style={styles.webUploadButtonText}>Choose Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: Colors.light.background,
    gap: 16,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 24,
  },
  permissionText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionButton: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  backButton: {
    marginTop: 12,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: Colors.light.background,
    gap: 16,
  },
  analyzingText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 24,
  },
  analyzingSubtext: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameContainer: {
    width: 280,
    height: 350,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    marginTop: 380,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500' as const,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  uploadButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
  placeholder: {
    width: 56,
  },
  webContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  webHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  webTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  webContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  webMainText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 24,
    textAlign: 'center',
  },
  webSubText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  webUploadButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
  },
  webUploadButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
