import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { chapters } from '../data/chapters';

export default function ChapterView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chapter = chapters.find(c => c.id === id);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!chapter) {
    return <div className="min-h-screen flex items-center justify-center">Chapter not found</div>;
  }

  const cards = chapter.cards;

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else {
      navigate(`/chapter/${chapter.id}/quiz`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="fixed inset-0 bg-stone-900 dark:bg-black flex flex-col transition-colors">
      <header className="flex items-center justify-between p-6 text-stone-300 dark:text-stone-400">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-stone-800 dark:hover:bg-stone-900 rounded-full transition-colors">
          <X size={24} />
        </button>
        <div className="text-xs font-bold tracking-widest uppercase">
          {currentIndex + 1} / {cards.length}
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="flex-1 relative overflow-hidden flex items-center justify-center p-6">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                handleNext();
              } else if (swipe > swipeConfidenceThreshold) {
                handlePrev();
              }
            }}
            className="absolute w-full max-w-sm h-[70vh] bg-stone-50 dark:bg-stone-800 rounded-[2rem] shadow-2xl flex flex-col p-8 md:p-10 transition-colors"
          >
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-6 block">
                {currentCard.type}
              </span>
              
              {currentCard.title && (
                <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-6 leading-tight">
                  {currentCard.title}
                </h2>
              )}
              
              <p className={`text-stone-600 dark:text-stone-300 leading-relaxed ${currentCard.type === 'quote' ? 'text-2xl font-serif italic' : 'text-lg'}`}>
                {currentCard.type === 'quote' && <span className="text-4xl text-stone-300 dark:text-stone-600 leading-none absolute -ml-6 -mt-4">"</span>}
                {currentCard.content}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="p-8 flex items-center justify-between max-w-md mx-auto w-full">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-4 rounded-full transition-colors ${currentIndex === 0 ? 'text-stone-700 dark:text-stone-800 opacity-50 cursor-not-allowed' : 'text-stone-300 dark:text-stone-400 hover:bg-stone-800 dark:hover:bg-stone-900'}`}
        >
          <ChevronLeft size={32} strokeWidth={1} />
        </button>
        
        <button 
          onClick={handleNext}
          className="px-8 py-4 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-full font-medium flex items-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
        >
          {currentIndex === cards.length - 1 ? 'Take Quiz' : 'Next'}
          <ChevronRight size={20} className="ml-2" />
        </button>
      </footer>
    </div>
  );
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
