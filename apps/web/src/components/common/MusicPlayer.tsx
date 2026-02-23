'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Music, 
  ListMusic, 
  Minimize2, 
  Plus, 
  Trash2,
  Disc,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@latexia/ui';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  url: string;
}

const DEFAULT_PLAYLIST: Track[] = [
  { id: '1', title: 'Lofi Girl - Chill Beats', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
  { id: '2', title: 'Relaxing Jazz', url: 'https://www.youtube.com/watch?v=5WnB9o_q7Gg' },
  { id: '3', title: 'Deep Focus Ambient', url: 'https://www.youtube.com/watch?v=S0Q4gqBUs7c' },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>(DEFAULT_PLAYLIST);
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('latexia-playlist');
    if (saved) {
      try {
        setPlaylist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved playlist');
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('latexia-playlist', JSON.stringify(playlist));
    }
  }, [playlist, mounted]);

  if (!mounted) return null;

  const currentTrack = playlist[currentTrackIndex];

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const addTrack = () => {
    if (!newTrackUrl.trim()) return;
    const newTrack: Track = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Custom Track ' + (playlist.length + 1),
      url: newTrackUrl.trim()
    };
    setPlaylist([...playlist, newTrack]);
    setNewTrackUrl('');
  };

  const removeTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.length <= 1) return;
    const newList = playlist.filter(t => t.id !== id);
    setPlaylist(newList);
    if (currentTrackIndex >= newList.length) {
      setCurrentTrackIndex(0);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] font-sans">
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            className="group relative"
          >
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all hover:bg-zinc-800/90"
            >
              <div className="relative">
                <Disc className={cn(
                  "w-5 h-5 text-primary transition-transform duration-[3000ms] linear infinite",
                  isPlaying ? "animate-spin" : ""
                )} />
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col items-start overflow-hidden w-24">
                <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest leading-none mb-1">Focus Radio</span>
                <span className="text-[11px] text-white/70 truncate w-full text-left">
                  {isPlaying ? currentTrack?.title : 'Idle...'}
                </span>
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-[320px] rounded-[2rem] bg-zinc-950/90 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Header / Artwork Area */}
            <div className="relative h-40 bg-gradient-to-br from-primary/20 via-zinc-900 to-zinc-950 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Music className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className={cn(
                      "p-2 rounded-xl border border-white/10 transition-all",
                      showPlaylist ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 text-white/40 hover:text-white"
                    )}
                  >
                    <ListMusic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {!showPlaylist && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  <h3 className="text-lg font-bold text-white truncate drop-shadow-md">
                    {currentTrack?.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                    <span className="text-xs text-white/40 italic">LaTexia Focus Session</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Main Interface */}
            <div className="p-6 pt-2">
              <AnimatePresence mode="wait">
                {showPlaylist ? (
                  <motion.div 
                    key="playlist"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex gap-2">
                      <div className="relative flex-1 group">
                        <input 
                          type="text" 
                          placeholder="Paste URL (YouTube/Soundcloud/...)"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                          value={newTrackUrl}
                          onChange={(e) => setNewTrackUrl(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addTrack()}
                        />
                        <ExternalLink className="absolute right-3 top-2.5 w-3 h-3 text-white/10 group-focus-within:text-primary/40" />
                      </div>
                      <button 
                        onClick={addTrack}
                        className="p-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-all border border-primary/20"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-1 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                      {playlist.map((track, idx) => (
                        <div 
                          key={track.id}
                          className={cn(
                            "group flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer",
                            idx === currentTrackIndex ? "bg-primary/10 border border-primary/20" : "hover:bg-white/5 border border-transparent"
                          )}
                          onClick={() => setCurrentTrackIndex(idx)}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              idx === currentTrackIndex ? "bg-primary animate-pulse" : "bg-white/10"
                            )} />
                            <span className={cn(
                              "text-[11px] truncate",
                              idx === currentTrackIndex ? "text-primary font-bold" : "text-white/60"
                            )}>
                              {track.title}
                            </span>
                          </div>
                          <button 
                            onClick={(e) => removeTrack(track.id, e)}
                            className="p-1 text-white/0 group-hover:text-white/20 hover:!text-destructive transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="controls"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8"
                  >
                    {/* Progress Bar (Visual only for now) */}
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] text-white/20 font-mono">
                         <span>Focusing...</span>
                         <span>No Interruption</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ x: isPlaying ? ["-100%", "100%"] : "0%" }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
                          />
                       </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-8">
                      <button onClick={handlePrev} className="text-white/30 hover:text-white transition-all transform hover:scale-110 active:scale-90">
                        <SkipBack className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={togglePlay}
                        className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] group"
                      >
                        {isPlaying ? (
                          <Pause className="w-7 h-7 fill-current" />
                        ) : (
                          <Play className="w-7 h-7 fill-current ml-1" />
                        )}
                      </button>
                      <button onClick={handleNext} className="text-white/30 hover:text-white transition-all transform hover:scale-110 active:scale-90">
                        <SkipForward className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-4 bg-white/5 py-3 px-5 rounded-2xl border border-white/5">
                      <Volume2 className="w-4 h-4 text-white/20" />
                      <div className="flex-1 h-1 bg-white/10 rounded-full relative group">
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                        />
                        <div 
                          className="absolute top-0 left-0 h-full bg-primary/60 group-hover:bg-primary transition-all duration-100"
                          style={{ width: `${volume * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hidden Player */}
            <div className="hidden">
              <ReactPlayer
                url={currentTrack?.url}
                playing={isPlaying}
                volume={volume}
                onEnded={handleNext}
                config={{
                  youtube: {
                    playerVars: { showinfo: 0, controls: 0 }
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        :root {
          --primary-rgb: 0, 255, 127; /* Updated to match a vibrant lofi vibe if needed */
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
