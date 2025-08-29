import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock authentication check
    const savedUser = localStorage.getItem('manga_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('manga_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'بيانات الدخول غير صحيحة' };
  };

  const register = async (username, email, password) => {
    // Mock registration
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      avatar: `https://picsum.photos/100/100?random=${Date.now()}`,
      favorites: [],
      readingHistory: [],
      ratings: []
    };
    
    setUser(newUser);
    localStorage.setItem('manga_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('manga_user');
  };

  const updateReadingProgress = (mangaId, chapterId, progress) => {
    if (!user) return;
    
    const updatedUser = { ...user };
    const historyIndex = updatedUser.readingHistory.findIndex(
      h => h.mangaId === mangaId && h.chapterId === chapterId
    );
    
    const historyItem = {
      mangaId,
      chapterId,
      progress,
      lastRead: new Date().toISOString()
    };
    
    if (historyIndex >= 0) {
      updatedUser.readingHistory[historyIndex] = historyItem;
    } else {
      updatedUser.readingHistory.push(historyItem);
    }
    
    setUser(updatedUser);
    localStorage.setItem('manga_user', JSON.stringify(updatedUser));
  };

  const toggleFavorite = (mangaId) => {
    if (!user) return;
    
    const updatedUser = { ...user };
    const isFavorite = updatedUser.favorites.includes(mangaId);
    
    if (isFavorite) {
      updatedUser.favorites = updatedUser.favorites.filter(id => id !== mangaId);
    } else {
      updatedUser.favorites.push(mangaId);
    }
    
    setUser(updatedUser);
    localStorage.setItem('manga_user', JSON.stringify(updatedUser));
  };

  const rateManga = (mangaId, rating) => {
    if (!user) return;
    
    const updatedUser = { ...user };
    const existingRatingIndex = updatedUser.ratings.findIndex(r => r.mangaId === mangaId);
    
    if (existingRatingIndex >= 0) {
      updatedUser.ratings[existingRatingIndex].rating = rating;
    } else {
      updatedUser.ratings.push({ mangaId, rating });
    }
    
    setUser(updatedUser);
    localStorage.setItem('manga_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateReadingProgress,
    toggleFavorite,
    rateManga
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};