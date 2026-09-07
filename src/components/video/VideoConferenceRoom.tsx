import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  MessageSquare,
  PenTool,
  FileText,
  Clock,
  Send,
  Maximize2,
  Sparkles,
  CheckCircle,
  Volume2,
  VolumeX,
  Eraser
} from 'lucide-react';
import { OneOnOneSession } from '../../types';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  session: OneOnOneSession;
  onClose: () => void;
}

export const VideoConferenceRoom: React.FC<Props> = ({ session, onClose }) => {
  const { endVideoCall, user } = useApp();

  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isTutorMuted, setIsTutorMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'whiteboard' | 'notes'>('chat');
  const [callDuration, setCallDuration] = useState<number>(14 * 60 + 22); // 14:22 elapsed

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: session.tutorName, text: 'Hello Alex! Ready to dive into React 19 state architecture today?', time: '14:20' },
    { sender: 'Alex Chen', text: 'Hi Dr. Jenkins! Yes, I have the virtualized list component open.', time: '14:21' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Meeting Notes
  const [sharedNotes, setSharedNotes] = useState<string>(
    `# Session Agenda: React State & Heap Profiling\n1. Review useMemo dependency invalidations\n2. Profile DOM nodes using Chrome DevTools Performance panel\n3. Action items: Refactor heavy tree calculations`
  );

  // Video Ref for User Webcam
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Whiteboard Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#6366f1');

  // Request actual camera stream if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startMedia = async () => {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setMediaStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (err) {
          // Camera permission declined or not present - gracefully fallback to animated simulation avatar
          console.warn('Webcam stream not available; using interactive stream simulation.', err);
        }
      }
    };
    startMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Sync mic/camera track toggles
  useEffect(() => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = isCameraOn;
      });
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = isMicOn;
      });
    }
  }, [isCameraOn, isMicOn, mediaStream]);

  // Call duration counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const newMsg = {
      sender: user.name,
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    // Tutor simulated response after 1.5s
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: session.tutorName,
          text: 'Great point! Let’s test that optimization directly on the live editor.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  // Canvas drawing handlers
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleEndCall = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    endVideoCall();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col text-white">
      {/* Top Session Control Bar */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-950/80 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live 1-on-1</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div>
            <h3 className="text-sm font-bold truncate max-w-[200px] sm:max-w-md">{session.topicTitle}</h3>
            <p className="text-[11px] text-zinc-400">Tutor: {session.tutorName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-zinc-200">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTime(callDuration)}</span>
          </div>

          <button
            onClick={handleEndCall}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Video & Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Video Streams (Tutor Large + Student PIP) */}
        <div className="lg:col-span-8 p-4 flex flex-col justify-between bg-zinc-950 relative">
          <div className="relative w-full h-full rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            {/* Tutor Main Feed */}
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
              <img
                src={session.tutorAvatar}
                alt={session.tutorName}
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

              {/* Tutor Label & Mute status */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-xs font-semibold">
                <span>{session.tutorName} (Tutor)</span>
                {isTutorMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>

              {/* Tutor Audio Mute Toggle */}
              <button
                onClick={() => setIsTutorMuted(!isTutorMuted)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 backdrop-blur-md text-xs font-medium hover:bg-black/80 transition-colors"
                title={isTutorMuted ? 'Unmute Tutor' : 'Mute Tutor'}
              >
                {isTutorMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Student Floating Picture-in-Picture (PIP) */}
            <div className="absolute bottom-4 right-4 w-36 h-28 sm:w-48 sm:h-36 rounded-2xl overflow-hidden border-2 border-zinc-700 bg-zinc-950 shadow-2xl z-20">
              {isCameraOn ? (
                mediaStream ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-950/80 text-center p-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
                      AC
                    </div>
                    <span className="text-[10px] text-indigo-200 mt-1 font-semibold">{user.name}</span>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500">
                  <VideoOff className="w-6 h-6" />
                  <span className="text-[10px] mt-1">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                You
              </div>
            </div>
          </div>

          {/* Video Action Controls Dock */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3.5 rounded-2xl transition-all shadow-md ${
                isMicOn ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3.5 rounded-2xl transition-all shadow-md ${
                isCameraOn ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3.5 rounded-2xl transition-all shadow-md ${
                isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
              title="Share Screen"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleEndCall}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2"
              title="End Meeting"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Call</span>
            </button>
          </div>
        </div>

        {/* Right: In-Call Collaboration Tools (Chat, Whiteboard, Notes) */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-900/90 flex flex-col">
          {/* Tab Selector */}
          <div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Meeting Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('whiteboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'whiteboard'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Whiteboard</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'notes'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Session Notes</span>
            </button>
          </div>

          {/* Tab 1: Live Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-0.5">
                      <span className="font-bold text-zinc-300">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-800 text-xs text-zinc-100 leading-relaxed border border-zinc-700/60">
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Send a message or code link..."
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Collaborative Whiteboard */}
          {activeTab === 'whiteboard' && (
            <div className="flex-1 flex flex-col p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-300">Live Scratchpad</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {['#6366f1', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                      <button
                        key={color}
                        onClick={() => setPenColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-4 h-4 rounded-full transition-transform ${
                          penColor === color ? 'scale-125 ring-2 ring-white' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={clearCanvas}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                    title="Clear Board"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={320}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  className="w-full h-full cursor-crosshair"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Shared Notes */}
          {activeTab === 'notes' && (
            <div className="flex-1 flex flex-col p-4">
              <div className="flex items-center justify-between mb-2 text-xs font-bold text-zinc-300">
                <span>Shared Session Markdown</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Auto-saved
                </span>
              </div>
              <textarea
                value={sharedNotes}
                onChange={e => setSharedNotes(e.target.value)}
                className="flex-1 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 resize-none focus:outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="Type shared lesson notes here..."
              ></textarea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
