import { Figure, ThemeId } from './types';

export const FIGURES: Figure[] = [
  {
    id: 'star',
    nameEn: 'Star',
    nameEs: 'Estrella',
    iconName: 'Star',
    colorClass: 'text-amber-400 fill-amber-300',
    bgClass: 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/80 active:scale-95 active:bg-amber-200/90 dark:bg-amber-950/20 dark:border-amber-800',
    emoji: '⭐'
  },
  {
    id: 'heart',
    nameEn: 'Heart',
    nameEs: 'Corazón',
    iconName: 'Heart',
    colorClass: 'text-rose-500 fill-rose-300',
    bgClass: 'bg-rose-50/70 border-rose-300 hover:bg-rose-100/80 active:scale-95 active:bg-rose-200/90 dark:bg-rose-950/20 dark:border-rose-800',
    emoji: '❤️'
  },
  {
    id: 'sun',
    nameEn: 'Sun',
    nameEs: 'Sol',
    iconName: 'Sun',
    colorClass: 'text-orange-500 fill-yellow-300',
    bgClass: 'bg-orange-50/70 border-orange-300 hover:bg-orange-100/80 active:scale-95 active:bg-orange-200/90 dark:bg-orange-950/20 dark:border-orange-800',
    emoji: '☀️'
  },
  {
    id: 'cloud',
    nameEn: 'Cloud',
    nameEs: 'Nube',
    iconName: 'Cloud',
    colorClass: 'text-sky-500 fill-sky-200',
    bgClass: 'bg-sky-50/70 border-sky-300 hover:bg-sky-100/80 active:scale-95 active:bg-sky-200/90 dark:bg-sky-950/20 dark:border-sky-800',
    emoji: '☁️'
  },
  {
    id: 'moon',
    nameEn: 'Moon',
    nameEs: 'Luna',
    iconName: 'Moon',
    colorClass: 'text-indigo-400 fill-indigo-200',
    bgClass: 'bg-indigo-50/70 border-indigo-300 hover:bg-indigo-100/80 active:scale-95 active:bg-indigo-200/90 dark:bg-indigo-950/20 dark:border-indigo-800',
    emoji: '🌙'
  },
  {
    id: 'flower',
    nameEn: 'Flower',
    nameEs: 'Flor',
    iconName: 'Flower',
    colorClass: 'text-fuchsia-500 fill-fuchsia-200',
    bgClass: 'bg-fuchsia-50/70 border-fuchsia-300 hover:bg-fuchsia-100/80 active:scale-95 active:bg-fuchsia-200/90 dark:bg-fuchsia-950/20 dark:border-fuchsia-800',
    emoji: '🌸'
  }
];

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  emoji: string;
  containerClass: string;
  cardClass: string;
  figureButtonClass: string;
  glowClass: string;
  textColor: string;
  mutedTextColor: string;
  decorativeEmojis: string[];
}

export const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
  rainbow: {
    id: 'rainbow',
    name: 'Zen Lavender',
    emoji: '💜',
    containerClass: 'bg-gradient-to-tr from-violet-100 via-purple-50 to-indigo-100 transition-colors duration-700 min-h-screen py-6 px-4 flex flex-col justify-between overflow-hidden font-sans',
    cardClass: 'bg-white/90 backdrop-blur-md rounded-[2rem] border-4 border-purple-200 p-6 md:p-8 shadow-xl max-w-2xl mx-auto w-full flex flex-col gap-6 relative overflow-visible',
    figureButtonClass: 'border-2 rounded-2xl p-6 flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer transform',
    glowClass: 'shadow-[0_0_20px_rgba(167,139,250,0.6)] border-purple-400 bg-purple-50/80',
    textColor: 'text-purple-700',
    mutedTextColor: 'text-purple-500/80',
    decorativeEmojis: ['✨', '🌸', '💜', '🌟', '🍃', '🔮']
  },
  safari: {
    id: 'safari',
    name: 'Nordic Forest',
    emoji: '🌲',
    containerClass: 'bg-gradient-to-tr from-emerald-100 via-teal-50 to-stone-100 transition-colors duration-700 min-h-screen py-6 px-4 flex flex-col justify-between overflow-hidden font-sans',
    cardClass: 'bg-white/90 backdrop-blur-md rounded-[2rem] border-4 border-emerald-200 p-6 md:p-8 shadow-xl max-w-2xl mx-auto w-full flex flex-col gap-6 relative overflow-visible',
    figureButtonClass: 'border-2 rounded-2xl p-6 flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer transform',
    glowClass: 'shadow-[0_0_20px_rgba(45,212,191,0.6)] border-teal-400 bg-teal-50/80',
    textColor: 'text-teal-800',
    mutedTextColor: 'text-teal-600/80',
    decorativeEmojis: ['🌲', '🍃', '🌿', '🟢', '✨', '🍀']
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Serenity',
    emoji: '✨',
    containerClass: 'bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 transition-colors duration-700 min-h-screen py-6 px-4 flex flex-col justify-between overflow-hidden font-sans text-slate-100',
    cardClass: 'bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border-4 border-indigo-500/30 p-6 md:p-8 shadow-2xl max-w-2xl mx-auto w-full flex flex-col gap-6 relative overflow-visible shadow-indigo-500/10',
    figureButtonClass: 'border-2 rounded-2xl p-6 flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer transform relative overflow-hidden',
    glowClass: 'shadow-[0_0_30px_rgba(99,102,241,0.5)] border-indigo-400 bg-indigo-950/50',
    textColor: 'text-indigo-200 text-glow-indigo',
    mutedTextColor: 'text-indigo-400/60',
    decorativeEmojis: ['✨', '🪐', '🌙', '⭐', '🌌', '🚀']
  }
};
