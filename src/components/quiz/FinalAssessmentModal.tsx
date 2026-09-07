import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { CourseModule, QuizQuestion } from '../../types';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';

interface Props {
  module: CourseModule;
  onClose: () => void;
  onViewCertificate: () => void;
}

export const FinalAssessmentModal: React.FC<Props> = ({ module, onClose, onViewCertificate }) => {
  const { passAssessment } = useApp();
  const assessment = module.assessment;

  const [currentStep, setCurrentStep] = useState<'intro' | 'exam' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(assessment.timeLimitMinutes * 60);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);
  const [hasPassed, setHasPassed] = useState<boolean>(false);

  // Timer countdown during exam
  useEffect(() => {
    if (currentStep !== 'exam') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep]);

  const questions: QuizQuestion[] = assessment.questions;
  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: option }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setCalculatedScore(score);
    const passed = score >= assessment.passingScore;
    setHasPassed(passed);
    setCurrentStep('result');

    if (passed) {
      passAssessment(module.id, score);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Final Capstone Assessment</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{module.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentStep === 'exam' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">
          {currentStep === 'intro' && (
            <div className="py-4 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-4">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50">
                {assessment.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-lg leading-relaxed">
                {assessment.description}
              </p>

              <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-6">
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Questions</p>
                  <p className="text-lg font-black text-zinc-800 dark:text-zinc-200">{questions.length}</p>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Time Limit</p>
                  <p className="text-lg font-black text-zinc-800 dark:text-zinc-200">{assessment.timeLimitMinutes}m</p>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Passing Grade</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{assessment.passingScore}%</p>
                </div>
              </div>

              <button
                id="start-exam-now-btn"
                onClick={() => setCurrentStep('exam')}
                className="mt-8 px-8 py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentStep === 'exam' && (
            <div>
              {/* Question count */}
              <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2">
                <span>Question {currentIdx + 1} of {questions.length}</span>
                <span>{Object.keys(selectedAnswers).length}/{questions.length} Answered</span>
              </div>

              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                {currentQuestion.question}
              </h4>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentIdx] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full p-4 rounded-2xl border text-left text-sm transition-all duration-150 flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-semibold ring-2 ring-indigo-500'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <span>{option}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-zinc-300 dark:border-zinc-700'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation pagination buttons */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
                >
                  Previous
                </button>

                {currentIdx + 1 < questions.length ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          )}

          {currentStep === 'result' && (
            <div className="py-6 text-center flex flex-col items-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl mb-4 ${
                  hasPassed ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-rose-500 shadow-rose-500/30'
                }`}
              >
                {hasPassed ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>

              <h2 className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50">
                {hasPassed ? 'Congratulations! You Passed!' : 'Assessment Not Passed'}
              </h2>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md">
                {hasPassed
                  ? `You scored ${calculatedScore}%. Your official verified certificate of completion has been minted.`
                  : `You scored ${calculatedScore}%. A passing mark of ${assessment.passingScore}% is required to earn the certificate. You can review the topics and try again!`}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                {hasPassed ? (
                  <button
                    onClick={() => {
                      onClose();
                      onViewCertificate();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                  >
                    <FileCheck className="w-4 h-4" /> View Certificate
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentStep('intro');
                      setSelectedAnswers({});
                    }}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Retake Exam
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl font-semibold text-xs border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Back to Course
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
