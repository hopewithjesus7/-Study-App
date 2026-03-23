import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, PartyPopper } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { chapters } from '../data/chapters';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { userProfile } = useAuth();
  const { width, height } = useWindowSize();
  const [showCelebration, setShowCelebration] = useState(false);
  
  const completedChapters = userProfile?.completedChapters || [];
  const progress = Math.round((completedChapters.length / chapters.length) * 100) || 0;
  const isAllCompleted = completedChapters.length === chapters.length;

  useEffect(() => {
    // Show celebration if all chapters are completed and we haven't shown it yet this session
    if (isAllCompleted && !sessionStorage.getItem('celebrationShown')) {
      setShowCelebration(true);
      sessionStorage.setItem('celebrationShown', 'true');
      
      // Hide celebration after 8 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [isAllCompleted]);

  return (
    <>
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.15}
          />
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-800/30 text-center max-w-sm mx-4 pointer-events-auto"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                <PartyPopper size={32} className="text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">축하합니다!</h2>
            <p className="text-stone-600 dark:text-stone-300">
              모든 과정을 성공적으로 마치셨습니다. 정서적, 영적 성숙을 향한 여정에서 큰 발걸음을 내딛으셨습니다.
            </p>
            <button 
              onClick={() => setShowCelebration(false)}
              className="mt-6 px-6 py-2 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full text-sm font-medium hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors"
            >
              닫기
            </button>
          </motion.div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-6 pt-12 pb-24"
      >
        <header className="mb-10">
          <h1 className="text-3xl font-serif font-medium text-stone-800 dark:text-stone-100 tracking-tight mb-2">
            정서적으로 건강한
            <br />
            영성
          </h1>
          <p className="text-stone-500 dark:text-stone-400 font-light">정서적, 영적 성숙을 향한 여정.</p>
        </header>

        <section className="mb-12">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-sm font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">진행률</h2>
            <span className="text-xl font-serif text-stone-800 dark:text-stone-100">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-stone-800 dark:bg-stone-200 rounded-full"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-4">커리큘럼</h2>
          {chapters.map((chapter, index) => {
            const isCompleted = completedChapters.includes(chapter.id);
            const isNext = !isCompleted && (index === 0 || completedChapters.includes(chapters[index - 1].id));
            const isLocked = !isCompleted && !isNext;

            return (
              <Link 
                key={chapter.id} 
                to={isLocked ? '#' : `/chapter/${chapter.id}`}
                className={`block relative overflow-hidden rounded-3xl transition-all duration-300 ${
                  isLocked 
                    ? 'bg-stone-100 dark:bg-stone-800/50 opacity-60 cursor-not-allowed' 
                    : 'bg-white dark:bg-stone-800 shadow-sm hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500">
                      Chapter {chapter.number}
                    </span>
                    {isCompleted && <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-500" />}
                  </div>
                  <h3 className="text-xl font-serif text-stone-800 dark:text-stone-100 mb-1 leading-snug">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 font-light">
                    {chapter.subtitle}
                  </p>
                  
                  {!isLocked && (
                    <div className="mt-6 flex items-center text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                      {isCompleted ? '다시 보기' : '시작하기'}
                      <ChevronRight size={14} className="ml-1" />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </section>
      </motion.div>
    </>
  );
}
