import React, { useState } from 'react';
import {
  Flame,
  Coins,
  Heart,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Bell,
  Wifi,
  WifiOff,
  UserCheck,
  GraduationCap,
  Sparkles,
  ChevronDown,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    user,
    tutorUser,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    pet,
    isOffline,
    setIsOffline,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    pushPermission,
    requestPushPermission,
    setIsAuthModalOpen,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Role Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 font-outfit">Lumina</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  LMS MVP
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">Gamified 1-on-1 & Pet Companion</p>
            </div>
          </div>

          {/* Role Switcher Pill */}
          <div className="relative ml-2">
            <button
              id="role-switcher-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 hover:border-indigo-400 text-zinc-800 dark:text-zinc-200 shadow-sm"
              title="Switch user perspective"
            >
              {role === 'student' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-medium">Student:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{user.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium">Tutor:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">Dr. Jenkins</span>
                </>
              )}
              <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
            </button>

            {/* Dropdown to switch view */}
            <AnimatePresence>
              {showRoleMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-2 z-50"
                >
                  <p className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold text-zinc-400">Switch Perspective</p>
                  <button
                    onClick={() => {
                      setRole('student');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                      role === 'student'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                      AC
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 font-normal">Student • Lv.{pet.level} Pet</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setRole('tutor');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors mt-1 ${
                      role === 'tutor'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 font-bold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                      SJ
                    </div>
                    <div>
                      <p className="font-semibold">{tutorUser.name}</p>
                      <p className="text-[10px] text-zinc-400 font-normal">Tutor Dashboard & Analytics</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: Gamification Stats (Visible in student mode) */}
        {role === 'student' && (
          <div className="hidden md:flex items-center gap-3">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 font-bold text-xs shadow-xs"
              title={`${user.streakDays} Day Study Streak`}
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
              <span>{user.streakDays}</span>
              <span className="text-[10px] font-medium text-orange-500/80">days</span>
            </div>

            {/* Coins */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 font-bold text-xs shadow-xs"
              title={`${user.coins} Study Coins earned`}
            >
              <Coins className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{user.coins}</span>
            </div>

            {/* Hearts / Energy */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs shadow-xs"
              title={`${user.hearts} Quiz Hearts remaining`}
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>{user.hearts}/5</span>
            </div>

            {/* Pet Status Chip */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              onClick={() => {
                const el = document.getElementById('pet-companion-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Your Tamagotchi Companion"
            >
              <span className="text-sm">🐾</span>
              <span>{pet.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200/70 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 font-bold">
                Lv.{pet.level}
              </span>
            </div>
          </div>
        )}

        {/* Right: Controls (Offline toggle, notifications, audio, dark mode, social login) */}
        <div className="flex items-center gap-2">
          {/* Offline Mode Indicator / Toggle */}
          <button
            id="offline-toggle-btn"
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              isOffline
                ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400'
            }`}
            title={isOffline ? 'Offline Mode Active: Local storage cached' : 'Online Mode: Synced to Cloud'}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            <span className="hidden sm:inline">{isOffline ? 'Offline Mode' : 'Online'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={toggleSound}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Push Notifications Popover */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Push Notifications & Reminders"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 z-50 text-zinc-900 dark:text-zinc-100"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="font-bold text-sm">Notifications & Reminders</h4>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark read
                      </button>
                    )}
                  </div>

                  {/* Browser push permission prompt if default */}
                  {pushPermission === 'default' && (
                    <div className="my-3 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-2">
                      <p className="text-[11px] text-indigo-900 dark:text-indigo-200">
                        Enable browser push alerts for 1-on-1 session countdowns.
                      </p>
                      <button
                        onClick={requestPushPermission}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 whitespace-nowrap shadow-xs"
                      >
                        Enable
                      </button>
                    </div>
                  )}

                  {/* Notification List */}
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-72 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-zinc-400 py-6 text-center">No notifications right now.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`py-3 px-1 transition-colors cursor-pointer rounded-lg ${
                            !n.read ? 'bg-indigo-50/50 dark:bg-indigo-950/30 font-medium' : 'opacity-80'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{n.title}</p>
                            <span className="text-[10px] text-zinc-400 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Social Login / Account Sync Button */}
          <button
            id="social-login-btn"
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm transition-all"
            title="Social Login & Account Syncing"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span className="hidden sm:inline">Synced</span>
          </button>
        </div>
      </div>
    </header>
  );
};
