import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../app/services/api';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isPremium: boolean;
  profileImageUrl?: string;
  preferences?: {
    bio?: string;
    favoriteWineTypes?: string[];
    favoriteRegions?: string[];
    favoriteGrapeVarieties?: string[];
    dietaryRestrictions?: string[];
    spicePreference?: number;
    sweetnessPreference?: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Update axios headers when token changes
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const loadUserFromStorage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid
        try {
          const response = await apiClient.get('/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setUser(response.data.data.user);
        } catch (error) {
          // Token invalid, clear storage
          await AsyncStorage.multiRemove(['authToken', 'user']);
          setToken(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', {
        emailOrUsername,
        password
      });

      const { token: newToken, user: newUser } = response.data.data;

      // Save to storage
      await AsyncStorage.setItem('authToken', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        username,
        password,
        firstName,
        lastName
      });

      const { token: newToken, user: newUser } = response.data.data;

      // Save to storage
      await AsyncStorage.setItem('authToken', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      // Clear storage
      await AsyncStorage.multiRemove(['authToken', 'user']);
      
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await apiClient.put('/auth/profile', data);
      const updatedUser = response.data.data.user;

      // Update storage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed';
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!token && !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

