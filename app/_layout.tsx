import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: true,
          title: 'Sign In',
          headerStyle: { backgroundColor: '#FEFAF6' },
          headerTintColor: '#8B2635',
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          headerShown: true,
          title: 'Sign Up',
          headerStyle: { backgroundColor: '#FEFAF6' },
          headerTintColor: '#8B2635',
        }} 
      />
      <Stack.Screen name="scan-wine" options={{ headerShown: false }} />
      <Stack.Screen name="find-food" options={{ headerShown: false }} />
      <Stack.Screen 
        name="pairing-results" 
        options={{ 
          headerShown: true,
          title: 'Wine Pairings',
          headerStyle: { backgroundColor: '#FEFAF6' },
          headerTintColor: '#8B2635',
        }} 
      />
      <Stack.Screen 
        name="community" 
        options={{ 
          headerShown: true,
          title: 'Community',
          headerStyle: { backgroundColor: '#FEFAF6' },
          headerTintColor: '#8B2635',
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          headerShown: true,
          title: 'Profile',
          headerStyle: { backgroundColor: '#FEFAF6' },
          headerTintColor: '#8B2635',
        }} 
      />
      <Stack.Screen 
        name="edit-profile" 
        options={{ 
          headerShown: true,
          title: 'Edit Profile',
          headerStyle: { backgroundColor: '#FEFAF6' },
          headerTintColor: '#8B2635',
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
