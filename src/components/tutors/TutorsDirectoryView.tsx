import React, { useState } from 'react';
import {
  Video,
  Star,
  Clock,
  Calendar,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Tutor, OneOnOneSession } from '../../types';
import { MOCK_TUTORS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { TutorBookingModal } from './TutorBookingModal';

interface Props {
  onJoinCall: (session: OneOnOneSession) => void;
}

export const TutorsDirectoryView: React.FC<Props> = ({ onJoinCall }) => {
  const { sessions } = useApp();
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tutors' | 'my_sessions'>('my_sessions');

  const filteredTutors = MOCK_TUTORS.filter(
    t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50">
              1-on-1 Expert Mentorship & Video
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Book live private coding sessions with integrated video, live whiteboard, and secure payments.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 self-start">
          <button
            onClick={() => setActiveTab('my_sessions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my_sessions'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            My Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('tutors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tutors'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Find a Tutor
          </button>
        </div>
      </div>

      {/* Tab 1: My Booked Sessions */}
      {activeTab === 'my_sessions' && (
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <Video className="w-12 h-12 text-zinc-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No scheduled sessions yet</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Browse our verified industry tutors and schedule your first 1-on-1 video session.
              </p>
              <button
                onClick={() => setActiveTab('tutors')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Find a Tutor Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.map(sess => (
                <div
                  key={sess.id}
                  className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={sess.tutorAvatar}
                          alt={sess.tutorName}
                          className="w-12 h-12 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-700"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{sess.tutorName}</h4>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{sess.tutorTitle}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          sess.status === 'upcoming'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {sess.status}
                      </span>
                    </div>

                    <div className="mt-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{sess.topicTitle}</p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {sess.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" /> {sess.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-zinc-400">Paid: ${sess.paidAmount}.00</span>
                    <button
                      onClick={() => onJoinCall(sess)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Enter Video Room</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Directory of Tutors */}
      {activeTab === 'tutors' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by tutor name, React, TypeScript, Node.js..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tutors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTutors.map(tutor => (
              <div
                key={tutor.id}
                className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-700 shadow-xs"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{tutor.name}</h3>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{tutor.title}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{tutor.rating}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">({tutor.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-4 line-clamp-3 leading-relaxed">
                    {tutor.bio}
                  </p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {tutor.specialties.map(spec => (
                      <span
                        key={spec}
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-zinc-900 dark:text-zinc-100">${tutor.hourlyRate}</span>
                    <span className="text-[11px] text-zinc-500"> / hr</span>
                  </div>
                  <button
                    onClick={() => setSelectedTutor(tutor)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1"
                  >
                    <span>Book Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Checkout Modal */}
      {selectedTutor && (
        <TutorBookingModal
          tutor={selectedTutor}
          onClose={() => setSelectedTutor(null)}
          onBookingSuccess={() => {
            setSelectedTutor(null);
            setActiveTab('my_sessions');
          }}
        />
      )}
    </div>
  );
};
