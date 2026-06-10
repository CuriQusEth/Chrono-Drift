import { Web3Provider } from "./components/Web3Provider";
import { GameCanvas } from "./components/GameCanvas";
import { TitleScreen } from "./components/TitleScreen";
import { HUD } from "./components/HUD";
import { GameOverScreen } from "./components/GameOverScreen";
import { useGameStore } from "./store/useGameStore";
import { useAccount, useSendTransaction } from 'wagmi';
import { Sun } from 'lucide-react';

function GameRoot() {
  const { screen } = useGameStore();
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: BigInt(0),
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none">
      {screen === 'title' && <TitleScreen />}
      
      {(screen === 'playing' || screen === 'game_over') && (
        <>
          <GameCanvas />
          <HUD />
        </>
      )}

      {screen === 'game_over' && <GameOverScreen />}

      {isConnected && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold pointer-events-auto"
          >
            <Sun size={16} />
            Say GM
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <GameRoot />
    </Web3Provider>
  );
}

