import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, PenLine, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  
  // Hide nav on chapter view or quiz view to maximize reading space
  if (location.pathname.includes('/chapter/')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-t border-stone-200/50 dark:border-stone-800/50 pb-safe z-50 transition-colors">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center w-16 h-full transition-colors ${
              isActive ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
            }`
          }
        >
          <BookOpen size={24} strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium tracking-wide">Home</span>
        </NavLink>
        
        <NavLink 
          to="/notes" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center w-16 h-full transition-colors ${
              isActive ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
            }`
          }
        >
          <PenLine size={24} strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium tracking-wide">Notes</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center w-16 h-full transition-colors ${
              isActive ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
            }`
          }
        >
          <User size={24} strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium tracking-wide">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
