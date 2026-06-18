/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  Heart, 
  Sun, 
  Cloud, 
  Moon,
  Flower,
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Music, 
  Trophy 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeId, Figure } from './types';
import { FIGURES, THEME_CONFIGS } from './constants';
import { 
  playPop, 
  playCorrectStep, 
  playIncorrect, 
  playWinFanfare, 
  speakWord 
} from './utils/audio';
import Celebration from './components/Celebration';

// Custom component to dynamically render the corresponding Lucide Icon
function FigureIcon({ iconName, className }: { iconName: string; className?: string }) {
  const props = { className: className || "w-16 h-16" };
  switch (iconName) {
    case 'Star': return <Star {...props} />;
    case 'Heart': return <Heart {...props} />;
    case 'Sun': return <Sun {...props} />;
    case 'Cloud': return <Cloud {...props} />;
    case 'Moon': return <Moon {...props} />;
    case 'Flower': return <Flower {...props} />;
    default: return <Sparkles {...props} />;
  }
}

export default function App() {
  // Theme state
  const [themeId, setThemeId] = useState<ThemeId>('rainbow');
  const activeTheme = THEME_CONFIGS[themeId];

  // Game state
  const [targetPattern, setTargetPattern] = useState<Figure[]>([]);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  
  // Celebration state
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  
  // Demo auto-play state
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [demoActiveIndex, setDemoActiveIndex] = useState<number>(-1);

  // Wrong pattern shake animation trigger state
  const [shouldShake, setShouldShake] = useState<boolean>(false);

  // Audio Context first-interaction trigger to satisfy browser security
  const hasInteractedRef = useRef<boolean>(false);

  // Initialize a random pattern of 5 figures
  const generateNewPattern = () => {
    const newPattern: Figure[] = [];
    for (let i = 0; i < 5; i++) {
      // Pick a random figure
      const randomFig = FIGURES[Math.floor(Math.random() * FIGURES.length)];
      newPattern.push(randomFig);
    }
    setTargetPattern(newPattern);
    setCurrentInputIndex(0);
    setIsCelebrating(false);
    
    // Auto play the new pattern after a short delay
    setTimeout(() => {
      playPatternDemo(newPattern);
    }, 400);
  };

  // Run initial pattern setup on mounting
  useEffect(() => {
    generateNewPattern();
  }, []);

  // Demo play sequence function
  const playPatternDemo = async (pattern: Figure[]) => {
    if (isPlayingDemo || isCelebrating) return;
    setIsPlayingDemo(true);
    setCurrentInputIndex(0);

    let index = 0;
    setDemoActiveIndex(0);

    // Speak first item
    if (isAudioEnabled) {
      speakWord(pattern[0].nameEn);
    }

    const interval = setInterval(() => {
      index++;
      if (index < 5) {
        setDemoActiveIndex(index);
        if (isAudioEnabled) {
          speakWord(pattern[index].nameEn);
        }
      } else {
        clearInterval(interval);
        setDemoActiveIndex(-1);
        setIsPlayingDemo(false);
      }
    }, 1300);
  };

  // Manual replay button
  const handleReplayPattern = () => {
    if (isPlayingDemo || isCelebrating) return;
    playPatternDemo(targetPattern);
  };

  // Safe audio activation on user events
  const registerInteraction = () => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      // Triggers synth context wake up
      playPop();
    }
  };

  // Key click handler for the figure grid
  const handleFigureClick = (figure: Figure) => {
    registerInteraction();
    if (isPlayingDemo || isCelebrating) return; // ignore matches while demo playing or celebrating

    const expectedFigure = targetPattern[currentInputIndex];
    
    if (isAudioEnabled) {
      // Speak immediately on hit
      speakWord(figure.nameEn);
    }

    if (figure.id === expectedFigure.id) {
      // CORRECT!
      const nextIndex = currentInputIndex + 1;
      playCorrectStep(currentInputIndex);
      setCurrentInputIndex(nextIndex);

      if (nextIndex === 5) {
        // Complete match victory!
        setTimeout(() => {
          playWinFanfare();
          setIsCelebrating(true);
        }, 350);
      }
    } else {
      // INCORRECT!
      playIncorrect();
      setShouldShake(true);
      setCurrentInputIndex(0); // Restart index to beginning of pattern sequence
      
      // Auto-toggle off shaking
      setTimeout(() => {
        setShouldShake(false);
      }, 550);
    }
  };

  return (
    <div id="app-root" className={activeTheme.containerClass}>
      
      {/* HEADER CONTROLS (Theme picker, speaker) */}
      <header id="app-header" className="max-w-2xl mx-auto w-full flex items-center justify-between gap-4 py-2 z-10 px-2 select-none">
        
        {/* Toggle Theme Buttons with lovely bubble look */}
        <div id="theme-selectors" className="flex items-center gap-2 bg-white/20 backdrop-blur-md p-1.5 rounded-full border-2 border-white/30 shadow-md">
          {(Object.keys(THEME_CONFIGS) as ThemeId[]).map((tId) => {
            const config = THEME_CONFIGS[tId];
            const isSelected = themeId === tId;
            return (
              <button
                key={tId}
                id={`btn-theme-${tId}`}
                onClick={() => {
                  registerInteraction();
                  setThemeId(tId);
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 transform active:scale-95 cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-400 border-4 border-white shadow-lg rotate-12 scale-110' 
                    : 'bg-white/50 hover:bg-white/80 scale-100'
                }`}
              >
                <span>{config.emoji}</span>
              </button>
            );
          })}
        </div>

        {/* Audio Speaker Toggle button */}
        <button
          id="btn-voice-toggle"
          onClick={() => {
            registerInteraction();
            setIsAudioEnabled(!isAudioEnabled);
          }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 shadow-lg transition-transform active:scale-95 cursor-pointer ${
            isAudioEnabled 
              ? 'bg-green-400 border-green-300 text-white hover:bg-green-500' 
              : 'bg-slate-400 border-slate-300 text-white hover:bg-slate-500'
          }`}
        >
          {isAudioEnabled ? (
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Volume2 className="w-8 h-8 drop-shadow-sm" />
            </motion.div>
          ) : (
            <VolumeX className="w-8 h-8" />
          )}
        </button>
      </header>

      {/* FLOATING DECORATIONS - Sparkles, items floating around */}
      <div id="floating-decorations" className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {activeTheme.decorativeEmojis.map((emoji, idx) => (
          <motion.div
            key={idx}
            className="absolute text-5xl opacity-20 filter drop-shadow"
            initial={{ 
              x: `${10 + idx * 16}%`, 
              y: `${20 + (idx % 3) * 25}%`,
              rotate: idx * 30
            }}
            animate={{
              y: [`${20 + (idx % 3) * 25}%`, `${25 + (idx % 3) * 25}%`, `${20 + (idx % 3) * 25}%`],
              rotate: [idx * 30, idx * 30 + 15, idx * 30 - 15, idx * 30]
            }}
            transition={{
              duration: 4 + (idx % 3) * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* CORE INTERACTIVE TOY AREA */}
      <main id="game-container" className="flex-1 flex flex-col justify-center py-4 relative z-10 px-2">
        <div id="game-card" className={activeTheme.cardClass}>
          
          {/* HEADER IN CARD - Target Sequence Track */}
          <div id="pattern-sequence-section" className="flex flex-col gap-3">
            
            {/* Guide header featuring indicators, but minimal text */}
            <div className={`flex items-center justify-between font-extrabold text-xl md:text-2xl ${activeTheme.textColor}`}>
              <div className="flex items-center gap-2">
                <Music className="w-6 h-6 animate-bounce" />
                <span className="tracking-wide select-none">COPIA PATRÓN</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Replay pattern button */}
                <button
                  id="btn-replay-voice"
                  disabled={isPlayingDemo || isCelebrating}
                  onClick={handleReplayPattern}
                  className={`px-4 py-2 text-base rounded-full border-b-4 font-bold flex items-center gap-1.5 cursor-pointer select-none transition-transform active:scale-95 ${
                    isPlayingDemo 
                      ? 'bg-slate-200 border-slate-300 text-slate-400 opacity-60' 
                      : 'bg-amber-400 border-amber-600 text-white hover:bg-amber-500'
                  }`}
                >
                  <span>🔊</span>
                  <span>ESCUCHAR</span>
                </button>
              </div>
            </div>

            {/* Target Figures Tracker Row (5 figure bubbles) */}
            <motion.div 
              id="target-bubbles-row"
              animate={shouldShake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={`p-4 md:p-5 bg-white/40 dark:bg-slate-950/40 rounded-3xl border-4 ${
                shouldShake 
                  ? 'border-rose-400/80 bg-rose-50/50' 
                  : 'border-white/50'
              } flex justify-around gap-2 items-center`}
            >
              {targetPattern.map((fig, idx) => {
                const isCompleted = idx < currentInputIndex;
                const isCurrent = idx === currentInputIndex;
                const isDemoHighlighted = isPlayingDemo && idx === demoActiveIndex;

                return (
                  <motion.div
                    key={idx}
                    id={`target-bubble-${idx}`}
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: isDemoHighlighted || isCurrent ? 1.15 : 1,
                      rotate: isCompleted ? [0, 8, -8, 0] : 0,
                    }}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-4 flex flex-col items-center justify-center relative shadow-md transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-100 border-green-500 scale-100' 
                        : isDemoHighlighted 
                        ? 'bg-amber-100 border-amber-400 ring-4 ring-amber-300'
                        : isCurrent 
                        ? 'bg-white border-dashed border-sky-400 ring-4 ring-sky-200 animate-pulse' 
                        : 'bg-black/5 dark:bg-white/5 border-transparent opacity-40'
                    }`}
                  >
                    {/* Render target figures inside guide bubble */}
                    {fig && (
                      <div className={`transition-all duration-300 ${isCompleted ? 'scale-90 opacity-100' : 'opacity-85'}`}>
                        <FigureIcon 
                          iconName={fig.iconName} 
                          className={`w-8 h-8 md:w-9 md:h-9 ${fig.colorClass}`} 
                        />
                      </div>
                    )}

                    {/* Progress feedback overlays: Completed Green check overlay, or numeric order */}
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Number tracker bubble for infants learning figures */}
                    <div className="absolute -bottom-2 font-black text-xs px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 shadow-sm border border-slate-200">
                      {idx + 1}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* MAIN INTERACTIVE FIGURE TILES GRID (3x2 format, giant baby buttons) */}
          <div id="interactive-grid-section" className="flex flex-col gap-4">
            
            {/* Minimal educational helper indicator card */}
            <div className="text-center">
              {isPlayingDemo ? (
                <div className={`font-bold text-lg md:text-xl flex items-center justify-center gap-2 animate-bounce ${activeTheme.textColor}`}>
                  <span>👀</span>
                  <span>MIRA Y ESCUCHA EL PATRÓN...</span>
                </div>
              ) : (
                <div className="font-extrabold text-xl md:text-2xl text-slate-500 dark:text-slate-400 tracking-wide select-none">
                  👉 ¡PRESIONA LAS FIGURAS!
                </div>
              )}
            </div>

            {/* The 6 grid elements */}
            <div id="figures-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
              {FIGURES.map((fig) => {
                // Check if this grid cell figure gets highlighted in demo mode
                const isDemoPlayingCurrent = isPlayingDemo && targetPattern[demoActiveIndex]?.id === fig.id;

                return (
                  <motion.button
                    key={fig.id}
                    id={`grid-cell-${fig.id}`}
                    whileHover={{ scale: isPlayingDemo || isCelebrating ? 1 : 1.05 }}
                    whileTap={{ scale: isPlayingDemo || isCelebrating ? 1 : 0.90 }}
                    onClick={() => handleFigureClick(fig)}
                    disabled={isPlayingDemo || isCelebrating}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    className={`
                      ${themeId === 'cosmic' 
                        ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-indigo-200 active:bg-indigo-900/60' 
                        : fig.bgClass
                      }
                      ${isDemoPlayingCurrent ? activeTheme.glowClass + ' scale-110 rotate-3 z-10' : ''}
                      ${activeTheme.figureButtonClass}
                      h-32 md:h-40 flex flex-col items-center justify-center gap-2 select-none border-b-8
                    `}
                  >
                    {/* Floating glow/flare around custom demo action */}
                    {isDemoPlayingCurrent && (
                      <span className="absolute -top-1.5 -left-1 text-2xl animate-spin">🌟</span>
                    )}

                    <motion.div
                      animate={isDemoPlayingCurrent ? { 
                        scale: [1, 1.25, 1], 
                        rotate: [0, 10, -10, 0] 
                      } : {}}
                      className="drop-shadow"
                    >
                      <FigureIcon 
                        iconName={fig.iconName} 
                        className={`w-16 h-16 md:w-20 md:h-20 ${fig.colorClass}`} 
                      />
                    </motion.div>

                    {/* Highly visible child emoji decoration inside figures button context */}
                    <span className="text-xl md:text-2xl select-none absolute bottom-1 right-2 drop-shadow">
                      {fig.emoji}
                    </span>
                    
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Reset / skip helper card inside wrapper */}
          <div className="flex gap-4 justify-between items-center bg-white/20 dark:bg-slate-950/20 p-3 rounded-2xl border-2 border-white/20 mt-2 select-none">
            <span className="text-sm font-bold text-slate-500/90 dark:text-slate-400">
              🧩 ¿Quieres cambiar el patrón?
            </span>
            <button
              id="btn-skip-level"
              onClick={() => {
                registerInteraction();
                generateNewPattern();
              }}
              className="px-4 py-2 bg-sky-400 hover:bg-sky-500 text-white font-extrabold text-sm rounded-full border-b-4 border-sky-600 flex items-center gap-1.5 shadow active:scale-95 transform transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>OTRO PATRÓN</span>
            </button>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer id="app-footer" className="text-center select-none py-2 shrink-0 relative z-10">
        <p className={`font-black text-sm tracking-widest ${activeTheme.mutedTextColor}`}>
          ✨ DIVIÉRTETE COPYYING SIGNS ✨
        </p>
      </footer>

      {/* FULL-SCREEN MEGAR REWARD CELEBRATION MODAL OVERLAY */}
      <AnimatePresence>
        {isCelebrating && (
          <Celebration 
            key="celebration-screen"
            themeEmoji={activeTheme.emoji}
            onNext={generateNewPattern}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
