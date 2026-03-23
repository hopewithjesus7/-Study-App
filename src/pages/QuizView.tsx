import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Save } from 'lucide-react';
import { chapters } from '../data/chapters';
import { useAuth } from '../contexts/AuthContext';

export default function QuizView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markChapterComplete } = useAuth();
  const chapter = chapters.find(c => c.id === id);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  if (!chapter) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const { quiz, meditationQuestion } = chapter;

  const handleSubmitQuiz = () => {
    if (selectedOption === null) return;
    
    const passed = selectedOption === quiz.correctAnswerIndex;
    setIsPassed(passed);
    setIsSubmitted(true);

    if (passed) {
      markChapterComplete(chapter.id, chapters.length);
    }
  };

  const handleSaveNote = () => {
    if (noteContent.trim()) {
      const storedNotes = localStorage.getItem('ehs_notes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      
      notes.push({
        id: Date.now().toString(),
        chapterId: chapter.id,
        content: noteContent,
        createdAt: new Date().toISOString()
      });
      
      localStorage.setItem('ehs_notes', JSON.stringify(notes));
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 p-6 md:p-12 flex flex-col max-w-2xl mx-auto transition-colors">
      <header className="mb-12">
        <span className="text-xs font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-2 block">
          Knowledge Check
        </span>
        <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100 leading-tight">
          Chapter {chapter.number}
        </h1>
      </header>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.main
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="bg-white dark:bg-stone-800 p-8 rounded-[2rem] shadow-sm mb-8 transition-colors">
              <p className="text-lg text-stone-700 dark:text-stone-200 leading-relaxed mb-8">
                {quiz.question}
              </p>
              
              <div className="space-y-3">
                {quiz.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border ${
                      selectedOption === idx 
                        ? 'border-stone-800 dark:border-stone-100 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 shadow-md' 
                        : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    <span className="font-medium mr-3 opacity-50">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmitQuiz}
              disabled={selectedOption === null}
              className={`mt-auto w-full py-4 rounded-full font-medium transition-all duration-300 ${
                selectedOption !== null
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-stone-900 shadow-lg hover:bg-emerald-700 dark:hover:bg-emerald-400'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          </motion.main>
        ) : (
          <motion.main
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className={`p-8 rounded-[2rem] mb-8 transition-colors ${isPassed ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
              <div className="flex items-center mb-4">
                {isPassed ? (
                  <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400 mr-3" />
                ) : (
                  <XCircle size={32} className="text-red-600 dark:text-red-400 mr-3" />
                )}
                <h2 className={`text-2xl font-serif ${isPassed ? 'text-emerald-900 dark:text-emerald-100' : 'text-red-900 dark:text-red-100'}`}>
                  {isPassed ? 'Correct!' : 'Not quite right.'}
                </h2>
              </div>
              <p className={`leading-relaxed ${isPassed ? 'text-emerald-800/80 dark:text-emerald-200/80' : 'text-red-800/80 dark:text-red-200/80'}`}>
                {quiz.explanation}
              </p>
            </div>

            {isPassed ? (
              <div className="bg-white dark:bg-stone-800 p-8 rounded-[2rem] shadow-sm flex-1 flex flex-col mb-8 transition-colors">
                <span className="text-xs font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-4 block">
                  Meditation Note
                </span>
                <p className="text-lg font-serif text-stone-800 dark:text-stone-100 mb-6 leading-relaxed">
                  {meditationQuestion}
                </p>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="flex-1 w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-5 text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/20 dark:focus:ring-stone-100/20 focus:border-stone-800 dark:focus:border-stone-100 resize-none transition-all"
                />
              </div>
            ) : (
              <div className="flex-1" />
            )}

            <button
              onClick={isPassed ? handleSaveNote : () => { setIsSubmitted(false); setSelectedOption(null); }}
              className="mt-auto w-full py-4 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full font-medium flex items-center justify-center hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors"
            >
              {isPassed ? (
                <>
                  <Save size={20} className="mr-2" />
                  Save & Continue
                </>
              ) : (
                'Try Again'
              )}
            </button>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
