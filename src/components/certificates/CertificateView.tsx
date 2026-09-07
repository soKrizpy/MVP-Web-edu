import React, { useState } from 'react';
import {
  Award,
  Download,
  Share2,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Printer,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Certificate } from '../../types';

export const CertificateView: React.FC = () => {
  const { certificates, user } = useApp();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(certificates[0] || null);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50">
              Verified Certificates of Completion
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Official verifiable credentials issued upon completing all topics and passing capstone assessments.
          </p>
        </div>

        {selectedCert && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Credential'}</span>
            </button>
          </div>
        )}
      </div>

      {certificates.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <Award className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No Certificates Earned Yet</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
            Complete all 5 quizzes across the topics of a module to unlock the Capstone Exam. Score 80%+ to generate your official credential!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Certificate Selector Sidebar if multiple */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Earned Credentials</p>
            {certificates.map(cert => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedCert?.id === cert.id
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-400/50'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{cert.moduleTitle}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Issued: {cert.issueDate}</p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      Grade: {cert.score}% • Verified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Visual Certificate Rendering Document */}
          {selectedCert && (
            <div className="lg:col-span-8">
              <div
                id="printable-certificate"
                className="relative rounded-3xl border-8 border-amber-500/20 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 p-8 sm:p-12 shadow-2xl text-center overflow-hidden"
              >
                {/* Guilloche border watermark decor */}
                <div className="absolute inset-2 border-2 border-dashed border-amber-400/40 rounded-2xl pointer-events-none"></div>
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>

                {/* Seal Icon */}
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 mb-4">
                  <Award className="w-9 h-9" />
                </div>

                <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Certificate of Technical Mastery
                </p>

                <h1 className="text-2xl sm:text-3xl font-black font-outfit text-zinc-900 dark:text-zinc-50 mt-2">
                  Lumina Academy of Engineering
                </h1>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">
                  This official document certifies that
                </p>

                <div className="my-3 py-1 border-b-2 border-zinc-900 dark:border-zinc-100 inline-block px-8">
                  <h2 className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-outfit">
                    {selectedCert.studentName}
                  </h2>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed mt-2">
                  has successfully passed the comprehensive capstone assessment with a score of{' '}
                  <strong className="text-zinc-900 dark:text-zinc-100">{selectedCert.score}%</strong>, demonstrating professional competency in:
                </p>

                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 mt-2">
                  {selectedCert.moduleTitle}
                </h3>

                {/* Skills Chips */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                  {selectedCert.skills.map(s => (
                    <span
                      key={s}
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Signatures & Verification Stamp */}
                <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-4 items-end text-left">
                  <div>
                    <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">{selectedCert.tutorName}</p>
                    <p className="text-[10px] text-zinc-400">Chief Supervising Tutor</p>
                  </div>

                  <div className="text-center hidden sm:block">
                    <div className="w-12 h-12 mx-auto rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                      Cryptographically Verified
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-mono text-zinc-500">Credential ID:</p>
                    <p className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedCert.id}
                    </p>
                    <p className="text-[10px] text-zinc-400">{selectedCert.issueDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
