import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Award, BookOpen, Moon, Sun, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { chapters } from '../data/chapters';

export default function Profile() {
  const { userProfile, updateProfile } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userProfile?.displayName || '');
  
  if (!userProfile) return null;

  const completedCount = userProfile.completedChapters?.length || 0;
  const totalCount = chapters.length;
  const progress = Math.round((completedCount / totalCount) * 100) || 0;

  const handleSaveName = () => {
    if (newName.trim()) {
      updateProfile({ displayName: newName.trim() });
    }
    setIsEditingName(false);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your progress and notes? This cannot be undone.")) {
      localStorage.removeItem('ehs_user_profile');
      localStorage.removeItem('ehs_notes');
      window.location.reload();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto px-6 pt-12 pb-24"
    >
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-medium text-stone-800 dark:text-stone-100 tracking-tight mb-2">
            Profile
          </h1>
          <p className="text-stone-500 dark:text-stone-400 font-light">Manage your account and view progress.</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400">
          <User size={32} />
        </div>
      </header>

      <section className="bg-white dark:bg-stone-800 rounded-[2rem] p-8 shadow-sm mb-8 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Your Progress</h2>
          <span className="text-2xl font-serif text-stone-800 dark:text-stone-100">{progress}%</span>
        </div>
        
        <div className="h-3 w-full bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden mb-8">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-stone-50 dark:bg-stone-700/50 p-5 rounded-2xl flex flex-col items-center text-center transition-colors">
            <BookOpen size={24} className="text-stone-400 dark:text-stone-500 mb-2" />
            <span className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-1">{completedCount}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500">Completed</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-700/50 p-5 rounded-2xl flex flex-col items-center text-center transition-colors">
            <Award size={24} className="text-stone-400 dark:text-stone-500 mb-2" />
            <span className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-1">{totalCount - completedCount}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500">Remaining</span>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-stone-800 rounded-[2rem] p-8 shadow-sm transition-colors">
        <h2 className="text-sm font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-6">Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-stone-100 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400">Name</span>
            {isEditingName ? (
              <div className="flex items-center">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-100 px-3 py-1 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                  onBlur={handleSaveName}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                />
              </div>
            ) : (
              <span 
                className="font-medium text-stone-800 dark:text-stone-100 cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => setIsEditingName(true)}
              >
                {userProfile.displayName || 'Guest'}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between py-3 border-b border-stone-100 dark:border-stone-700">
            <span className="text-stone-500 dark:text-stone-400">Appearance</span>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <button 
          onClick={handleReset}
          className="mt-8 w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-medium flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
        >
          <Trash2 size={18} className="mr-2" />
          Reset Progress
        </button>
      </section>
    </motion.div>
  );
}
