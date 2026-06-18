export type ThemeId = 'rainbow' | 'safari' | 'cosmic';

export interface Figure {
  id: string;
  nameEn: string;
  nameEs: string;
  iconName: string; // The Lucide icon key
  colorClass: string; // Tailind class for coloring
  bgClass: string; // Tailwind background base
  emoji: string; // Cute emoji fallback / overlay
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  alpha: number;
}

export interface Balloon {
  id: string;
  x: number; // Percent of screen width (0-100)
  y: number; // Pixels from bottom
  speed: number;
  color: string;
  emoji: string;
  size: number;
  swaySeed: number;
}
