import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  BookOpen,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Search,
  ChevronRight,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentAnalytics, CourseModule } from '../../types';

export const TutorDashboard: React.FC = () => {
  const {
    tutorUser,
    modules,
    studentAnalytics,
    addCourseModule,
    requestTutorPayout,
    sessions
  } = useApp();

  const [selectedStudent, setSelectedStudent] = useState<StudentAnalytics | null>(studentAnalytics[0] || null);
  const [searchStudent, setSearchStudent] = useState('');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(tutorUser.availablePayout);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Web Architecture');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  const filteredStudents = studentAnalytics.filter(
    s => s.name.toLowerCase().includes(searchStudent.toLowerCase()) || s.email.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    addCourseModule({
      title: newCourseTitle.trim(),
      category: newCourseCategory,
      level: 'Intermediate',
      description: newCourseDesc || 'Advanced interactive curriculum.',
    });
    setNewCourseTitle('');
    setNewCourseDesc('');
    setIsAddingCourse(false);
  };

  const handlePayoutSubmit = () => {
    if (payoutAmount <= 0 || payoutAmount > tutorUser.availablePayout) return;
    requestTutorPayout(payoutAmount);
    setIsPayoutModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Welcome & Earnings Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={tutorUser.avatar}
              alt={tutorUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-amber-100">
                  Lead Instructor
                </span>
                <span className="text-xs font-bold text-amber-200">★ {tutorUser.rating} Rating</span>
              </div>
              <h2 className="text-2xl font-black font-outfit mt-1">{tutorUser.name}</h2>
              <p className="text-xs text-amber-100/90">{tutorUser.title}</p>
            </div>
          </div>

          {/* Tutor Payout & Earnings Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div>
              <p className="text-[10px] uppercase font-bold text-amber-200">Available for Payout</p>
              <p className="text-2xl font-black">${tutorUser.availablePayout}.00</p>
              <p className="text-[10px] text-amber-200/80">Lifetime: ${tutorUser.totalEarnings}.00</p>
            </div>
            <button
              id="request-payout-btn"
              onClick={() => setIsPayoutModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-amber-900 font-bold text-xs hover:bg-amber-50 shadow-md transition-all whitespace-nowrap"
            >
              Request Payout
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold">Active Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{studentAnalytics.length * 8 + 4}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +18% this month
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold">Avg Quiz Accuracy</span>
            <BarChart3 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">88.4%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Across 5 quizzes/topic</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold">1-on-1 Sessions</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{sessions.length + 18}</p>
          <p className="text-[11px] text-zinc-400 mt-1">${tutorUser.hourlyRate}/hr billing rate</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold">Published Modules</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{modules.length}</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">With Capstone Exams</p>
        </div>
      </div>

      {/* Main Grid: Student Roster Analytics + Course Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Performance Roster (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Individual Student Performance Analytics
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Real-time quiz accuracy, daily streaks, pet levels, and drop-off diagnosis.
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={e => setSearchStudent(e.target.value)}
                  placeholder="Filter student name..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 mt-2">
              {filteredStudents.map(student => (
                <div
                  key={student.studentId}
                  onClick={() => setSelectedStudent(student)}
                  className={`py-3.5 px-2 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    selectedStudent?.studentId === student.studentId
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-850/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                    />
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{student.name}</p>
                      <p className="text-[11px] text-zinc-400">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {student.accuracyRate}% Accuracy
                      </p>
                      <p className="text-[10px] text-zinc-400">{student.totalQuizzesTaken} quizzes taken</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200 dark:border-orange-900">
                        🔥 {student.studyStreakDays}d streak
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deep-Dive Card on Selected Student */}
          {selectedStudent && (
            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedStudent.name} — Detailed Diagnostics
                    </h4>
                    <p className="text-xs text-zinc-500">Last active {selectedStudent.lastActive}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Total EXP: {selectedStudent.totalExp}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Topics Done</span>
                  <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                    {selectedStudent.topicsCompleted}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Quiz Accuracy</span>
                  <p className="text-lg font-black text-emerald-600">
                    {selectedStudent.accuracyRate}%
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Pet Companion</span>
                  <p className="text-lg font-black text-indigo-600">
                    Lv.{selectedStudent.petLevel}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Capstone Grade</span>
                  <p className="text-lg font-black text-amber-600">
                    {selectedStudent.assessmentScore ? `${selectedStudent.assessmentScore}%` : 'Pending'}
                  </p>
                </div>
              </div>

              {/* Weak Topics Analysis for 1-on-1 prep */}
              <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Target Focus for Next 1-on-1 Session:</span>
                </p>
                {selectedStudent.weakTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.weakTopics.map((wt, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium"
                      >
                        {wt}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> High mastery across all current modules!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Course Curriculum Management (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Course Curriculum</h3>
                <p className="text-[11px] text-zinc-400">Manage modules and quiz banks</p>
              </div>
              <button
                onClick={() => setIsAddingCourse(true)}
                className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                title="Create New Module"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {modules.map(mod => (
                <div
                  key={mod.id}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                      {mod.category}
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      {mod.topics.length} Topics (5 Quizzes each)
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1.5">{mod.title}</h4>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{mod.description}</p>
                </div>
              ))}
            </div>

            {/* Create New Course Form Drawer */}
            {isAddingCourse && (
              <form onSubmit={handleCreateCourse} className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Publish New Course</h4>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={newCourseTitle}
                    onChange={e => setNewCourseTitle(e.target.value)}
                    placeholder="e.g. Next.js 15 App Architecture"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={newCourseCategory}
                    onChange={e => setNewCourseCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Description</label>
                  <textarea
                    value={newCourseDesc}
                    onChange={e => setNewCourseDesc(e.target.value)}
                    placeholder="Course objectives..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs resize-none"
                    rows={2}
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    Publish Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCourse(false)}
                    className="py-2 px-3 rounded-xl border text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Payout Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Request Tutor Payout</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Transfer your earned 1-on-1 tutoring funds to your linked Stripe account.
            </p>

            <div className="my-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Available Balance</span>
              <p className="text-2xl font-black text-emerald-600">${tutorUser.availablePayout}.00</p>
            </div>

            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Payout Amount ($)
            </label>
            <input
              type="number"
              max={tutorUser.availablePayout}
              min={10}
              value={payoutAmount}
              onChange={e => setPayoutAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100"
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={handlePayoutSubmit}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Confirm Transfer
              </button>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
