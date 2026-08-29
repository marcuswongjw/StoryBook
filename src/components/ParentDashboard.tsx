import React, { useState, useEffect } from 'react';
import { SessionTelemetry } from '../types';
import { generateParentMarkdownReport, loadSessions, updateOrAddTelemetrySession, deleteSession } from '../services/storage';
import { INITIAL_PASSAGES } from '../data/passages';
import {
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertCircle,
  FileText,
  Download,
  Copy,
  Check,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  MessageSquare,
  Anchor,
  RotateCw,
  Trash2
} from 'lucide-react';

interface ParentDashboardProps {
  sessions?: SessionTelemetry[];
  onBackToReader: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onBackToReader,
}) => {
  const [sessions, setSessions] = useState<SessionTelemetry[]>(loadSessions());
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync fresh sessions from storage on mount
  useEffect(() => {
    const fresh = loadSessions();
    setSessions(fresh);
    if (fresh.length > 0 && !selectedSessionId) {
      setSelectedSessionId(fresh[0].sessionId);
    }
  }, []);

  const refreshTelemetry = () => {
    const fresh = loadSessions();
    setSessions(fresh);
    if (fresh.length > 0) {
      setSelectedSessionId((prev) => (prev && fresh.some(s => s.sessionId === prev) ? prev : fresh[0].sessionId));
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    const fresh = loadSessions();
    setSessions(fresh);
    if (selectedSessionId === id) {
      setSelectedSessionId(fresh[0]?.sessionId || null);
    }
  };

  const handleCreateSampleSession = () => {
    const samplePassage = INITIAL_PASSAGES[0];
    const sample = updateOrAddTelemetrySession(
      'sample-' + Date.now(),
      samplePassage,
      320,
      142,
      [
        {
          id: 'st-sample-1',
          timestamp: Date.now() - 100000,
          sentenceId: 'sq-2',
          sentenceText: 'Mikaela leaned her entire body out over the windward gunwale to keep the small dinghy flat and fast.',
          targetWord: 'gunwale',
          stumbleType: 'hesitation',
          durationSeconds: 4.2,
          resolvedWithReRead: true,
        },
        {
          id: 'st-sample-2',
          timestamp: Date.now() - 60000,
          sentenceId: 'sq-5',
          sentenceText: '“Ready about!” she yelled to her crewmate, carving the bow through the wind in a crisp, sharp tack.',
          targetWord: 'tack',
          stumbleType: 'mispronunciation',
          durationSeconds: 3.1,
          resolvedWithReRead: true,
        }
      ],
      [
        {
          id: 'turn-sample-1',
          promptId: 'sq-debrief-1',
          category: 'Tactical Regatta Decision',
          question: 'Why is hiking out hard over the gunwale much safer than easing the sail and letting the boat slow down in a Sumatra squall?',
          studentResponse: 'Because if you slow down you lose rudder control and the waves can flip you over sideways.',
          mentorFeedback: 'Outstanding tactical analysis, Mikaela! By holding forward momentum, you keep water flowing over the centerboard and rudder.',
          timestamp: Date.now() - 30000,
        }
      ],
      true
    );

    const fresh = loadSessions();
    setSessions(fresh);
    setSelectedSessionId(sample.sessionId);
  };

  const selectedSession = sessions.find((s) => s.sessionId === selectedSessionId) || sessions[0];

  const totalSessions = sessions.length;
  const avgWpm = totalSessions > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.effectiveWpm, 0) / totalSessions)
    : 0;
  const avgFluency = totalSessions > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.smoothnessScore, 0) / totalSessions)
    : 0;
  const totalStumbles = sessions.reduce((acc, s) => acc + s.stumbles.length, 0);

  const handleCopyReport = () => {
    if (!selectedSession) return;
    const md = generateParentMarkdownReport(selectedSession);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!selectedSession) return;
    const md = generateParentMarkdownReport(selectedSession);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mikaela_Reading_Report_${new Date(selectedSession.timestamp).toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storybook_mikaela_telemetry_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-compass-slate/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass-500/20 text-brass-300 border border-brass-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-brass-400" />
            Private Parent Diagnostic Telemetry Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            Mikaela's Fluency & Comprehension Log
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Background diagnostics tracking vocabulary bottlenecks, pronunciation stumbles, and conversational talking points.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshTelemetry}
            className="px-3 py-2 rounded-xl bg-compass-dark hover:bg-compass-slate/40 text-slate-300 border border-compass-slate/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Reload latest sessions from storage"
          >
            <RotateCw className="w-3.5 h-3.5 text-compass-teal" />
            <span>Refresh Log</span>
          </button>

          <button
            onClick={onBackToReader}
            className="px-4 py-2 rounded-xl bg-compass-teal hover:bg-compass-glow text-compass-dark font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Return to Reading Deck</span>
          </button>
        </div>
      </div>

      {/* Aggregate Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-compass-navy/80 border border-compass-slate/40 rounded-2xl p-5 space-y-1 shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-compass-teal" />
            Total Sessions
          </div>
          <div className="text-3xl font-black text-white font-sans">{totalSessions}</div>
          <div className="text-[11px] text-slate-400">Recorded reading sessions</div>
        </div>

        <div className="bg-compass-navy/80 border border-compass-slate/40 rounded-2xl p-5 space-y-1 shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-compass-glow" />
            Avg. Expressive WPM
          </div>
          <div className="text-3xl font-black text-compass-glow font-mono">
            {avgWpm || '--'} <span className="text-sm font-sans font-normal text-slate-400">wpm</span>
          </div>
          <div className="text-[11px] text-slate-400">Target: 110–135 WPM (Grade 6)</div>
        </div>

        <div className="bg-compass-navy/80 border border-compass-slate/40 rounded-2xl p-5 space-y-1 shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-brass-400" />
            Fluency Score
          </div>
          <div className="text-3xl font-black text-brass-400 font-mono">
            {avgFluency || '--'}%
          </div>
          <div className="text-[11px] text-slate-400">Cadence and re-read smoothness</div>
        </div>

        <div className="bg-compass-navy/80 border border-compass-slate/40 rounded-2xl p-5 space-y-1 shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Anchor className="w-3.5 h-3.5 text-rose-400" />
            Stumbles Unpacked
          </div>
          <div className="text-3xl font-black text-rose-300 font-sans">{totalStumbles}</div>
          <div className="text-[11px] text-slate-400">Resolved via instant fluency loop</div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-compass-navy/60 border border-dashed border-compass-slate/50 rounded-3xl p-10 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-compass-slate/30 flex items-center justify-center text-slate-400 mx-auto">
            <FileText className="w-8 h-8 text-compass-teal" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white font-sans">No Reading Sessions Recorded Yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              As soon as Mikaela reads a passage on the Reading Deck, every word read, hesitation, unpacked stumble, and debrief response will automatically appear here in real time.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onBackToReader}
              className="px-6 py-3 rounded-xl bg-compass-teal text-compass-dark font-bold text-sm shadow-lg shadow-compass-teal/20"
            >
              Start Reading on Deck
            </button>
            <button
              onClick={handleCreateSampleSession}
              className="px-5 py-3 rounded-xl bg-compass-dark hover:bg-compass-slate/40 text-compass-glow border border-compass-teal/40 font-semibold text-sm transition-all"
            >
              + Generate Sample Diagnostic Report
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Session History List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-compass-teal" />
                <span>Logged Sessions ({sessions.length})</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="text-xs text-slate-400 hover:text-compass-teal font-mono flex items-center gap-1"
                  title="Download complete telemetry JSON"
                >
                  <Download className="w-3 h-3" />
                  <span>JSON</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {sessions.map((session) => {
                const isSelected = session.sessionId === selectedSession?.sessionId;
                const date = new Date(session.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={session.sessionId}
                    onClick={() => setSelectedSessionId(session.sessionId)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative group ${
                      isSelected
                        ? 'bg-compass-navy border-compass-teal shadow-lg shadow-compass-teal/10 ring-1 ring-compass-teal'
                        : 'bg-compass-dark/70 border-compass-slate/40 hover:bg-compass-navy/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-400">{date}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            session.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : 'bg-compass-slate/40 text-compass-glow'
                          }`}
                        >
                          {session.status === 'completed' ? 'Completed' : 'Logged'}
                        </span>
                        <button
                          onClick={(e) => handleDeleteSession(session.sessionId, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity"
                          title="Delete this session record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm font-bold text-white font-sans line-clamp-1">
                      {session.passageTitle}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 font-mono pt-1 border-t border-compass-slate/30">
                      <span>{session.effectiveWpm} WPM</span>
                      <span className="text-brass-400 font-semibold">{session.smoothnessScore}% Flow</span>
                      <span className="text-rose-400">{session.stumbles.length} Stumbles</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Diagnostic Inspector */}
          {selectedSession && (
            <div className="lg:col-span-2 space-y-6">
              {/* Session Header Card */}
              <div className="bg-compass-navy border border-compass-teal/30 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-compass-slate/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-compass-teal uppercase tracking-wider">
                        {selectedSession.passageCategory === 'singapore' ? '🇸🇬 Singapore' : selectedSession.passageCategory} Expedition Log
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {selectedSession.status === 'completed' ? 'Completed' : 'Live Recorded'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white font-sans mt-0.5">
                      {selectedSession.passageTitle}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Recorded:{' '}
                      {new Date(selectedSession.timestamp).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyReport}
                      className="px-3 py-2 rounded-xl bg-compass-dark hover:bg-compass-slate/40 text-slate-200 border border-compass-slate/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied MD' : 'Copy MD'}</span>
                    </button>
                    <button
                      onClick={handleDownloadReport}
                      className="px-3 py-2 rounded-xl bg-compass-teal hover:bg-compass-glow text-compass-dark text-xs font-extrabold flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Report</span>
                    </button>
                  </div>
                </div>

                {/* Session Diagnostic Snapshot */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-compass-dark/70 rounded-xl p-3 border border-compass-slate/40 text-center">
                    <div className="text-[11px] text-slate-400">Words Read</div>
                    <div className="text-lg font-bold text-white font-mono mt-0.5">
                      {selectedSession.wordsRead}
                    </div>
                  </div>
                  <div className="bg-compass-dark/70 rounded-xl p-3 border border-compass-slate/40 text-center">
                    <div className="text-[11px] text-slate-400">Pacing Speed</div>
                    <div className="text-lg font-bold text-compass-glow font-mono mt-0.5">
                      {selectedSession.effectiveWpm} WPM
                    </div>
                  </div>
                  <div className="bg-compass-dark/70 rounded-xl p-3 border border-compass-slate/40 text-center">
                    <div className="text-[11px] text-slate-400">Fluency Score</div>
                    <div className="text-lg font-bold text-brass-400 font-mono mt-0.5">
                      {selectedSession.smoothnessScore}%
                    </div>
                  </div>
                  <div className="bg-compass-dark/70 rounded-xl p-3 border border-compass-slate/40 text-center">
                    <div className="text-[11px] text-slate-400">Duration</div>
                    <div className="text-lg font-bold text-slate-200 font-mono mt-0.5">
                      {Math.max(1, Math.round(selectedSession.durationSeconds / 60))} min
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. VOCABULARY BOTTLENECKS & STUMBLES */}
              <div className="bg-compass-navy border border-compass-slate/40 rounded-3xl p-6 space-y-4 shadow-xl">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>1. Vocabulary Bottlenecks & Pronunciation Stumbles ({selectedSession.stumbles.length})</span>
                </h4>

                {selectedSession.stumbles.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm">
                    ✨ Flawless reading delivery! Mikaela smoothly navigated every vocabulary word in this passage without hesitations.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedSession.stumbles.map((stumble, idx) => (
                      <div
                        key={stumble.id || idx}
                        className="bg-compass-dark/90 rounded-2xl p-4 border border-compass-slate/50 space-y-2"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-compass-glow font-sans">
                              {stumble.targetWord || 'Sentence Stumble'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {stumble.stumbleType.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-400">
                            Hesitation: {stumble.durationSeconds}s
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 font-serif italic bg-compass-navy/50 p-2.5 rounded-lg border border-compass-slate/40">
                          “{stumble.sentenceText}”
                        </p>

                        <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{stumble.resolvedWithReRead ? 'Resolved with smooth full-sentence re-read' : 'Logged for follow-up'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. DINNER TABLE & CAR RIDE COACHING SPARKS (FOR DAD) */}
              <div className="bg-gradient-to-br from-brass-950/50 via-compass-navy to-slate-900 border-2 border-brass-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brass-400" />
                  <h4 className="text-sm font-bold text-brass-300 uppercase tracking-wider font-sans">
                    2. Natural Dinner-Table & Car-Ride Sparks (For Dad)
                  </h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Reinforce tonight’s vocabulary and tactical reasoning in a casual, fun way without feeling like a school test:
                </p>

                <div className="bg-compass-dark/95 border border-brass-400/40 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-brass-400 uppercase tracking-wider">
                    Conversational Opener:
                  </div>
                  <p className="text-white text-sm sm:text-base font-serif italic">
                    “{selectedSession.parentInsights.dinnerTablePrompt}”
                  </p>
                </div>

                <div className="text-xs text-slate-300 bg-compass-navy/60 p-3 rounded-xl border border-compass-slate/40 space-y-1">
                  <div className="font-bold text-compass-teal uppercase tracking-wider text-[10px]">
                    Tactical Concept To Reinforce:
                  </div>
                  <div>{selectedSession.parentInsights.tacticalTakeaway}</div>
                </div>
              </div>

              {/* 3. TWO-WAY TACTICAL DEBRIEF TRANSCRIPT */}
              <div className="bg-compass-navy border border-compass-slate/40 rounded-3xl p-6 space-y-4 shadow-xl">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-compass-teal" />
                  <span>3. Conversational Debrief Log ({selectedSession.debriefTurns.length} Exchanges)</span>
                </h4>

                {selectedSession.debriefTurns.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No debrief exchanges recorded yet for this session.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedSession.debriefTurns.map((turn, idx) => (
                      <div
                        key={turn.id || idx}
                        className="bg-compass-dark/90 rounded-2xl p-5 border border-compass-slate/50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-compass-teal/20 text-compass-glow border border-compass-teal/30">
                            {turn.category}
                          </span>
                        </div>

                        <div className="text-sm font-bold text-white font-sans">
                          Prompt: “{turn.question}”
                        </div>

                        <div className="bg-compass-navy/70 rounded-xl p-3 border-l-4 border-compass-teal space-y-1">
                          <div className="text-[11px] font-bold text-compass-teal uppercase tracking-wider">
                            Mikaela’s Spoken Reasoning:
                          </div>
                          <p className="text-slate-100 text-xs sm:text-sm font-serif italic">
                            “{turn.studentResponse}”
                          </p>
                        </div>

                        <div className="bg-compass-slate/20 rounded-xl p-3 border-l-4 border-brass-400 space-y-1">
                          <div className="text-[11px] font-bold text-brass-300 uppercase tracking-wider">
                            Co-Skipper Feedback:
                          </div>
                          <p className="text-slate-300 text-xs sm:text-sm">
                            {turn.mentorFeedback}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
