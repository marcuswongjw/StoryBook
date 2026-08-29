import React, { useState, useEffect, useRef } from 'react';
import { Passage, DebriefPrompt, DebriefTurn, ReadingStumble, SessionTelemetry, TutorSettings } from '../types';
import { mentorVoice } from '../services/speechSynthesis';
import { soundEngine } from '../services/soundEffects';
import { voiceListener, SpeechRecognitionResultPayload } from '../services/speechRecognition';
import { saveSession, updateOrAddTelemetrySession } from '../services/storage';
import { AudioWaveform } from './AudioWaveform';
import {
  Compass,
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Volume2,
  CheckCircle2,
  Award,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TacticalDebriefProps {
  passage: Passage;
  stumbles: ReadingStumble[];
  durationSeconds: number;
  totalWords: number;
  settings: TutorSettings;
  onFinishDebrief: (session: SessionTelemetry) => void;
}

export const TacticalDebrief: React.FC<TacticalDebriefProps> = ({
  passage,
  stumbles,
  durationSeconds,
  totalWords,
  settings,
  onFinishDebrief,
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [studentInput, setStudentInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMentorSpeaking, setIsMentorSpeaking] = useState(false);
  const [completedTurns, setCompletedTurns] = useState<DebriefTurn[]>([]);
  const [isDebriefFinished, setIsDebriefFinished] = useState(false);
  const sessionIdRef = useRef<string>('session-' + Date.now());

  const currentPrompt: DebriefPrompt = passage.debriefPrompts[currentPromptIndex];

  const minutes = Math.max(0.1, durationSeconds / 60);
  const effectiveWpm = Math.round(totalWords / minutes);
  const stumblePenalty = Math.min(40, stumbles.length * 8);
  const smoothnessScore = Math.max(60, 100 - stumblePenalty);

  // Auto-save on debrief entry
  useEffect(() => {
    updateOrAddTelemetrySession(
      sessionIdRef.current,
      passage,
      durationSeconds,
      totalWords,
      stumbles,
      completedTurns,
      false
    );

    soundEngine.playShipsBell();
    if (currentPrompt) {
      speakMentorPrompt(currentPrompt);
    }

    return () => {
      mentorVoice.stop();
      voiceListener.stop();
    };
  }, [currentPromptIndex]);

  const speakMentorPrompt = (prompt: DebriefPrompt) => {
    setIsMentorSpeaking(true);
    const textToSpeak = `Mission accomplished on the reading deck! Let's debrief the tactics. ${prompt.question}`;
    mentorVoice.speak(textToSpeak, {
      rate: settings.voiceSpeed,
      pitch: settings.voicePitch,
      onEnd: () => setIsMentorSpeaking(false),
    });
  };

  const handleStartListening = () => {
    if (isListening) {
      voiceListener.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    voiceListener.setCallbacks((result: SpeechRecognitionResultPayload) => {
      setStudentInput(result.transcript);
    });
    voiceListener.start();
  };

  const generateMentorFeedback = (input: string, prompt: DebriefPrompt): string => {
    const preview = input.length > 20 ? `When you noted how "${input.slice(0, 45)}...", ` : '';

    if (prompt.category === 'tactical_decision') {
      return `${preview}Outstanding tactical analysis, Mikaela! You recognized that hesitation in heavy seas causes the boat to broach. Elite skippers always choose forward momentum over drift.`;
    } else if (prompt.category === 'character_motive') {
      return `${preview}Spot-on evaluation of leadership psychology. Keeping composure and relying on deep instrument readings prevents panic from spreading to the crew. You thought like a true expedition commander!`;
    } else if (prompt.category === 'strategic_prediction') {
      return `${preview}Sharp tactical foresight! Anticipating shifting tides and night navigation hurdles allows the team to prepare their safety gear well before the storm front hits. Excellent strategic vision.`;
    } else {
      return `${preview}Great tactical insight! Analyzing environmental risk factors with precision is what separates good sailors from great skippers.`;
    }
  };

  const handleSubmitResponse = () => {
    if (!studentInput.trim()) return;

    if (isListening) {
      voiceListener.stop();
      setIsListening(false);
    }

    const mentorFeedback = generateMentorFeedback(studentInput, currentPrompt);

    const newTurn: DebriefTurn = {
      id: 'turn-' + Date.now(),
      promptId: currentPrompt.id,
      category: currentPrompt.categoryLabel,
      question: currentPrompt.question,
      studentResponse: studentInput,
      mentorFeedback,
      timestamp: Date.now(),
    };

    const updatedTurns = [...completedTurns, newTurn];
    setCompletedTurns(updatedTurns);
    setStudentInput('');

    // Persist turn immediately
    updateOrAddTelemetrySession(
      sessionIdRef.current,
      passage,
      durationSeconds,
      totalWords,
      stumbles,
      updatedTurns,
      currentPromptIndex + 1 >= passage.debriefPrompts.length
    );

    setIsMentorSpeaking(true);
    soundEngine.playSuccessChime();
    mentorVoice.speak(mentorFeedback, {
      rate: settings.voiceSpeed,
      pitch: settings.voicePitch,
      onEnd: () => {
        setIsMentorSpeaking(false);
        if (currentPromptIndex + 1 < passage.debriefPrompts.length) {
          setCurrentPromptIndex((prev) => prev + 1);
        } else {
          handleFinishAllDebrief(updatedTurns);
        }
      },
    });
  };

  const handleFinishAllDebrief = (finalTurns: DebriefTurn[]) => {
    setIsDebriefFinished(true);
    soundEngine.playShipsBell();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#5BC0BE', '#6FFFE9', '#fbbf24', '#0ea5e9', '#10b981'],
    });

    const session = updateOrAddTelemetrySession(
      sessionIdRef.current,
      passage,
      durationSeconds,
      totalWords,
      stumbles,
      finalTurns,
      true
    );

    saveSession(session);
  };

  const handleWrapUp = () => {
    const finalSession = updateOrAddTelemetrySession(
      sessionIdRef.current,
      passage,
      durationSeconds,
      totalWords,
      stumbles,
      completedTurns,
      true
    );
    onFinishDebrief(finalSession);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Debrief Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-compass-navy via-slate-900 to-compass-dark border-2 border-compass-teal/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brass-500/20 text-brass-300 border border-brass-500/30 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              Two-Way Tactical Debrief (Zero Multiple Choice)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              Post-Mission Co-Skipper Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Debrief the tactical choices, evaluate character psychology, and forecast what's next.
            </p>
          </div>

          <div className="bg-compass-dark/80 px-4 py-2.5 rounded-2xl border border-compass-slate/40 flex items-center gap-3">
            <Award className="w-6 h-6 text-brass-400" />
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Fluency Rating</div>
              <div className="text-base font-bold text-compass-glow font-mono">
                {smoothnessScore}% • {effectiveWpm} WPM
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isDebriefFinished ? (
        <div className="bg-compass-navy/90 border border-compass-teal/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="bg-compass-dark/95 border-2 border-compass-teal/40 rounded-2xl p-6 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-compass-teal/20 text-compass-glow border border-compass-teal/30 text-xs font-bold uppercase tracking-wider">
                {currentPrompt.categoryLabel}
              </span>
              <button
                onClick={() => speakMentorPrompt(currentPrompt)}
                disabled={isMentorSpeaking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-compass-slate/40 hover:bg-compass-slate/60 text-slate-200 text-xs font-medium border border-compass-slate/40 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5 text-brass-400" />
                <span>{isMentorSpeaking ? 'Speaking...' : 'Replay Coach Voice'}</span>
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white font-sans leading-snug">
              “{currentPrompt.question}”
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 italic">
              Expedition Context: {currentPrompt.mentorContext}
            </p>
          </div>

          {/* Previous Completed Turns */}
          {completedTurns.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Previous Discussion Points:
              </div>
              {completedTurns.map((turn) => (
                <div
                  key={turn.id}
                  className="bg-compass-dark/60 rounded-xl p-4 border border-compass-slate/40 space-y-2 text-xs sm:text-sm"
                >
                  <div className="text-compass-teal font-bold font-sans">
                    Q: {turn.question}
                  </div>
                  <div className="text-slate-200 pl-3 border-l-2 border-compass-teal/40 italic">
                    Mikaela: “{turn.studentResponse}”
                  </div>
                  <div className="text-brass-300 pl-3 border-l-2 border-brass-400/40">
                    Co-Skipper: {turn.mentorFeedback}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Student Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-compass-teal" />
                <span>Mikaela’s Strategic Analysis:</span>
              </label>

              <div className="flex items-center gap-2">
                <AudioWaveform
                  isListening={isListening}
                  isSpeaking={isMentorSpeaking}
                  barCount={14}
                  height={22}
                />
              </div>
            </div>

            <textarea
              rows={3}
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              placeholder="Speak your reasoning aloud or type what you would do in Elena's boots..."
              className="w-full bg-compass-dark border-2 border-compass-slate/50 focus:border-compass-teal rounded-2xl p-4 text-slate-100 text-sm sm:text-base font-sans leading-relaxed focus:outline-none transition-all placeholder:text-slate-500"
            />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleStartListening}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isListening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                    : 'bg-compass-dark hover:bg-compass-slate/40 text-compass-glow border border-compass-teal/40'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'Stop Recording' : 'Speak Your Thought Aloud'}</span>
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                {currentPrompt.keyTacticalInsights.map((insight, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStudentInput(insight)}
                    className="text-[11px] bg-compass-slate/30 hover:bg-compass-slate/50 text-slate-300 px-2.5 py-1 rounded-lg border border-compass-slate/50 whitespace-nowrap"
                    title="Insert strategic insight"
                  >
                    + Tactical Insight
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmitResponse}
                disabled={!studentInput.trim() || isMentorSpeaking}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-compass-teal to-ocean-500 hover:from-compass-glow hover:to-ocean-400 text-compass-dark font-extrabold text-xs sm:text-sm shadow-lg shadow-compass-teal/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>Debrief with Coach →</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-compass-navy via-slate-900 to-compass-dark border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              Tactical Mission Completed!
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
              Mikaela conquered high-stakes nautical vocabulary, mastered expressive cadence, and delivered elite tactical analysis.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-compass-dark p-3.5 rounded-xl border border-compass-slate/40">
              <div className="text-xs text-slate-400">Total Words</div>
              <div className="text-xl font-bold text-white mt-0.5">{totalWords}</div>
            </div>
            <div className="bg-compass-dark p-3.5 rounded-xl border border-compass-slate/40">
              <div className="text-xs text-slate-400">Reading Speed</div>
              <div className="text-xl font-bold text-compass-teal mt-0.5">{effectiveWpm} WPM</div>
            </div>
            <div className="bg-compass-dark p-3.5 rounded-xl border border-compass-slate/40">
              <div className="text-xs text-slate-400">Fluency Flow</div>
              <div className="text-xl font-bold text-brass-400 mt-0.5">{smoothnessScore}%</div>
            </div>
            <div className="bg-compass-dark p-3.5 rounded-xl border border-compass-slate/40">
              <div className="text-xs text-slate-400">Debrief Points</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">
                {completedTurns.length}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleWrapUp}
              className="w-full sm:w-auto py-3 px-8 rounded-xl bg-gradient-to-r from-compass-teal to-ocean-500 hover:from-compass-glow hover:to-ocean-400 text-compass-dark font-extrabold text-sm shadow-xl shadow-compass-teal/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Choose Another Story →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
