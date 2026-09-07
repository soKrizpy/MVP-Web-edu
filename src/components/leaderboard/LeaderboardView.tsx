import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Swords,
  Sparkles,
  Shield,
  Medal,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeaderboardUser } from '../../types';

interface Props {
  onChallengePet: () => void;
}

export const LeaderboardView: React.FC<Props> = ({ onChallengePet }) => {
  const { leaderboard, user, pet } = useApp();
  const [filter, setFilter] = useState<'global' | 'weekly'>('weekly');

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50">
              Global & Weekly Leaderboard
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Ranked by study EXP and streaks. Challenge classmates' dummy pets to test your study strength!
          </p>
        </div>

        {/* Weekly / All Time Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 self-start">
          <button
            onClick={() => setFilter('weekly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'weekly'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Weekly League
          </button>
          <button
            onClick={() => setFilter('global')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'global'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            All-Time Hall
          </button>
        </div>
      </div>

      {/* Top 3 Podium Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {leaderboard.slice(0, 3).map((student, idx) => {
          const podiumColor =
            idx === 0
              ? 'from-amber-500 to-amber-600 text-white shadow-amber-500/20'
              : idx === 1
              ? 'from-slate-300 to-slate-400 text-zinc-900 shadow-slate-400/20'
              : 'from-amber-700 to-amber-800 text-white shadow-amber-700/20';

          return (
            <div
              key={student.id}
              className={`p-6 rounded-3xl bg-gradient-to-b ${podiumColor} shadow-xl relative overflow-hidden flex flex-col items-center text-center`}
            >
              <div className="absolute top-3 right-3 text-2xl font-black opacity-30">
                #{idx + 1}
              </div>

              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/50 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 text-xl">
                  {idx === 0 ? '👑' : idx === 1 ? '🥈' : '🥉'}
                </span>
              </div>

              <h4 className="font-bold text-sm mt-3">{student.name}</h4>
              <p className="text-xs opacity-85 font-mono">{student.xp} EXP</p>

              <div className="mt-3 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs text-[11px] font-semibold flex items-center gap-1.5">
                <span>🐾 {student.petName} (Lv.{student.petLevel})</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {leaderboard.map((student, rank) => {
            const isSelf = student.isCurrentUser;
            return (
              <div
                key={student.id}
                className={`p-4 sm:px-6 flex items-center justify-between gap-4 transition-colors ${
                  isSelf ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold' : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank number */}
                  <span className="w-6 text-center font-mono font-bold text-sm text-zinc-400">
                    #{rank + 1}
                  </span>

                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {student.name}
                      </p>
                      {isSelf && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      <span className="flex items-center gap-0.5 text-orange-500 font-semibold">
                        <Flame className="w-3.5 h-3.5 fill-orange-500" /> {student.streakDays}d streak
                      </span>
                      <span>•</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {student.tier}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pet & Action */}
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end text-right">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      🐾 {student.petName}
                    </span>
                    <span className="text-[11px] text-zinc-500">Lv.{student.petLevel} • Power {student.powerRating}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-black text-zinc-900 dark:text-zinc-100">
                      {student.xp}
                    </span>
                    <span className="text-[10px] text-zinc-400 block uppercase">EXP</span>
                  </div>

                  {!isSelf && (
                    <button
                      onClick={onChallengePet}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1 shrink-0"
                      title="Challenge dummy pet in duel arena"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Duel</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
