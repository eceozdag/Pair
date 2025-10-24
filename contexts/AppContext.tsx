import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Wine {
  id: string;
  name: string;
  type: string;
  region: string;
  vintage?: string;
  image?: string;
  rating?: number;
  description?: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  wine?: Wine;
  food?: string;
  image?: string;
  caption: string;
  rating: number;
  likes: number;
  timestamp: number;
}

export const [AppProvider, useApp] = createContextHook(() => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Wine Enthusiast',
    email: 'user@winemate.com',
    avatar: 'https://i.pravatar.cc/150?u=winemate',
    bio: 'Exploring the perfect wine-food pairings',
  });

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Sophie Chen',
      userAvatar: 'https://i.pravatar.cc/150?u=sophie',
      wine: {
        id: 'w1',
        name: 'Châteauneuf-du-Pape',
        type: 'Red Wine',
        region: 'Rhône Valley, France',
        vintage: '2019',
        rating: 4.5,
      },
      food: 'Grilled Lamb Chops',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      caption: 'Perfect pairing for Sunday dinner! The bold tannins complement the lamb beautifully.',
      rating: 5,
      likes: 42,
      timestamp: Date.now() - 3600000,
    },
    {
      id: '2',
      userId: '3',
      userName: 'Marcus Reid',
      userAvatar: 'https://i.pravatar.cc/150?u=marcus',
      wine: {
        id: 'w2',
        name: 'Cloudy Bay Sauvignon Blanc',
        type: 'White Wine',
        region: 'Marlborough, New Zealand',
        vintage: '2022',
        rating: 4.2,
      },
      food: 'Fresh Oysters',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
      caption: 'Crisp and refreshing pairing. The citrus notes enhance the brininess.',
      rating: 4,
      likes: 28,
      timestamp: Date.now() - 7200000,
    },
  ]);

  const [savedWines, setSavedWines] = useState<Wine[]>([]);
  const [savedPairings, setSavedPairings] = useState<{ food: string; wines: string[] }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [winesData, pairingsData] = await Promise.all([
        AsyncStorage.getItem('savedWines'),
        AsyncStorage.getItem('savedPairings'),
      ]);

      if (winesData) setSavedWines(JSON.parse(winesData));
      if (pairingsData) setSavedPairings(JSON.parse(pairingsData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveWine = useCallback(async (wine: Wine) => {
    const updated = [...savedWines, wine];
    setSavedWines(updated);
    await AsyncStorage.setItem('savedWines', JSON.stringify(updated));
  }, [savedWines]);

  const savePairing = useCallback(async (food: string, wines: string[]) => {
    const updated = [...savedPairings, { food, wines }];
    setSavedPairings(updated);
    await AsyncStorage.setItem('savedPairings', JSON.stringify(updated));
  }, [savedPairings]);

  const addPost = useCallback((post: Omit<Post, 'id' | 'userId' | 'userName' | 'userAvatar' | 'likes' | 'timestamp'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      userId: user?.id || '1',
      userName: user?.name || 'Anonymous',
      userAvatar: user?.avatar,
      likes: 0,
      timestamp: Date.now(),
    };
    setPosts([newPost, ...posts]);
  }, [posts, user]);

  return useMemo(() => ({
    user,
    setUser,
    posts,
    addPost,
    savedWines,
    saveWine,
    savedPairings,
    savePairing,
  }), [user, posts, addPost, savedWines, saveWine, savedPairings, savePairing]);
});
