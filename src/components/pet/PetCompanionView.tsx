import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Zap,
  Shield,
  Swords,
  Apple,
  Cookie,
  Flame,
  Palette,
  Check,
  TrendingUp,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SeasonalTheme, PetSpecies } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onOpenBattleArena: () => void;
}

export const PetCompanionView: React.FC<Props> = ({ onOpenBattleArena }) => {
  const { pet, feedPet, playWithPet, changePetTheme } = useApp();
  const [pettingHearts, setPettingHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    playWithPet();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newHeart = { id: Date.now(), x, y };
    setPettingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setPettingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 900);
  };

  const themes: { id: SeasonalTheme; name: string; icon: string; bgClass: string; auraClass: string }[] = [
    {
      id: 'spring_sakura',
      name: 'Spring Sakura',
      icon: '🌸',
      bgClass: 'from-pink-500/10 via-rose-500/5 to-purple-500/10 border-pink-200 dark:border-pink-900/50',
      auraClass: 'shadow-pink-500/30'
    },
    {
      id: 'cyber_neon',
      name: 'Cyber Neon',
      icon: '⚡',
      bgClass: 'from-cyan-500/10 via-indigo-500/5 to-emerald-500/10 border-cyan-200 dark:border-cyan-900/50',
      auraClass: 'shadow-cyan-500/40'
    },
    {
      id: 'autumn_ember',
      name: 'Autumn Ember',
      icon: '🍁',
      bgClass: 'from-amber-500/10 via-orange-500/5 to-red-500/10 border-amber-200 dark:border-amber-900/50',
      auraClass: 'shadow-orange-500/30'
    },
    {
      id: 'frost_winter',
      name: 'Frost Winter',
      icon: '❄️',
      bgClass: 'from-sky-500/10 via-blue-500/5 to-indigo-500/10 border-sky-200 dark:border-sky-900/50',
      auraClass: 'shadow-sky-500/30'
    },
  ];

  const currentThemeObj = themes.find(t => t.id === pet.seasonalTheme) || themes[0];

  return (
    <div id="pet-companion-section" className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title & Introduction Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <h2 className="text-xl sm:text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50">
              Tamagotchi Study Companion
            </h2>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              EXP Driven
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Grows with your study progress! Earn EXP from quizzes to evolve, feed snacks, and battle dummy pets.
          </p>
        </div>

        {/* Enter Arena Button */}
        <button
          id="enter-pet-battle-btn"
          onClick={onOpenBattleArena}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all transform active:scale-95"
        >
          <Swords className="w-4 h-4 animate-pulse" />
          <span>Battle Arena (Duel Students)</span>
        </button>
      </div>

      {/* Main Sanctuary Card */}
      <div
        className={`relative rounded-3xl border p-6 sm:p-8 bg-gradient-to-b ${currentThemeObj.bgClass} shadow-xl overflow-hidden transition-all duration-300`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Pet Interactive Stage */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[300px]">
            {/* Seasonal Aura Background Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
            </div>

            {/* Clickable Pet Figure with Motion */}
            <motion.div
              onClick={handlePetClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="relative cursor-pointer select-none group z-10 flex flex-col items-center"
              title="Click or tap to pat Voltrix!"
            >
              {/* Pet Avatar SVG Graphic */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center">
                {pet.species === 'sparky' && (
                  <div className="w-full h-full flex items-center justify-center text-8xl sm:text-9xl drop-shadow-2xl">
                    {pet.stage === 'baby' ? '🐣' : pet.stage === 'novice' ? '⚡🦊' : pet.stage === 'adept' ? '🐲' : '👑🐉'}
                  </div>
                )}
                {pet.species === 'lumina' && (
                  <div className="w-full h-full flex items-center justify-center text-8xl sm:text-9xl drop-shadow-2xl">
                    {pet.stage === 'baby' ? '✨' : pet.stage === 'novice' ? '🦊' : pet.stage === 'adept' ? '🔮🐺' : '🌌🦊'}
                  </div>
                )}
                {pet.species === 'chrono' && (
                  <div className="w-full h-full flex items-center justify-center text-8xl sm:text-9xl drop-shadow-2xl">
                    {pet.stage === 'baby' ? '🥚' : pet.stage === 'novice' ? '🦉' : pet.stage === 'adept' ? '🤖🦉' : '🛸🦅'}
                  </div>
                )}
              </div>

              {/* Floating Name & Stage Banner */}
              <div className="mt-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-md text-center">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-zinc-900 dark:text-zinc-50">{pet.name}</span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500 text-white">
                    {pet.stage}
                  </span>
                </div>
              </div>

              {/* Hearts Popups on Petting */}
              <AnimatePresence>
                {pettingHearts.map(h => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 1, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, y: -50, scale: 1.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute text-rose-500 pointer-events-none"
                    style={{ left: h.x, top: h.y }}
                  >
                    <Heart className="w-6 h-6 fill-rose-500" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-4 text-center">
              💡 Tap your pet to play & raise happiness!
            </p>
          </div>

          {/* Right: Stats, Hunger, Feeding, and Seasonal Theme Picker */}
          <div className="lg:col-span-5 space-y-5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 rounded-3xl border border-zinc-200/70 dark:border-zinc-800">
            {/* Level & EXP Progress */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="w-4 h-4" /> Level {pet.level}
                </span>
                <span>{pet.exp} / {pet.expToNextLevel} EXP</span>
              </div>
              <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (pet.exp / pet.expToNextLevel) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Hunger & Happiness Meters */}
            <div className="grid grid-cols-2 gap-3">
              {/* Hunger */}
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  <span>Hunger / Energy</span>
                  <span className={pet.hunger < 30 ? 'text-rose-500' : 'text-emerald-500'}>{pet.hunger}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pet.hunger < 30 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pet.hunger}%` }}
                  ></div>
                </div>
              </div>

              {/* Happiness */}
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  <span>Happiness</span>
                  <span className="text-pink-500">{pet.happiness}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${pet.happiness}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Combat Power Stats */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-200 dark:border-zinc-800 text-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Attack
                </p>
                <p className="text-base font-black text-zinc-900 dark:text-zinc-50">{pet.attack}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3 text-blue-500" /> Defense
                </p>
                <p className="text-base font-black text-zinc-900 dark:text-zinc-50">{pet.defense}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-rose-500" /> Battles
                </p>
                <p className="text-base font-black text-zinc-900 dark:text-zinc-50">
                  {pet.battlesWon}W / {pet.battlesLost}L
                </p>
              </div>
            </div>

            {/* Feed Pantry (Wisdom Snacks from Quizzes) */}
            <div>
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-rose-500" /> Feed Wisdom Snacks (Earned from Quizzes)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={pet.snacks.wisdomApples <= 0}
                  onClick={() => feedPet('wisdomApples')}
                  className="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 hover:border-rose-300 disabled:opacity-40 transition-all text-center flex flex-col items-center"
                  title="Restores +25 Hunger"
                >
                  <span className="text-lg">🍎</span>
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 mt-1">Apple</span>
                  <span className="text-[10px] text-zinc-400 font-medium">x{pet.snacks.wisdomApples}</span>
                </button>

                <button
                  disabled={pet.snacks.brainBerries <= 0}
                  onClick={() => feedPet('brainBerries')}
                  className="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 hover:border-indigo-300 disabled:opacity-40 transition-all text-center flex flex-col items-center"
                  title="Restores +20 Hunger"
                >
                  <span className="text-lg">🫐</span>
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 mt-1">Berries</span>
                  <span className="text-[10px] text-zinc-400 font-medium">x{pet.snacks.brainBerries}</span>
                </button>

                <button
                  disabled={pet.snacks.codingCookies <= 0}
                  onClick={() => feedPet('codingCookies')}
                  className="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 hover:border-amber-300 disabled:opacity-40 transition-all text-center flex flex-col items-center"
                  title="Restores +30 Hunger"
                >
                  <span className="text-lg">🍪</span>
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 mt-1">Cookie</span>
                  <span className="text-[10px] text-zinc-400 font-medium">x{pet.snacks.codingCookies}</span>
                </button>
              </div>
            </div>

            {/* Seasonal Themes Selector */}
            <div>
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-500" /> Seasonal Environment Aura
              </p>
              <div className="grid grid-cols-2 gap-2">
                {themes.map(t => {
                  const isSelected = pet.seasonalTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => changePetTheme(t.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold ring-1 ring-indigo-500'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{t.icon}</span>
                        <span>{t.name}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
