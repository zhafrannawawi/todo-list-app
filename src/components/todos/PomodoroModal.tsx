'use client';

import React, { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { Play, Pause, RotateCcw, X, Check } from 'lucide-react';

interface PomodoroModalProps {
  todo: Todo | null;
  onClose: () => void;
  onComplete: (id: string) => void;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({
  todo,
  onClose,
  onComplete,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    if (!todo) return;
    const initialSec = (todo.estimated_minutes || 25) * 60;
    setSecondsLeft(initialSec);
    setIsActive(false);
    setMode('work');
  }, [todo]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch {}

      if (mode === 'work') {
        setMode('break');
        setSecondsLeft(5 * 60);
      } else {
        setMode('work');
        setSecondsLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, mode]);

  if (!todo) return null;

  const totalSeconds = mode === 'work' ? (todo.estimated_minutes || 25) * 60 : 5 * 60;
  const progressPercent = Math.max(
    0,
    Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100)
  );

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl text-center">
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
          {mode === 'work' ? 'Sesi Fokus' : 'Istirahat'}
        </span>

        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1 mb-6 px-4 truncate">
          {todo.title}
        </h2>

        {/* Minimalist timer */}
        <div className="my-6">
          <div className="text-5xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {timeFormatted}
          </div>
          {/* Subtle progress track */}
          <div className="mt-4 mx-auto w-48 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isActive ? 'Jeda' : 'Mulai'}</span>
          </button>

          <button
            onClick={() => {
              setIsActive(false);
              setSecondsLeft((todo.estimated_minutes || 25) * 60);
              setMode('work');
            }}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Complete Task */}
        <button
          onClick={() => {
            onComplete(todo.id);
            onClose();
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Tandai selesai</span>
        </button>
      </div>
    </div>
  );
};
