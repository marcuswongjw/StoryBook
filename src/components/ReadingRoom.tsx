import React, { useState, useEffect, useRef } from 'react';
import { Passage, SentenceData, VocabularyWord, ReadingStumble, TutorSettings } from '../types';
import { voiceListener, SpeechRecognitionResultPayload, SpeechStatus } from '../services/speechRecognition';
import { mentorVoice } from '../services/speechSynthesis';
import { soundEngine } from '../services/soundEffects';
import { SentenceFluencyTracker } from '../services/fluencyAnalyzer';
import { updateOrAddTelemetrySession } from '../services/storage';
import { AudioWaveform } from './AudioWaveform';
import { UnpackModal } from './UnpackModal';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReadingRoomProps {
  passage: Passage;
  settings: TutorSettings;
  onCompletePassage: (stumbles: ReadingStumble[], durationSeconds: number, totalWords: number) => void;
  onExit: () => void;
}

export const ReadingRoom: React.FC<ReadingRoomProps> = ({
  passage,
  settings,
  onCompletePassage,
  onExit,
}) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>('listening');
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false);
  const [activeStumble, setActiveStumble] = useState<{
    vocab: VocabularyWord;
    stumble: ReadingStumble;
  } | null>(null);

  const [allStumbles, setAllStumbles] = useState<ReadingStumble[]>([]);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string>('session-' + Date.now());
  const trackerRef = useRef<SentenceFluencyTracker | null>(null);

  const currentSentence: SentenceData = passage.sentences[currentSentenceIndex];
  const sentenceWords = currentSentence ? currentSentence.text.split(/\s+/).filter(Boolean) : [];

  const totalPassageWords = passage.sentences.reduce(
    (acc, s) => acc + s.text.split(/\s+/).length,
    0
  );

  // Helper to persist current telemetry live to storage
  const syncCurrentTelemetry = (stumblesList: ReadingStumble[], isCompleted = false) => {
    const elapsed = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
    // Calculate cumulative words read so far
    let readWordsCount = 0;
    for (let i = 0; i < currentSentenceIndex; i++) {
      readWordsCount += passage.sentences[i].text.split(/\s+/).length;
    }
    readWordsCount += activeWordIndex;

    updateOrAddTelemetrySession(
      sessionIdRef.current,
      passage,
      elapsed,
      readWordsCount,
      stumblesList,
      [],
      isCompleted
    );
  };

  // Setup tracker for current sentence
  useEffect(() => {
    if (!currentSentence) return;

    // Save initial reading session on start/sentence change
    syncCurrentTelemetry(allStumbles, false);

    setActiveWordIndex(0);
    const tracker = new SentenceFluencyTracker(
      currentSentence,
      settings.hesitationThresholdSeconds
    );

    tracker.setHesitationCallback((vocab, stumble) => {
      setAllStumbles((prev) => {
        const updated = [...prev, stumble];
        syncCurrentTelemetry(updated, false);
        return updated;
      });
      setActiveStumble({ vocab, stumble });
    });

    trackerRef.current = tracker;

    const handleSpeechResult = (result: SpeechRecognitionResultPayload) => {
      if (activeStumble || isCoachSpeaking) return;

      const match = tracker.processSpokenWords(result.words);
      setActiveWordIndex(match.currentWordIndex);

      if (match.isSentenceComplete) {
        handleSentenceComplete();
      }
    };

    voiceListener.setCallbacks(handleSpeechResult, (status) => {
      setSpeechStatus(status);
    });

    voiceListener.start();

    return () => {
      tracker.destroy();
      voiceListener.stop();
      mentorVoice.stop();
    };
  }, [currentSentenceIndex, passage.id]);

  const handleSentenceComplete = () => {
    soundEngine.playSuccessChime();
    syncCurrentTelemetry(allStumbles, false);

    if (currentSentenceIndex + 1 < passage.sentences.length) {
      setTimeout(() => {
        setCurrentSentenceIndex((prev) => prev + 1);
      }, 400);
    } else {
      soundEngine.playShipsBell();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5BC0BE', '#6FFFE9', '#fbbf24', '#0ea5e9'],
      });

      const totalDuration = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
      syncCurrentTelemetry(allStumbles, true);

      setTimeout(() => {
        onCompletePassage(allStumbles, totalDuration, totalPassageWords);
      }, 800);
    }
  };

  const handleManualAdvanceWord = () => {
    soundEngine.playWordClick();
    if (!trackerRef.current) return;
    const match = trackerRef.current.advanceManualWord();
    setActiveWordIndex(match.currentWordIndex);

    if (match.isSentenceComplete) {
      handleSentenceComplete();
    }
  };

  const handleTriggerStumbleForTesting = (vocab?: VocabularyWord) => {
    if (!trackerRef.current) return;
    trackerRef.current.forceTriggerStumble(vocab);
  };

  const handleReadAloudByCoach = () => {
    setIsCoachSpeaking(true);
    voiceListener.pause();
    mentorVoice.speak(currentSentence.text, {
      rate: settings.voiceSpeed,
      pitch: settings.voicePitch,
      onEnd: () => {
        setIsCoachSpeaking(false);
        voiceListener.resume();
      },
    });
  };

  const handleStumbleResolved = (resolvedStumble: ReadingStumble) => {
    setActiveStumble(null);
    const updated = allStumbles.map((s) => (s.id === resolvedStumble.id ? resolvedStumble : s));
    setAllStumbles(updated);
    syncCurrentTelemetry(updated, false);

    if (trackerRef.current) {
      trackerRef.current.reset();
    }
    setActiveWordIndex(0);
    voiceListener.start();
  };

  const handleWordClick = (word: string, idx: number) => {
    soundEngine.playWordClick();
    const clean = word.toLowerCase().replace(/[^\w-]/g, '');
    const matchedVocab = currentSentence.vocabularyWords.find(
      (v) => v.word.toLowerCase() === clean || clean.includes(v.word.toLowerCase())
    );

    if (matchedVocab) {
      handleTriggerStumbleForTesting(matchedVocab);
    } else {
      setActiveWordIndex(idx + 1);
    }
  };

  const handleSafeExit = () => {
    syncCurrentTelemetry(allStumbles, false);
    onExit();
  };

  const progressPercentage = Math.round(
    ((currentSentenceIndex + 1) / passage.sentences.length) * 100
  );

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      {/* Top Reading Header */}
      <div className="flex items-center justify-between gap-4 border-b border-compass-slate/40 pb-4">
        <button
          onClick={handleSafeExit}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Expedition</span>
        </button>

        <div className="text-center">
          <div className="text-xs font-mono text-compass-teal uppercase tracking-wider">
            {passage.category === 'singapore' ? '🇸🇬 Singapore' : passage.category} Expedition • {passage.lexileLevel}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
            {passage.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-300">
            Sentence <strong className="text-compass-glow">{currentSentenceIndex + 1}</strong> of{' '}
            {passage.sentences.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-compass-dark/90 h-2 rounded-full overflow-hidden border border-compass-slate/50">
        <div
          className="h-full bg-gradient-to-r from-compass-teal to-ocean-400 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Reading Stage Card */}
      <div className="bg-gradient-to-b from-compass-navy via-slate-900 to-compass-dark border-2 border-compass-teal/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-compass-teal/5 rounded-full blur-3xl pointer-events-none" />

        {/* Previous Sentences */}
        {currentSentenceIndex > 0 && (
          <div className="space-y-2 opacity-40 hover:opacity-75 transition-opacity">
            {passage.sentences.slice(Math.max(0, currentSentenceIndex - 2), currentSentenceIndex).map((prevS) => (
              <p key={prevS.id} className="text-slate-400 font-serif text-base sm:text-lg leading-relaxed italic">
                {prevS.text}
              </p>
            ))}
          </div>
        )}

        {/* ACTIVE SENTENCE SPOTLIGHT */}
        <div className="bg-compass-dark/95 border-2 border-compass-teal/40 rounded-2xl p-6 sm:p-8 shadow-inner space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-compass-teal animate-ping" />
              <span className="text-xs font-bold text-compass-glow uppercase tracking-wider">
                Active Sentence — Read Aloud
              </span>
            </div>

            {currentSentence.tacticalContext && (
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-compass-slate/30 px-2.5 py-1 rounded-md border border-compass-slate/40">
                {currentSentence.tacticalContext}
              </span>
            )}
          </div>

          {/* Words Container with Real-Time Word Highlighting */}
          <div className="text-2xl sm:text-3xl lg:text-4xl leading-relaxed font-serif tracking-wide text-slate-200 select-none">
            {sentenceWords.map((word, idx) => {
              const clean = word.toLowerCase().replace(/[^\w-]/g, '');
              const isVocab = currentSentence.vocabularyWords.some(
                (v) => v.word.toLowerCase() === clean || clean.includes(v.word.toLowerCase())
              );
              const isRead = idx < activeWordIndex;
              const isCurrent = idx === activeWordIndex;

              return (
                <span
                  key={idx}
                  onClick={() => handleWordClick(word, idx)}
                  className={`inline-block mr-2.5 my-1 px-1.5 py-0.5 rounded-lg transition-all duration-150 cursor-pointer ${
                    isRead
                      ? 'bg-compass-teal/20 text-emerald-300 font-medium'
                      : isCurrent
                      ? 'bg-compass-teal text-compass-dark font-extrabold shadow-lg shadow-compass-teal/30 scale-105 ring-2 ring-compass-glow'
                      : isVocab
                      ? 'text-compass-glow font-semibold underline decoration-compass-teal/80 decoration-2 underline-offset-4 bg-compass-teal/10'
                      : 'text-slate-200 hover:text-white'
                  }`}
                  title={isVocab ? `Click to unpack "${word}"` : 'Click to jump to this word'}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* Key Vocab Indicators Below Sentence */}
          {currentSentence.vocabularyWords.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 pt-3 border-t border-compass-slate/30">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Target Vocabulary:
              </span>
              {currentSentence.vocabularyWords.map((vocab, i) => (
                <button
                  key={i}
                  onClick={() => handleTriggerStumbleForTesting(vocab)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-compass-slate/40 hover:bg-compass-teal/20 text-compass-glow border border-compass-teal/30 text-xs font-mono transition-all"
                >
                  <Sparkles className="w-3 h-3 text-compass-teal" />
                  <span>{vocab.word}</span>
                  <span className="text-[10px] text-slate-400">({vocab.syllableBreakdown})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Future Sentences Preview */}
        {currentSentenceIndex + 1 < passage.sentences.length && (
          <div className="space-y-2 opacity-30">
            {passage.sentences.slice(currentSentenceIndex + 1, currentSentenceIndex + 3).map((nextS) => (
              <p key={nextS.id} className="text-slate-400 font-serif text-base sm:text-lg leading-relaxed">
                {nextS.text}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Voice Tracking & Audio Assist HUD */}
      <div className="bg-compass-navy/90 border border-compass-slate/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                speechStatus === 'listening'
                  ? 'bg-compass-teal/20 border-2 border-compass-teal text-compass-glow animate-pulse'
                  : 'bg-compass-dark border border-compass-slate/40 text-slate-400'
              }`}
            >
              {speechStatus === 'listening' ? (
                <Mic className="w-6 h-6 text-compass-glow" />
              ) : (
                <MicOff className="w-6 h-6 text-slate-500" />
              )}
            </div>
            {speechStatus === 'listening' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-compass-navy" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono uppercase">
                {isCoachSpeaking
                  ? 'Co-Skipper Speaking'
                  : speechStatus === 'listening'
                  ? 'Microphone Listening'
                  : 'Speech Paused'}
              </span>
              <span className="text-[10px] text-slate-400">
                (Auto-logs to Parent Hub in real time)
              </span>
            </div>
            <AudioWaveform
              isListening={speechStatus === 'listening'}
              isSpeaking={isCoachSpeaking}
              barCount={20}
              height={28}
            />
          </div>
        </div>

        {/* Right: Assist & Testing Actions */}
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleReadAloudByCoach}
            disabled={isCoachSpeaking}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-compass-dark hover:bg-compass-slate/40 text-slate-200 border border-compass-slate/40 text-xs font-medium transition-all"
            title="Hear how an elite reader paces this sentence"
          >
            <Volume2 className="w-4 h-4 text-brass-400" />
            <span>Hear Coach</span>
          </button>

          <button
            onClick={() => handleTriggerStumbleForTesting()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brass-500/15 hover:bg-brass-500/25 text-brass-300 border border-brass-400/30 text-xs font-medium transition-all"
            title="Simulate hesitation or stumbling on a word"
          >
            <AlertCircle className="w-4 h-4 text-brass-400" />
            <span>Simulate Stumble</span>
          </button>

          <button
            onClick={handleManualAdvanceWord}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-compass-dark hover:bg-compass-slate/40 text-slate-200 border border-compass-slate/40 text-xs font-mono transition-all"
          >
            <span>Word +1</span>
          </button>

          <button
            onClick={handleSentenceComplete}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-compass-teal hover:bg-compass-glow text-compass-dark font-extrabold text-xs shadow-md transition-all"
          >
            <span>
              {currentSentenceIndex + 1 === passage.sentences.length
                ? 'Finish & Debrief →'
                : 'Next Sentence →'}
            </span>
          </button>
        </div>
      </div>

      {/* ACTIVE INTERVENTION UNPACK MODAL */}
      {activeStumble && (
        <UnpackModal
          vocabWord={activeStumble.vocab}
          sentence={currentSentence}
          stumble={activeStumble.stumble}
          onResolved={handleStumbleResolved}
        />
      )}
    </div>
  );
};
