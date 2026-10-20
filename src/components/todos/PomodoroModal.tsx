'use client';

import React, { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { Play, Pause, RotateCcw, X, CheckCircle, Flame } from 'lucide-react';

interface PomodoroModalProps {
  todo: Todo | null;
  onClose: () => void;
  onComplete: (id: string) => void;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({ todo, onClose, onComplete }) => {
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
      // Play soft beep if supported
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
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
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-center text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium mb-4 bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>FOKUS INDUSTRI</span>
        </div>

        <h2 className="text-lg font-bold tracking-tight text-zinc-100 mb-1 px-4 truncate">
          {todo.title}
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          {mode === 'work' ? 'Sesi Fokus Penuh (Deep Work)' : 'Waktu Istirahat (Break)'}
        </p>

        {/* Circular / Progress Ring representation */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              className="text-orange-500 transition-all duration-500 stroke-current"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={289}
              strokeDashoffset={289 - (289 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-mono font-extrabold tracking-tighter text-white">
              {timeFormatted}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 mt-1">
              {mode}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isActive ? 'Pause' : 'Mulai'}</span>
          </button>

          <button
            onClick={() => {
              setIsActive(false);
              setSecondsLeft((todo.estimated_minutes || 25) * 60);
              setMode('work');
            }}
            className="p-2.5 rounded-2xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Finish Task Button */}
        <button
          onClick={() => {
            onComplete(todo.id);
            onClose();
          }}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Selesaikan Tugas Sekarang</span>
        </button>
      </div>
    </div>
  );
};
