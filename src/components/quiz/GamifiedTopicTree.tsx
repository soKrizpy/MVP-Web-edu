import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Check,
  Star,
  Award,
  Download,
  CheckCircle2,
  Play,
  Layers,
  Clock,
  Zap,
  HelpCircle
} from 'lucide-react';
import { CourseModule, Topic } from '../../types';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';

interface Props {
  onSelectTopic: (module: CourseModule, topic: Topic) => void;
  onOpenAssessment: (module: CourseModule) => void;
}

export const GamifiedTopicTree: React.FC<Props> = ({ onSelectTopic, onOpenAssessment }) => {
  const { modules, offlineCachedModules, toggleCacheModule, isOffline } = useApp();
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0]?.id || 'mod-1');

  const activeModule = modules.find(m => m.id === selectedModuleId) || modules[0];
  const isCached = offlineCachedModules.includes(activeModule.id);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Module Selector Ribbon */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {modules.map(mod => {
            const isSelected = mod.id === activeModule.id;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModuleId(mod.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-md'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>{mod.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200/50 dark:bg-zinc-800 font-bold">
                  {mod.progressPercent}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Module Header Card */}
        <div className="mt-4 p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 backdrop-blur-xs">
                  {activeModule.category} • {activeModule.level}
                </span>
                {activeModule.certificateEarned && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                    <Award className="w-3 h-3" /> Certified
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-black font-outfit tracking-tight">{activeModule.title}</h2>
              <p className="text-xs md:text-sm text-indigo-100/90 mt-1 max-w-xl leading-relaxed">
                {activeModule.description}
              </p>
            </div>

            {/* Offline Cache & Progress */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
              <button
                onClick={() => toggleCacheModule(activeModule.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                  isCached
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
                title="Save module & all 5 quizzes per topic locally for offline learning"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isCached ? 'Downloaded Offline' : 'Download Offline'}</span>
              </button>

              <div className="w-full md:w-36">
                <div className="flex justify-between text-[11px] font-medium text-indigo-200 mb-1">
                  <span>Module Mastery</span>
                  <span>{activeModule.progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-500 rounded-full"
                    style={{ width: `${activeModule.progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Topic Learning Path (Duolingo Style Winding Nodes) */}
      <div className="relative w-full max-w-md flex flex-col items-center py-6">
        {/* Curving SVG Background Guide Line */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none stroke-zinc-200 dark:stroke-zinc-800/80 -z-10"
          strokeWidth="6"
          strokeDasharray="8 8"
          fill="none"
        >
          <path
            d="M 224 40 Q 310 130 224 220 T 224 400 T 224 580"
          />
        </svg>

        <div className="space-y-12 w-full flex flex-col items-center">
          {activeModule.topics.map((topic, index) => {
            // Horizontal shift for winding serpentine path effect
            const offsetStyle =
              index % 3 === 0
                ? 'translate-x-0'
                : index % 3 === 1
                ? 'translate-x-12 sm:translate-x-16'
                : '-translate-x-12 sm:-translate-x-16';

            const isNextToLearn = topic.isUnlocked && !topic.isCompleted;

            return (
              <motion.div
                key={topic.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col items-center ${offsetStyle}`}
              >
                {/* Floating "START" or "REVIEW" Duolingo Pill */}
                {isNextToLearn && (
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    className="absolute -top-9 z-20 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-lg shadow-indigo-500/30 flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Next Lesson</span>
                  </motion.div>
                )}

                {/* Main Node Button */}
                <button
                  id={`topic-node-${topic.id}`}
                  disabled={!topic.isUnlocked}
                  onClick={() => onSelectTopic(activeModule, topic)}
                  className={`relative w-20 h-20 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 group shadow-lg ${
                    topic.isCompleted
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-1'
                      : topic.isUnlocked
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 ring-4 ring-indigo-300/40 dark:ring-indigo-700/40'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-none'
                  }`}
                >
                  {/* Topic Icon or Status */}
                  {topic.isCompleted ? (
                    <Check className="w-8 h-8 stroke-[3]" />
                  ) : topic.isUnlocked ? (
                    <Zap className="w-8 h-8 stroke-[2.5]" />
                  ) : (
                    <Lock className="w-7 h-7" />
                  )}

                  {/* Stars Badge for Completed */}
                  {topic.isCompleted && (
                    <div className="absolute -bottom-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-600 shadow-xs">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          className={`w-2.5 h-2.5 ${
                            s <= topic.stars
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-zinc-300 dark:text-zinc-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>

                {/* Topic Metadata Description */}
                <div className="mt-3 text-center max-w-[200px]">
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{topic.title}</p>
                  <div className="flex items-center justify-center gap-2 mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Sparkles className="w-3 h-3" /> +{topic.expReward} EXP
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <HelpCircle className="w-3 h-3" /> 5 Quizzes
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Module Capstone Assessment Node (Unlocks Certificate!) */}
        <div className="mt-16 w-full max-w-sm">
          <motion.div
            whileHover={{ scale: activeModule.assessment.isUnlocked ? 1.02 : 1 }}
            className={`p-6 rounded-3xl border text-center transition-all ${
              activeModule.assessment.isPassed
                ? 'bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-amber-950/20 dark:to-emerald-950/20 border-emerald-400 dark:border-emerald-600 shadow-lg'
                : activeModule.assessment.isUnlocked
                ? 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border-indigo-300 dark:border-indigo-700 shadow-xl'
                : 'bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 opacity-80'
            }`}
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg mb-3">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
              Module Capstone
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2">
              {activeModule.assessment.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Complete all topics above to unlock this comprehensive assessment and earn your verified certificate.
            </p>

            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> {activeModule.assessment.timeLimitMinutes} mins
              </span>
              <span>•</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Pass mark: {activeModule.assessment.passingScore}%
              </span>
            </div>

            <button
              id="unlock-assessment-btn"
              disabled={!activeModule.assessment.isUnlocked}
              onClick={() => onOpenAssessment(activeModule)}
              className={`w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                activeModule.assessment.isPassed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                  : activeModule.assessment.isUnlocked
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
              }`}
            >
              {activeModule.assessment.isPassed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> View Earned Certificate
                </>
              ) : activeModule.assessment.isUnlocked ? (
                <>
                  <Play className="w-4 h-4 fill-current" /> Take Capstone Exam
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Locked (Complete Topics First)
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
