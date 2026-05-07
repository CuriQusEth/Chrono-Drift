import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';

export function useGameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const { tickTime, timeSlowFactor, isRewinding, isBursting, score, combo, timeRemaining, endGame } = useGameStore();

  // Car state
  const carRef = useRef({
    x: 0,
    y: 0,
    speed: 5,
    angle: 0,
    drift: 0,
  });

  const trackRef = useRef({
    offsetY: 0,
  });

  const update = (time: number) => {
    if (lastTimeRef.current !== 0) {
      const dt = (time - lastTimeRef.current) / 1000;
      tickTime(dt);

      if (timeRemaining <= 0) {
        endGame();
        return;
      }

      // Physics logic
      const car = carRef.current;
      const track = trackRef.current;
      
      const currentSpeed = car.speed * timeSlowFactor * (isBursting ? 3 : 1) * (isRewinding ? -2 : 1);
      
      track.offsetY = (track.offsetY + currentSpeed) % 40; // Track grid movement
      
      // Keep car in bounds
      car.x = Math.max(-150, Math.min(150, car.x + car.drift * dt * 60));
    }
    
    lastTimeRef.current = time;
    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height - 150;

    // Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Motion blur effect
    ctx.fillRect(0, 0, width, height);

    // Apply time-based visual effects
    if (isRewinding) {
      ctx.fillStyle = 'rgba(255, 0, 255, 0.1)';
      ctx.fillRect(0, 0, width, height);
    } else if (timeSlowFactor < 1) {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.fillRect(0, 0, width, height);
    } else if (isBursting) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);
    }

    // Draw Track (Neon Grid)
    ctx.strokeStyle = '#0ff'; // Cyan
    ctx.lineWidth = 2;
    
    // Perspective lines
    for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 400, height);
        ctx.lineTo(cx + i * 50, height / 3);
        ctx.stroke();
    }

    // Horizontal grid lines
    const track = trackRef.current;
    for (let i = 0; i < 20; i++) {
        const y = height - ((i * 40 + track.offsetY) * (i * 0.15));
        if (y > height / 3) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    // Draw Car
    const car = carRef.current;
    ctx.save();
    ctx.translate(cx + car.x, cy);
    ctx.rotate(car.angle);

    // Car Body
    ctx.fillStyle = '#f0f'; // Magenta
    ctx.shadowColor = '#f0f';
    ctx.shadowBlur = 10;
    
    // Engine glow
    if (isBursting) {
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#ff0';
        ctx.shadowBlur = 20;
    }

    ctx.fillRect(-15, -30, 30, 60);
    
    // Windshield
    ctx.fillStyle = '#0ff';
    ctx.fillRect(-10, -10, 20, 15);

    ctx.restore();
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  });

  return { canvasRef, carRef };
}
