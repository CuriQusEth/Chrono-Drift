import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { useAccount, useSignMessage } from 'wagmi';
import { useState } from 'react';
import { executeAgentAction, generateGhostAgentData } from '../lib/erc8004';
import { getAttributionPayload } from '../lib/erc8021';

export function GameOverScreen() {
  const { score, resetGame, setScreen } = useGameStore();
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState('');

  const submitScore = async () => {
    if (!isConnected || !address) {
        alert("Connect wallet to submit score!");
        return;
    }
    
    setIsSubmitting(true);
    try {
      // 1. Get SIWE-like signature
      const signature = await signMessageAsync({
        account: address,
        message: `I am recording my Chrono Drift score of ${Math.floor(score)} on Base Mainnet.`
      });
      console.log("Signature:", signature);

      // 2. Fetch ERC-8021 attribution
      const attribution = getAttributionPayload();
      console.log("Attribution:", attribution);

      // 3. Submit via ERC-8004 Agent
      const lapTime = 60; // Mock lap time
      const agentAction = generateGhostAgentData(lapTime, Math.floor(score));
      const result = await executeAgentAction(agentAction);
      
      setTxHash(result.txHash);
    } catch (e) {
      console.error(e);
      alert("Failed to submit score.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sayGM = async () => {
      if (!address) return;
      try {
        const signature = await signMessageAsync({
            account: address,
            message: `GM Base! Fast from Chrono Drift. Builder: ${getAttributionPayload().builder}`
        });
        alert(`GM sent! Sig: ${signature.slice(0, 10)}...`);
      } catch (e) {
          console.error(e);
      }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-30">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-cyan-500 rounded-xl p-8 max-w-sm w-full mx-4 text-center shadow-[0_0_50px_rgba(0,255,255,0.2)]"
      >
        <h2 className="text-3xl font-black text-cyan-400 mb-4 uppercase tracking-widest font-sans">Run Complete</h2>
        
        <div className="mb-8">
            <p className="text-gray-400 text-sm font-mono mb-1">Final Score</p>
            <p className="text-5xl font-mono text-white">{Math.floor(score)}</p>
        </div>

        <div className="flex flex-col gap-3">
            {txHash ? (
                <div className="text-xs text-green-400 font-mono bg-green-900/20 border border-green-800 p-2 rounded break-all">
                    Score recorded!<br/>
                    Tx: {txHash}
                </div>
            ) : (
                <button
                    onClick={submitScore}
                    disabled={isSubmitting || !isConnected}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all uppercase text-sm tracking-wider"
                >
                    {isSubmitting ? 'Recording on-chain...' : 'Record Score (Base)'}
                </button>
            )}
            
            <button
                onClick={resetGame}
                className="w-full py-3 bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-900/50 font-bold rounded transition-all uppercase text-sm tracking-wider"
            >
                Play Again
            </button>
            
            <button
                onClick={() => setScreen('title')}
                className="w-full py-3 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-all uppercase text-sm tracking-wider"
            >
                Main Menu
            </button>

            {isConnected && !txHash && (
                 <button
                    onClick={sayGM}
                    className="mt-4 text-xs text-blue-400 underline"
                 >
                    Say GM on-chain
                 </button>
            )}
        </div>
      </motion.div>
    </div>
  );
}
