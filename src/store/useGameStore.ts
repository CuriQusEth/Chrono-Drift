import { create } from 'zustand';

type Screen = 'title' | 'garage' | 'playing' | 'game_over' | 'leaderboard';

interface GameState {
  screen: Screen;
  score: number;
  combo: number;
  timeRemaining: number;
  lapTime: number;
  timeSlowFactor: number;
  isRewinding: boolean;
  isBursting: boolean;
  setScreen: (screen: Screen) => void;
  updateScore: (points: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  setTimeSlowFactor: (factor: number) => void;
  setRewinding: (rewinding: boolean) => void;
  setBursting: (bursting: boolean) => void;
  tickTime: (dt: number) => void;
  resetGame: () => void;
  endGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'title',
  score: 0,
  combo: 1,
  timeRemaining: 60,
  lapTime: 0,
  timeSlowFactor: 1.0, // 1.0 is normal, 0.3 is slow
  isRewinding: false,
  isBursting: false,

  setScreen: (screen) => set({ screen }),
  updateScore: (points) => set((state) => ({ score: state.score + (points * state.combo) })),
  incrementCombo: () => set((state) => ({ combo: Math.min(state.combo + 0.1, 5.0) })),
  resetCombo: () => set({ combo: 1 }),
  setTimeSlowFactor: (factor) => set({ timeSlowFactor: factor }),
  setRewinding: (isRewinding) => set({ isRewinding }),
  setBursting: (isBursting) => set({ isBursting }),
  tickTime: (dt) => set((state) => {
    const elapsed = dt * state.timeSlowFactor * (state.isBursting ? 2 : 1);
    const newRemaining = state.isRewinding ? state.timeRemaining + elapsed * 2 : state.timeRemaining - elapsed;
    return {
      lapTime: state.lapTime + elapsed,
      timeRemaining: Math.max(0, newRemaining)
    };
  }),
  resetGame: () => set({
    score: 0,
    combo: 1,
    timeRemaining: 60,
    lapTime: 0,
    timeSlowFactor: 1.0,
    isRewinding: false,
    isBursting: false,
    screen: 'playing'
  }),
  endGame: () => set({ screen: 'game_over' })
}));
