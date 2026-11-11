import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { useAccount, useSignMessage, useSendTransaction } from 'wagmi';
import { useState } from 'react';
import { executeAgentAction, generateGhostAgentData } from '../lib/erc8004';
import { getAttributionPayload } from '../lib/erc8021';
import { Sun } from 'lucide-react';

export function GameOverScreen() {
  const { score, resetGame, setScreen } = useGameStore();
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { sendTransaction } = useSendTransaction();
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
        message: `I am recording my Chrono Drift score of ${Math.floor(score)} on Base Mainnet (Denim 200ms).`
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

  const sayGM = () => {
      sendTransaction({
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
        value: BigInt(0),
      });
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-30">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-cyan-500 rounded-xl p-8 max-w-sm w-full mx-4 text-center shadow-[0_0_50px_rgba(0,255,255,0.2)]"
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          BASE MAINNET // DENIM 200ms
        </div>

        <h2 className="text-3xl font-black text-cyan-400 mb-4 uppercase tracking-widest font-sans">Run Complete</h2>
        
        <div className="mb-8">
            <p className="text-gray-400 text-sm font-mono mb-1">Final Score</p>
            <p className="text-5xl font-mono text-white">{Math.floor(score)}</p>
        </div>

        <div className="flex flex-col gap-3">
            {txHash ? (
                <div className="text-xs text-green-400 font-mono bg-green-900/20 border border-green-800 p-2.5 rounded break-all">
                    <div className="text-[10px] text-cyan-300 font-semibold mb-1">⚡ DENIM CANONICAL 200ms BLOCK CONFIRMED</div>
                    Score recorded on Base!<br/>
                    <span className="text-gray-300 text-[11px]">Tx: {txHash.slice(0, 18)}...{txHash.slice(-8)}</span>
                </div>
            ) : (
                <button
                    onClick={submitScore}
                    disabled={isSubmitting || !isConnected}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all uppercase text-sm tracking-wider"
                >
                    {isSubmitting ? 'Confirming in 200ms block...' : 'Record This Run on-chain'}
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

            {isConnected && (
                <div className="mt-4 flex justify-center">
                  <button
                      onClick={sayGM}
                      className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center justify-center gap-2 font-['Cinzel'] text-xs font-bold w-full"
                  >
                      <Sun size={16} />
                      Say GM
                  </button>
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
}
