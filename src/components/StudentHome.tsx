import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Video,
  Trophy,
  Award,
  Swords,
  Layers,
  Heart,
  Flame,
  Apple
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CourseModule, Topic, OneOnOneSession } from '../types';
import { GamifiedTopicTree } from './quiz/GamifiedTopicTree';
import { QuizModal } from './quiz/QuizModal';
import { FinalAssessmentModal } from './quiz/FinalAssessmentModal';
import { PetCompanionView } from './pet/PetCompanionView';
import { PetBattleArena } from './pet/PetBattleArena';
import { TutorsDirectoryView } from './tutors/TutorsDirectoryView';
import { VideoConferenceRoom } from './video/VideoConferenceRoom';
import { LeaderboardView } from './leaderboard/LeaderboardView';
import { CertificateView } from './certificates/CertificateView';

export const StudentHome: React.FC = () => {
  const { pet, activeSession, startVideoCall } = useApp();

  const [activeTab, setActiveTab] = useState<'learn' | 'pet' | 'tutors' | 'leaderboard' | 'certificates'>('learn');

  // Modal states
  const [activeTopicQuiz, setActiveTopicQuiz] = useState<{ module: CourseModule; topic: Topic } | null>(null);
  const [activeAssessmentModule, setActiveAssessmentModule] = useState<CourseModule | null>(null);
  const [isBattleArenaOpen, setIsBattleArenaOpen] = useState(false);
  const [activeVideoSession, setActiveVideoSession] = useState<OneOnOneSession | null>(null);

  const handleSelectTopic = (module: CourseModule, topic: Topic) => {
    setActiveTopicQuiz({ module, topic });
  };

  const handleOpenAssessment = (module: CourseModule) => {
    setActiveAssessmentModule(module);
  };

  const handleJoinCall = (session: OneOnOneSession) => {
    setActiveVideoSession(session);
    startVideoCall(session);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 pb-24 transition-colors duration-200">
      {/* Navigation Sub-Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="tab-learn-path"
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'learn'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Learning Path</span>
            </button>

            <button
              id="tab-pet-sanctuary"
              onClick={() => setActiveTab('pet')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'pet'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>🐾</span>
              <span>Tamagotchi Pet</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 font-bold">
                Lv.{pet.level}
              </span>
            </button>

            <button
              id="tab-1on1-tutors"
              onClick={() => setActiveTab('tutors')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'tutors'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>1-on-1 Tutors & Video</span>
            </button>

            <button
              id="tab-leaderboard"
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'leaderboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>

            <button
              id="tab-certificates"
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'certificates'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </button>
          </div>

          {/* Quick Duel Launcher Pill */}
          <button
            onClick={() => setIsBattleArenaOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold hover:bg-rose-600 hover:text-white transition-all shrink-0"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Duel Dummy Pet</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="pt-6">
        {activeTab === 'learn' && (
          <GamifiedTopicTree
            onSelectTopic={handleSelectTopic}
            onOpenAssessment={handleOpenAssessment}
          />
        )}

        {activeTab === 'pet' && (
          <PetCompanionView
            onOpenBattleArena={() => setIsBattleArenaOpen(true)}
          />
        )}

        {activeTab === 'tutors' && (
          <TutorsDirectoryView
            onJoinCall={handleJoinCall}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            onChallengePet={() => setIsBattleArenaOpen(true)}
          />
        )}

        {activeTab === 'certificates' && (
          <CertificateView />
        )}
      </main>

      {/* Quiz Modal (5 quizzes per topic) */}
      {activeTopicQuiz && (
        <QuizModal
          module={activeTopicQuiz.module}
          topic={activeTopicQuiz.topic}
          onClose={() => setActiveTopicQuiz(null)}
        />
      )}

      {/* Final Assessment Modal */}
      {activeAssessmentModule && (
        <FinalAssessmentModal
          module={activeAssessmentModule}
          onClose={() => setActiveAssessmentModule(null)}
          onViewCertificate={() => {
            setActiveAssessmentModule(null);
            setActiveTab('certificates');
          }}
        />
      )}

      {/* Pet Battle Arena (Duel Dummy Pets from other students) */}
      {isBattleArenaOpen && (
        <PetBattleArena
          onClose={() => setIsBattleArenaOpen(false)}
        />
      )}

      {/* 1-on-1 Integrated Video Conference Room */}
      {activeVideoSession && (
        <VideoConferenceRoom
          session={activeVideoSession}
          onClose={() => setActiveVideoSession(null)}
        />
      )}
    </div>
  );
};
