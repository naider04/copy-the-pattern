import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Particle, Balloon } from '../types';
import { playPop } from '../utils/audio';

interface CelebrationProps {
  onNext: () => void;
  themeEmoji: string;
  key?: string;
}

export default function Celebration({ onNext, themeEmoji }: CelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation frames ref
  const animFrameIdRef = useRef<number | null>(null);

  // Initialize particles & balloons
  useEffect(() => {
    // Play win fanfare in the main App when this is opened.

    // 1. Generate 40 initial explosion particles
    const initialParticles: Particle[] = Array.from({ length: 45 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      const emojis = ['🌟', '✨', '❤️', '🎈', '🎉', '🌸', '🧁', '⭐'];
      return {
        id: `p-${i}-${Date.now()}`,
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.45, // Center/upper center
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight bias upward
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        color: ['#F472B6', '#34D399', '#60A5FA', '#FBBF24', '#A78BFA', '#F87171'][Math.floor(Math.random() * 6)],
        size: 24 + Math.random() * 24,
        rotation: Math.random() * 360,
        rotSpeed: -5 + Math.random() * 10,
        alpha: 1
      };
    });

    // 2. Generate 14 floating balloons
    const balloonEmojis = ['✨', '💎', '🎨', '🌟', '🍀', '🎈', '🔥', '🌸', '⚡', '🌙', '💜', '🌈'];
    const colors = [
      'rgba(244,63,94,0.85)',   // rose
      'rgba(59,130,246,0.85)',  // blue
      'rgba(16,185,129,0.85)',  // green
      'rgba(245,158,11,0.85)',  // amber
      'rgba(139,92,246,0.85)',  // violet
      'rgba(236,72,153,0.85)',  // pink
      'rgba(6,182,212,0.85)'    // cyan
    ];

    const initialBalloons: Balloon[] = Array.from({ length: 14 }).map((_, i) => {
      return {
        id: `b-${i}`,
        x: 10 + Math.random() * 80, // percentage x (10% to 90%)
        y: window.innerHeight + 100 + (Math.random() * 180), // staggered starts from bottom
        speed: 1.8 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)],
        size: 70 + Math.random() * 30, // Big baby-friendly sizing
        swaySeed: Math.random() * 100
      };
    });

    setParticles(initialParticles);
    setBalloons(initialBalloons);

    // Frame update loop
    let lastTime = performance.now();
    
    const update = (time: number) => {
      const delta = (time - lastTime) / 16.666; // Normalized to ~60fps
      lastTime = time;

      // Update particles
      setParticles(prev => {
        return prev
          .map(p => {
            const nextVy = p.vy + 0.16 * delta; // simple gravity
            return {
              ...p,
              x: p.x + p.vx * delta,
              y: p.y + nextVy * delta,
              vy: nextVy,
              rotation: p.rotation + p.rotSpeed * delta,
              alpha: Math.max(0, p.alpha - 0.012 * delta)
            };
          })
          .filter(p => p.alpha > 0.02 && p.y < window.innerHeight + 100);
      });

      // Update balloons
      setBalloons(prev => {
        return prev
          .map(b => {
            const timeFactor = time * 0.002;
            const sway = Math.sin(timeFactor + b.swaySeed) * 0.8;
            return {
              ...b,
              y: b.y - b.speed * delta,
              x: Math.max(5, Math.min(95, b.x + sway * delta))
            };
          })
          .filter(b => b.y > -150); // Keep on screen
      });

      animFrameIdRef.current = requestAnimationFrame(update);
    };

    animFrameIdRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Pop a balloon
  const handlePopBalloon = (balloonId: string, clientX: number, clientY: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playPop();
    setPoppedCount(prev => prev + 1);

    // Remove the popped balloon
    setBalloons(prev => prev.filter(b => b.id !== balloonId));

    // Generate local burst particles where it popped
    const burstCount = 12;
    const burstParticles: Particle[] = Array.from({ length: burstCount }).map((_, i) => {
      const angle = (i / burstCount) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 3 + Math.random() * 5;
      return {
        id: `pop-p-${balloonId}-${i}-${Date.now()}`,
        x: clientX,
        y: clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        emoji: '✨',
        color: '#FFD700',
        size: 16 + Math.random() * 16,
        rotation: Math.random() * 360,
        rotSpeed: -10 + Math.random() * 20,
        alpha: 1
      };
    });

    setParticles(prev => [...prev, ...burstParticles]);
  };

  return (
    <div 
      ref={containerRef}
      id="celebration-overlay"
      className="fixed inset-0 z-50 overflow-hidden pointer-events-auto bg-black/45 backdrop-blur-sm select-none flex flex-col justify-between p-6"
    >
      {/* Visual background sparkling particles rendering */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full">
        {particles.map((p) => (
          <text
            key={p.id}
            x={p.x}
            y={p.y}
            style={{
              fontSize: `${p.size}px`,
              opacity: p.alpha,
              transformOrigin: 'center',
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.15))`
            }}
          >
            {p.emoji}
          </text>
        ))}
      </svg>

      {/* Floating Interactive Balloons layer */}
      <div className="absolute inset-0 pointer-events-auto">
        {balloons.map((b) => (
          <div
            key={b.id}
            onClick={(e) => handlePopBalloon(b.id, (b.x / 100) * window.innerWidth, b.y, e)}
            className="absolute rounded-full cursor-pointer select-none transition-transform duration-100 hover:scale-105 active:scale-95 flex flex-col items-center justify-center p-2 group"
            style={{
              left: `${b.x}%`,
              top: `${b.y}px`,
              width: `${b.size}px`,
              height: `${b.size * 1.2}px`,
              backgroundColor: b.color,
              transform: `translate(-50%, -50%)`,
              boxShadow: 'inset -8px -12px 16px rgba(0,0,0,0.2), inset 6px 8px 12px rgba(255,255,255,0.4), 0 8px 20px rgba(0,0,0,0.15)',
              borderBottomLeftRadius: '48%',
              borderBottomRightRadius: '48%',
            }}
          >
            {/* Glossy shine reflection on balloon */}
            <div className="absolute top-[8%] left-[12%] w-[25%] h-[15%] bg-white/50 rounded-full rotate-[-30deg]" />
            
            {/* Emoji Inside */}
            <span style={{ fontSize: `${b.size * 0.35}px` }} className="drop-shadow-sm select-none pointer-events-none transform animate-pulse">
              {b.emoji}
            </span>

            {/* Balloon knot and hanging string */}
            <div 
              style={{ borderColor: b.color }}
              className="absolute bottom-[-8px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] transform rotate-180" 
            />
            <div className="absolute bottom-[-45px] w-[2px] h-[40px] bg-white/40 rounded shadow-sm" />
          </div>
        ))}
      </div>

      {/* Celebration Central Mascot Card */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 relative z-10">
        <motion.div
          initial={{ scale: 0.3, y: 100, rotate: -15 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 110 }}
          className="bg-white/95 dark:bg-slate-900/95 rounded-[2rem] border-4 border-amber-400 p-8 shadow-2xl flex flex-col items-center text-center max-w-sm mx-auto"
        >
          {/* Big adorable dynamic reward animation */}
          <div className="text-8xl mb-4 relative">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1], 
                rotate: [0, 10, -10, 10, 0],
                y: [0, -30, 0] 
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              🎉
            </motion.div>
            <div className="absolute -top-3 -right-3 text-3xl">🌟</div>
            <div className="absolute -bottom-2 -left-4 text-4xl">🎈</div>
          </div>

          {/* Super happy feedback stars counter or visual reward */}
          <div className="flex justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span 
                key={i} 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="text-3xl text-amber-400 font-bold"
              >
                ⭐
              </motion.span>
            ))}
          </div>

          <h2 className="text-3xl font-extrabold text-amber-500 mb-2 tracking-tight select-none">
            ¡EXCELENTE!
          </h2>
          <p className="text-lg font-bold text-slate-500 select-none">
            {poppedCount > 0 ? `🎈 ¡Explotaste ${poppedCount} globos!` : '🎈 ¡Revienta los globos flotantes!'}
          </p>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onNext}
            className="mt-6 px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-extrabold text-2xl rounded-full shadow-lg shadow-green-400/40 border-b-8 border-green-600 cursor-pointer flex items-center justify-center gap-2 hover:scale-105 transition-all text-shadow"
          >
            <span>👍</span>
            <span>OTRO</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative prompt at footer */}
      <div className="text-white/60 text-center font-bold text-lg pointer-events-none relative z-10 drop-shadow-sm p-4 rounded-xl bg-black/25 self-center max-w-xs animate-bounce">
        🌟 👉 ¡REVIENTA LOS GLOBOS! 👈 🌟
      </div>
    </div>
  );
}
