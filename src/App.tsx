import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';
import ChapterView from './pages/ChapterView';
import QuizView from './pages/QuizView';
import Notes from './pages/Notes';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pb-20 font-sans text-stone-800 dark:text-stone-100 transition-colors duration-300">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chapter/:id" element={<ChapterView />} />
                <Route path="/chapter/:id/quiz" element={<QuizView />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <BottomNav />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
