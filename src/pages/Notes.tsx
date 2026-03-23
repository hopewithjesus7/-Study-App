import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { chapters } from '../data/chapters';

interface Note {
  id: string;
  chapterId: string;
  content: string;
  createdAt: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedNotes = localStorage.getItem('ehs_notes');
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes);
        parsedNotes.sort((a: Note, b: Note) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotes(parsedNotes);
      } catch (e) {
        console.error("Failed to parse notes", e);
      }
    }
    setLoading(false);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto px-6 pt-12 pb-24"
    >
      <header className="mb-10">
        <h1 className="text-3xl font-serif font-medium text-stone-800 dark:text-stone-100 tracking-tight mb-2">
          My Notes
        </h1>
        <p className="text-stone-500 dark:text-stone-400 font-light">Your personal reflections and meditations.</p>
      </header>

      {loading ? (
        <div className="text-stone-400 dark:text-stone-500 text-center py-12">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-stone-400 dark:text-stone-500 text-center py-12 bg-white dark:bg-stone-800 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700 transition-colors">
          No notes yet. Complete a chapter to write your first meditation note.
        </div>
      ) : (
        <div className="space-y-6">
          {notes.map(note => {
            const chapter = chapters.find(c => c.id === note.chapterId);
            return (
              <div key={note.id} className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500">
                    Chapter {chapter?.number || '?'}
                  </span>
                  <span className="text-xs text-stone-400 dark:text-stone-500">
                    {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-lg font-serif text-stone-800 dark:text-stone-100 mb-3 leading-snug">
                  {chapter?.title || 'Unknown Chapter'}
                </h3>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
