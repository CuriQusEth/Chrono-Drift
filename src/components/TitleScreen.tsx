import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function TitleScreen() {
  const setScreen = useGameStore(state => state.setScreen);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 bg-repeat"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-cyan-500/20 rounded-full blur-[100px]"></div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center z-10"
      >
        <h1 className="text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-magenta-500 to-purple-600 tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          CHRONO
          <br/>
          DRIFT
        </h1>
        <p className="text-cyan-300 tracking-[0.3em] text-sm mb-12 uppercase font-mono">Neon Timelines</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col gap-4 z-10 w-64"
      >
        <button
          onClick={() => setScreen('playing')}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all uppercase tracking-wider relative overflow-hidden"
        >
          <span className="relative z-10">Start Race</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]"></div>
        </button>

        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            className="w-full py-3 bg-transparent border border-magenta-500 text-magenta-400 hover:bg-magenta-500/20 font-bold rounded transition-all uppercase tracking-wider"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-center text-xs text-green-400 font-mono border border-green-900 bg-green-900/30 py-2 rounded">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        )}
      </motion.div>
      
      <div className="absolute bottom-8 text-xs text-gray-500 text-center w-full z-10 font-mono px-4">
        Hold: Chrono Slow | Dbl-Tap: Burst | Swipe Down: Rewind<br/>
        Swipe L/R: Drift
      </div>
    </div>
  );
}
