import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';

export function HUD() {
  const { score, combo, timeRemaining, timeSlowFactor, isRewinding, isBursting } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between items-stretch text-white z-10">
      <div className="flex justify-between items-start">
        <div className="bg-black/50 p-2 rounded border border-cyan-500 backdrop-blur-sm">
          <div className="text-xs text-cyan-500 uppercase tracking-widest">Score</div>
          <div className="text-2xl font-mono text-white">{Math.floor(score)}</div>
        </div>
        <div className="bg-black/50 p-2 rounded border border-magenta-500 text-right backdrop-blur-sm">
          <div className="text-xs text-magenta-500 uppercase tracking-widest">Time</div>
          <div className="text-2xl font-mono text-white">{timeRemaining.toFixed(1)}s</div>
        </div>
      </div>

      <div className="flex justify-between items-end pb-8">
        <motion.div 
          className="text-4xl text-yellow-500 font-bold italic"
          animate={{ scale: combo > 1 ? [1, 1.2, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          {combo > 1 ? `x${combo.toFixed(1)}` : ''}
        </motion.div>
        
        <div className="flex flex-col items-end gap-2 text-right">
            {timeSlowFactor < 1 && (
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded animate-pulse">CHRONO SLOW</span>
            )}
            {isRewinding && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded animate-pulse">REWINDING</span>
            )}
            {isBursting && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded animate-pulse">TIME BURST</span>
            )}
        </div>
      </div>
    </div>
  );
}
