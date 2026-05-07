import { Web3Provider } from "./components/Web3Provider";
import { GameCanvas } from "./components/GameCanvas";
import { TitleScreen } from "./components/TitleScreen";
import { HUD } from "./components/HUD";
import { GameOverScreen } from "./components/GameOverScreen";
import { useGameStore } from "./store/useGameStore";

function GameRoot() {
  const { screen } = useGameStore();

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

