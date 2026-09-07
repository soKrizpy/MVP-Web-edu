import React, { useState } from 'react';
import {
  X,
  Swords,
  Shield,
  Zap,
  Flame,
  HelpCircle,
  Trophy,
  CheckCircle,
  XCircle,
  Coins,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeaderboardUser } from '../../types';
import { soundFX } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onClose: () => void;
}

export const PetBattleArena: React.FC<Props> = ({ onClose }) => {
  const { pet, leaderboard, recordBattleResult } = useApp();

  // Pickable opponents (filter out current user)
  const opponents = leaderboard.filter(u => !u.isCurrentUser);
  const [selectedOpponent, setSelectedOpponent] = useState<LeaderboardUser>(opponents[0] || null);

  const [battleState, setBattleState] = useState<'select' | 'battling' | 'victory' | 'defeat'>('select');

  // Combat stats
  const maxPlayerHp = 100 + pet.level * 15;
  const [playerHp, setPlayerHp] = useState<number>(maxPlayerHp);
  const [shieldActive, setShieldActive] = useState<boolean>(false);

  const [opponentMaxHp, setOpponentMaxHp] = useState<number>(100);
  const [opponentHp, setOpponentHp] = useState<number>(100);

  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);

  // Quick Quiz Blitz mini-question
  const [showQuickQuiz, setShowQuickQuiz] = useState<boolean>(false);
  const [quickQuizQuestion, setQuickQuizQuestion] = useState<{
    question: string;
    options: string[];
    correct: string;
  } | null>(null);

  const startBattle = (opp: LeaderboardUser) => {
    setSelectedOpponent(opp);
    const oppHp = 100 + opp.petLevel * 12;
    setOpponentMaxHp(oppHp);
    setOpponentHp(oppHp);
    setPlayerHp(maxPlayerHp);
    setShieldActive(false);
    setBattleLog([`⚔️ The duel begins! ${pet.name} challenges ${opp.name}'s ${opp.petName}!`]);
    setIsPlayerTurn(true);
    setBattleState('battling');
  };

  const handleOpponentTurn = (currentPlHp: number, currentOppHp: number) => {
    if (currentOppHp <= 0) return;

    setIsPlayerTurn(false);
    setTimeout(() => {
      // Opponent AI action
      const baseOppDmg = Math.floor(12 + selectedOpponent.powerRating * 0.2);
      const finalDmg = shieldActive ? Math.floor(baseOppDmg * 0.4) : baseOppDmg;
      setShieldActive(false);

      soundFX.playBattleHit();
      const newPlHp = Math.max(0, currentPlHp - finalDmg);
      setPlayerHp(newPlHp);

      const logMsg = shieldActive
        ? `🛡️ ${selectedOpponent.petName} attacked, but your Algorithm Shield absorbed damage! (-${finalDmg} HP)`
        : `💥 ${selectedOpponent.petName} used Binary Slash for ${finalDmg} damage!`;

      setBattleLog(prev => [logMsg, ...prev.slice(0, 5)]);

      if (newPlHp <= 0) {
        setBattleState('defeat');
        soundFX.playWrong();
        recordBattleResult(false);
      } else {
        setIsPlayerTurn(true);
      }
    }, 1000);
  };

  // Move 1: Logic Strike
  const executeLogicStrike = () => {
    if (!isPlayerTurn) return;
    soundFX.playBattleHit();

    const damage = Math.floor(pet.attack * 0.65 + Math.random() * 8);
    const newOppHp = Math.max(0, opponentHp - damage);
    setOpponentHp(newOppHp);

    setBattleLog(prev => [`⚡ ${pet.name} used Logic Strike! Dealt ${damage} damage to ${selectedOpponent.petName}.`, ...prev.slice(0, 5)]);

    if (newOppHp <= 0) {
      handleVictory();
    } else {
      handleOpponentTurn(playerHp, newOppHp);
    }
  };

  // Move 2: Algorithm Shield
  const executeShield = () => {
    if (!isPlayerTurn) return;
    soundFX.playCorrect();
    setShieldActive(true);
    setBattleLog(prev => [`🛡️ ${pet.name} deployed Algorithm Shield! Incoming damage will be reduced by 60%.`, ...prev.slice(0, 5)]);
    handleOpponentTurn(playerHp, opponentHp);
  };

  // Move 3: Focus Burst (powered by study streak)
  const executeFocusBurst = () => {
    if (!isPlayerTurn) return;
    soundFX.playBattleHit();

    const damage = Math.floor(pet.attack * 0.95 + 10);
    const newOppHp = Math.max(0, opponentHp - damage);
    setOpponentHp(newOppHp);

    setBattleLog(prev => [`🔥 ${pet.name} channeled Study Focus Burst! Supercharged strike for ${damage} damage!`, ...prev.slice(0, 5)]);

    if (newOppHp <= 0) {
      handleVictory();
    } else {
      handleOpponentTurn(playerHp, newOppHp);
    }
  };

  // Move 4: Quick Quiz Blitz
  const triggerQuickQuiz = () => {
    if (!isPlayerTurn) return;
    const sampleQuestions = [
      {
        question: 'Which HTTP method is idempotent?',
        options: ['POST', 'GET', 'PATCH'],
        correct: 'GET'
      },
      {
        question: 'In TypeScript, what type represents any non-primitive value?',
        options: ['object', 'number', 'boolean'],
        correct: 'object'
      },
      {
        question: 'What is the time complexity of searching a hash map?',
        options: ['O(1)', 'O(n)', 'O(log n)'],
        correct: 'O(1)'
      }
    ];
    const q = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
    setQuickQuizQuestion(q);
    setShowQuickQuiz(true);
  };

  const handleAnswerQuickQuiz = (ans: string) => {
    setShowQuickQuiz(false);
    if (!quickQuizQuestion) return;

    if (ans === quickQuizQuestion.correct) {
      soundFX.playCorrect();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      const critDmg = Math.floor(pet.attack * 1.6 + 15);
      const newOppHp = Math.max(0, opponentHp - critDmg);
      setOpponentHp(newOppHp);

      setBattleLog(prev => [
        `🎯 CRITICAL HIT! Correct quiz answer activated 2.5x Blitz for ${critDmg} damage!`,
        ...prev.slice(0, 5)
      ]);

      if (newOppHp <= 0) {
        handleVictory();
      } else {
        handleOpponentTurn(playerHp, newOppHp);
      }
    } else {
      soundFX.playWrong();
      setBattleLog(prev => [`❌ Quiz answer missed! The blitz fizzled out...`, ...prev.slice(0, 5)]);
      handleOpponentTurn(playerHp, opponentHp);
    }
  };

  const handleVictory = () => {
    setBattleState('victory');
    soundFX.playLevelUp();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    recordBattleResult(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[92vh]"
      >
        {/* Arena Top Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-outfit">Pet Duel Arena</h3>
              <p className="text-[11px] text-zinc-400">Battle dummy pets cloned from top students on the leaderboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">
          {battleState === 'select' && (
            <div>
              <div className="text-center mb-6">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Select Opponent
                </span>
                <h2 className="text-2xl font-black font-outfit mt-2">Challenge a Student's Dummy Pet</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Duel against ghost copies of classmates' companions. Win to earn +80 Pet EXP and 50 Coins!
                </p>
              </div>

              {/* Opponent Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {opponents.map(opp => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/60 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-600 flex items-center justify-center text-2xl shadow-md">
                        {opp.petSpecies === 'chrono' ? '🛸' : opp.petSpecies === 'lumina' ? '🌌' : '🐲'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {opp.petName}
                        </p>
                        <p className="text-[11px] text-zinc-400">Owner: {opp.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-bold">
                          <span className="text-indigo-400">Lv.{opp.petLevel}</span>
                          <span>•</span>
                          <span className="text-amber-400">Power: {opp.powerRating}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => startBattle(opp)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
                    >
                      Duel Pet
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {battleState === 'battling' && (
            <div className="space-y-6">
              {/* Battle Stadium Visual Stage */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-zinc-950 border border-zinc-800 relative overflow-hidden">
                <div className="grid grid-cols-2 gap-6 items-center">
                  {/* Player Side */}
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold">{pet.name} (You)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500 font-bold">
                        Lv.{pet.level}
                      </span>
                    </div>
                    {/* HP Bar */}
                    <div className="w-full max-w-[200px]">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                        <span>HP</span>
                        <span>{playerHp}/{maxPlayerHp}</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${(playerHp / maxPlayerHp) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-6xl sm:text-7xl mt-4 select-none animate-pulse">
                      {pet.stage === 'baby' ? '🐣' : pet.stage === 'novice' ? '⚡🦊' : '🐲'}
                    </div>
                    {shieldActive && (
                      <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                        Shield Active (-60% DMG)
                      </span>
                    )}
                  </div>

                  {/* Opponent Dummy Pet Side */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500 font-bold">
                        Lv.{selectedOpponent.petLevel}
                      </span>
                      <span className="text-sm font-bold text-rose-300">{selectedOpponent.petName}</span>
                    </div>
                    {/* HP Bar */}
                    <div className="w-full max-w-[200px]">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                        <span>HP</span>
                        <span>{opponentHp}/{opponentMaxHp}</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all duration-300"
                          style={{ width: `${(opponentHp / opponentMaxHp) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-6xl sm:text-7xl mt-4 select-none transform -scale-x-100">
                      {selectedOpponent.petSpecies === 'chrono' ? '🛸' : selectedOpponent.petSpecies === 'lumina' ? '🌌' : '🐲'}
                    </div>
                    <span className="mt-2 text-[10px] text-zinc-500">
                      Cloned from {selectedOpponent.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Battle Action Combat Log */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-1 max-h-24 overflow-y-auto">
                {battleLog.map((log, i) => (
                  <p key={i} className={i === 0 ? 'text-amber-300 font-bold' : 'text-zinc-400'}>
                    {log}
                  </p>
                ))}
              </div>

              {/* Combat Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  disabled={!isPlayerTurn}
                  onClick={executeLogicStrike}
                  className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 disabled:opacity-40 transition-all flex flex-col items-center text-center"
                >
                  <Zap className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="text-xs font-bold">Logic Strike</span>
                  <span className="text-[10px] text-zinc-400">Physical attack</span>
                </button>

                <button
                  disabled={!isPlayerTurn || shieldActive}
                  onClick={executeShield}
                  className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/50 disabled:opacity-40 transition-all flex flex-col items-center text-center"
                >
                  <Shield className="w-5 h-5 text-blue-400 mb-1" />
                  <span className="text-xs font-bold">Algorithm Shield</span>
                  <span className="text-[10px] text-zinc-400">-60% next hit</span>
                </button>

                <button
                  disabled={!isPlayerTurn}
                  onClick={executeFocusBurst}
                  className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/50 disabled:opacity-40 transition-all flex flex-col items-center text-center"
                >
                  <Flame className="w-5 h-5 text-orange-400 mb-1" />
                  <span className="text-xs font-bold">Focus Burst</span>
                  <span className="text-[10px] text-zinc-400">Streak powered</span>
                </button>

                <button
                  disabled={!isPlayerTurn}
                  onClick={triggerQuickQuiz}
                  className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-900 to-violet-900 border border-indigo-700/80 hover:border-indigo-400 disabled:opacity-40 transition-all flex flex-col items-center text-center"
                >
                  <Sparkles className="w-5 h-5 text-indigo-300 mb-1 animate-spin" />
                  <span className="text-xs font-bold text-indigo-200">Quiz Blitz</span>
                  <span className="text-[10px] text-indigo-300/80">2.5x Crit Strike!</span>
                </button>
              </div>
            </div>
          )}

          {/* Victory View */}
          {battleState === 'victory' && (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-xl shadow-amber-500/30 mb-4 animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Victory Achieved!
              </span>
              <h2 className="text-2xl font-black font-outfit mt-1">
                {pet.name} Defeated {selectedOpponent.petName}!
              </h2>
              <p className="text-sm text-zinc-400 mt-1 max-w-md">
                Your daily study habits gave you the competitive edge!
              </p>

              <div className="flex items-center gap-4 mt-6">
                <div className="px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Reward</p>
                    <p className="text-sm font-black text-indigo-400">+80 EXP</p>
                  </div>
                </div>
                <div className="px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Coins</p>
                    <p className="text-sm font-black text-amber-400">+50 Coins</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setBattleState('select')}
                className="mt-8 px-8 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all"
              >
                Challenge Another Dummy Pet
              </button>
            </div>
          )}

          {/* Defeat View */}
          {battleState === 'defeat' && (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-xl mb-4">
                <Swords className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black font-outfit mt-1">Duel Concluded</h2>
              <p className="text-sm text-zinc-400 mt-1 max-w-md">
                {selectedOpponent.petName} was formidable this round. Complete more lesson quizzes to raise {pet.name}'s Attack and Level up!
              </p>

              <button
                onClick={() => setBattleState('select')}
                className="mt-8 px-8 py-3 rounded-2xl font-bold text-xs bg-zinc-800 hover:bg-zinc-700 text-white transition-all"
              >
                Return to Arena Selection
              </button>
            </div>
          )}
        </div>

        {/* Quick Quiz Blitz Pop-Up Overlay during battle */}
        <AnimatePresence>
          {showQuickQuiz && quickQuizQuestion && (
            <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-zinc-900 border border-indigo-500/40 rounded-3xl p-6 max-w-md w-full text-center shadow-2xl"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" /> Quick Quiz Blitz! (2.5x Crit)
                </div>
                <h3 className="text-base font-bold text-white mb-4">
                  {quickQuizQuestion.question}
                </h3>
                <div className="space-y-2">
                  {quickQuizQuestion.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerQuickQuiz(opt)}
                      className="w-full p-3 rounded-xl bg-zinc-800 hover:bg-indigo-600 hover:text-white font-medium text-xs border border-zinc-700 transition-colors text-left"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
