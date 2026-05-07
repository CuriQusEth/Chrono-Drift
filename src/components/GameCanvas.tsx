import React, { useEffect, useRef } from 'react';
import { useGameEngine } from '../physics/engine';
import { useGameStore } from '../store/useGameStore';

export function GameCanvas() {
  const { canvasRef, carRef } = useGameEngine();
  const { setTimeSlowFactor, setRewinding, setBursting, updateScore, incrementCombo, resetCombo } = useGameStore();

  const touchStartRef = useRef<{ x: number, y: number, time: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    const now = Date.now();
    touchStartRef.current = { x: e.clientX, y: e.clientY, time: now };

    // Double tap detection for Bursting
    if (now - lastTapRef.current < 300) {
      setBursting(true);
      setTimeout(() => setBursting(false), 2000); // Burst lasts 2 seconds
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    // Hold for Chrono Slow
    setTimeout(() => {
      if (touchStartRef.current && touchStartRef.current.time === now) {
        setTimeSlowFactor(0.3); // Slow down time
      }
    }, 200); // 200ms hold required
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!touchStartRef.current) return;
    
    const dx = e.clientX - touchStartRef.current.x;
    const dy = e.clientY - touchStartRef.current.y;

    // Drifting logic based on horizontal swipe
    if (Math.abs(dx) > 20) {
      carRef.current.drift = dx > 0 ? 1 : -1;
      carRef.current.angle = (dx > 0 ? 1 : -1) * 0.3;
      incrementCombo();
      updateScore(10); // Reward active drifting
    } else {
      carRef.current.drift = 0;
      carRef.current.angle = 0;
    }

    // Rewind logic based on vertical swipe down
    if (dy > 50) {
      setRewinding(true);
      setTimeout(() => setRewinding(false), 1500); // Rewind for 1.5 seconds
      touchStartRef.current = null; // Consume action
    }
  };

  const handlePointerUp = () => {
    touchStartRef.current = null;
    setTimeSlowFactor(1.0); // Restore normal time
    carRef.current.drift = 0;
    carRef.current.angle = 0;
    resetCombo();
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
    />
  );
}
