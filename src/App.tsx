import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { StudentHome } from './components/StudentHome';
import { TutorDashboard } from './components/tutor/TutorDashboard';
import { SocialLoginModal } from './components/auth/SocialLoginModal';
import { VideoConferenceRoom } from './components/video/VideoConferenceRoom';

const MainAppContent: React.FC = () => {
  const { user, activeSession, endVideoCall } = useApp();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-200">
      <Navbar />

      {/* Role-based views */}
      {user.role === 'student' ? (
        <StudentHome />
      ) : (
        <main className="pt-6">
          <TutorDashboard />
        </main>
      )}

      {/* Global Modals */}
      <SocialLoginModal />

      {/* Persistent Video Call Overlay if active */}
      {activeSession && (
        <VideoConferenceRoom
          session={activeSession}
          onClose={endVideoCall}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
