import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Lock,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { Tutor } from '../../types';
import { useApp } from '../../context/AppContext';
import { soundFX } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface Props {
  tutor: Tutor;
  onClose: () => void;
  onBookingSuccess: () => void;
}

export const TutorBookingModal: React.FC<Props> = ({ tutor, onClose, onBookingSuccess }) => {
  const { bookSession } = useApp();

  const [selectedDay, setSelectedDay] = useState<string>(tutor.availableDays[0] || 'Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState<string>(tutor.timeSlots[0] || '10:00 AM');
  const [topicFocus, setTopicFocus] = useState<string>('React Concurrent State & Performance Profiling');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Checkout flow state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [transactionReceipt, setTransactionReceipt] = useState<{
    id: string;
    amount: number;
    date: string;
  } | null>(null);

  const handlePayAndBook = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const session = bookSession({
        tutorId: tutor.id,
        date: selectedDay === 'Tomorrow' ? 'Tomorrow' : `This ${selectedDay}`,
        time: selectedSlot,
        topicTitle: topicFocus,
        paymentMethod: paymentMethod === 'card' ? 'Visa •••• 4242' : paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay',
        hourlyRate: tutor.hourlyRate,
      });

      setTransactionReceipt({
        id: session.transactionId,
        amount: session.paidAmount,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });

      setIsConfirmed(true);
      soundFX.playCorrect();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-10 h-10 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{tutor.name}</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{tutor.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isConfirmed ? (
            <div className="space-y-5">
              {/* Tutor summary */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{tutor.rating}</span>
                  </div>
                  <span className="text-xs text-zinc-400">({tutor.reviewCount} sessions)</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">${tutor.hourlyRate}</span>
                  <span className="text-xs text-zinc-500"> / hour</span>
                </div>
              </div>

              {/* Day & Slot Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Select Day
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {tutor.availableDays.map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        selectedDay === day
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Select Time Slot (1 Hour Session)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {tutor.timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        selectedSlot === slot
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                      }`}
                    >
                      <Clock className="w-3 h-3 opacity-80" />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Focus */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Lesson Objective & Focus
                </label>
                <input
                  type="text"
                  value={topicFocus}
                  onChange={e => setTopicFocus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Code review on React hooks"
                />
              </div>

              {/* Secure Payment Processing Method */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Secure Payment Processing
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">256-bit Encrypted</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'apple_pay'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span> Apple Pay</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'google_pay'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span>G Pay</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        Card Number (Test Simulation)
                      </span>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Expires</span>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">CVC</span>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Total & Guarantee */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Total Billed</p>
                  <p className="text-[11px] text-zinc-500">100% money-back satisfaction guarantee</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                    ${tutor.hourlyRate}.00
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Booking Confirmed Victory Screen */
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mb-4 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Payment Authorized & Confirmed
              </span>
              <h2 className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50 mt-1">
                1-on-1 Session Scheduled!
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                Your video conference room with {tutor.name} has been generated.
              </p>

              {/* Transaction Receipt Card */}
              {transactionReceipt && (
                <div className="mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 w-full max-w-sm text-left text-xs font-mono">
                  <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-700 font-bold text-zinc-800 dark:text-zinc-200">
                    <Receipt className="w-4 h-4 text-indigo-500" />
                    <span>Transaction Receipt</span>
                  </div>
                  <div className="mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{transactionReceipt.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Paid:</span>
                      <span className="font-bold text-emerald-600">${transactionReceipt.amount}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{transactionReceipt.date}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          {!isConfirmed ? (
            <button
              id="confirm-pay-session-btn"
              disabled={isProcessing}
              onClick={handlePayAndBook}
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authorizing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ${tutor.hourlyRate} & Book 1-on-1 Session</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onBookingSuccess();
              }}
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
            >
              Go to My Scheduled Sessions
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
