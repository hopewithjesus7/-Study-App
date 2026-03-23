import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  displayName: string;
  completedChapters: string[];
  progress: number;
}

interface AuthContextType {
  userProfile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  markChapterComplete: (chapterId: string, totalChapters: number) => void;
}

const defaultProfile: UserProfile = {
  displayName: 'Guest',
  completedChapters: [],
  progress: 0,
};

const AuthContext = createContext<AuthContextType>({ 
  userProfile: defaultProfile,
  updateProfile: () => {},
  markChapterComplete: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    const storedProfile = localStorage.getItem('ehs_user_profile');
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error("Failed to parse stored profile", e);
      }
    }
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const newProfile = { ...prev, ...updates };
      localStorage.setItem('ehs_user_profile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  const markChapterComplete = (chapterId: string, totalChapters: number) => {
    setUserProfile(prev => {
      if (prev.completedChapters.includes(chapterId)) return prev;
      
      const newCompleted = [...prev.completedChapters, chapterId];
      const newProgress = Math.round((newCompleted.length / totalChapters) * 100);
      
      const newProfile = {
        ...prev,
        completedChapters: newCompleted,
        progress: newProgress
      };
      
      localStorage.setItem('ehs_user_profile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  return (
    <AuthContext.Provider value={{ userProfile, updateProfile, markChapterComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
