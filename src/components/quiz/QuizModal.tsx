import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle,
  XCircle,
  ArrowRight,
  Flame,
  HelpCircle,
  Lightbulb,
  Heart,
  RotateCcw,
  Trophy,
  Apple
} from 'lucide-react';
import { Topic, CourseModule, QuizQuestion } from '../../types';
import { useApp } from '../../context/AppContext';
import { soundFX } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  module: CourseModule;
  topic: Topic;
  onClose: () => void;
}

export const QuizModal: React.FC<Props> = ({ module, topic, onClose }) => {
  const { completeTopic } = useApp();

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Guarantee exactly 5 questions
  const questions: QuizQuestion[] = topic.quizzes.slice(0, 5);
  const currentQuestion = questions[currentIdx];

  const handleSelect = (option: string) => {
    if (hasChecked) return;
    setSelectedOption(option);
  };

  const handleCheck = () => {
    if (!selectedOption || hasChecked) return;

    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      soundFX.playCorrect();
      setComboStreak(prev => prev + 1);
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      soundFX.playWrong();
      setComboStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setHasChecked(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Completed all 5 quizzes!
      setIsFinished(true);
      const finalScore = Math.round(((correctAnswersCount + (isCorrect ? 1 : 0)) / questions.length) * 100);
      completeTopic(module.id, topic.id, finalScore);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const finalScore = Math.round((correctAnswersCount / questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Bar (Question 1 to 5) */}
          <div className="flex-1 max-w-xs mx-auto">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
              <span>Quiz {currentIdx + 1} of {questions.length}</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {Math.round(((currentIdx + (hasChecked ? 1 : 0)) / questions.length) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + (hasChecked ? 1 : 0)) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Combo Streak */}
          <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-900/60">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span>{comboStreak}x</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">
          {!isFinished ? (
            <div>
              {/* Question Type Pill */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {currentQuestion.type.replace('_', ' ')}
                </span>
                {currentQuestion.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                  </button>
                )}
              </div>

              {/* Hint Box */}
              {showHint && currentQuestion.hint && (
                <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{currentQuestion.hint}</span>
                </div>
              )}

              {/* Question Text */}
              <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                {currentQuestion.question}
              </h3>

              {/* Code Snippet if present */}
              {currentQuestion.codeSnippet && (
                <div className="my-4 p-4 rounded-2xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}

              {/* Quiz Options */}
              <div className="space-y-3 mt-6">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  let optionClasses =
                    'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-300 hover:bg-indigo-50/20 text-zinc-800 dark:text-zinc-200';

                  if (hasChecked) {
                    if (option === currentQuestion.correctAnswer) {
                      optionClasses =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-2 ring-emerald-400';
                    } else if (isSelected && !isCorrect) {
                      optionClasses =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold';
                    } else {
                      optionClasses = 'opacity-50 border-zinc-200 dark:border-zinc-800';
                    }
                  } else if (isSelected) {
                    optionClasses =
                      'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-semibold ring-2 ring-indigo-500';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasChecked}
                      onClick={() => handleSelect(option)}
                      className={`w-full p-4 rounded-2xl border text-left text-sm flex items-center justify-between transition-all duration-200 cursor-pointer ${optionClasses}`}
                    >
                      <span>{option}</span>
                      {hasChecked && option === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {hasChecked && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Topic Complete Victory Screen */
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 mb-4 animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Topic Complete!
              </span>
              <h2 className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50 mt-1">
                {topic.title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md">
                You answered {correctAnswersCount} of {questions.length} quizzes correctly!
              </p>

              {/* Rewards Gained */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-6">
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-center">
                  <p className="text-[10px] uppercase font-bold text-indigo-400">EXP Gained</p>
                  <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">+{topic.expReward}</p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center">
                  <p className="text-[10px] uppercase font-bold text-amber-400">Accuracy</p>
                  <p className="text-lg font-black text-amber-600 dark:text-amber-400">{finalScore}%</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center">
                  <p className="text-[10px] uppercase font-bold text-emerald-400">Pet Snack</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">+1 Apple</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <Apple className="w-4 h-4 text-rose-500" />
                <span>Your Tamagotchi companion has fresh food in its pantry!</span>
              </div>
            </div>
          )}

          {/* Footer Action Strip */}
          <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {!isFinished ? (
              hasChecked ? (
                /* Immediate feedback explanation bar */
                <div
                  className={`p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-sm">{isCorrect ? 'Outstanding!' : 'Incorrect'}</p>
                      <p className="text-xs opacity-90 mt-0.5">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 shadow-md shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <span>{currentIdx + 1 === questions.length ? 'Finish Lesson' : 'Next Quiz'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-end">
                  <button
                    disabled={!selectedOption}
                    onClick={handleCheck}
                    className={`px-8 py-3 rounded-2xl font-bold text-xs transition-all shadow-md ${
                      selectedOption
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    Check Answer
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all"
              >
                Continue Learning Path
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
