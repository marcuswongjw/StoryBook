import React, { useEffect, useRef, useState } from 'react';
import { Passage, ReadingStumble, SentenceData, TutorSettings, VocabularyWord } from '../types';
import { voiceListener, SpeechStatus } from '../services/speechRecognition';
import { mentorVoice } from '../services/speechSynthesis';
import { soundEngine } from '../services/soundEffects';
import { SentenceFluencyTracker } from '../services/fluencyAnalyzer';
import { updateOrAddTelemetrySession } from '../services/storage';
import { AudioWaveform } from './AudioWaveform';
import { UnpackModal } from './UnpackModal';
import { AlertCircle, ChevronLeft, Mic, MicOff, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReadingRoomProps {
  passage: Passage;
  settings: TutorSettings;
  onCompletePassage: (stumbles: ReadingStumble[], durationSeconds: number, totalWords: number) => void;
  onExit: () => void;
}

type ActiveStumble = { vocab: VocabularyWord; stumble: ReadingStumble } | null;

export const ReadingRoom: React.FC<ReadingRoomProps> = ({ passage, settings, onCompletePassage, onExit }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>('idle');
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false);
  const [activeStumble, setActiveStumble] = useState<ActiveStumble>(null);
  const [, setAllStumbles] = useState<ReadingStumble[]>([]);

  const sessionStartTimeRef = useRef(Date.now());
  const sessionIdRef = useRef(`session-${Date.now()}`);
  const trackerRef = useRef<SentenceFluencyTracker | null>(null);
  const currentSentenceIndexRef = useRef(0);
  const activeWordIndexRef = useRef(0);
  const allStumblesRef = useRef<ReadingStumble[]>([]);
  const activeStumbleRef = useRef<ActiveStumble>(null);
  const isCoachSpeakingRef = useRef(false);
  const isAdvancingRef = useRef(false);
  const isCompleteRef = useRef(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSentence: SentenceData | undefined = passage.sentences[currentSentenceIndex];
  const sentenceWords = currentSentence?.text.split(/\s+/).filter(Boolean) ?? [];
  const totalPassageWords = passage.sentences.reduce((total, sentence) => (
    total + sentence.text.split(/\s+/).filter(Boolean).length
  ), 0);

  const updateActiveWordIndex = (nextIndex: number) => {
    activeWordIndexRef.current = nextIndex;
    setActiveWordIndex(nextIndex);
  };

  const updateStumbles = (nextStumbles: ReadingStumble[]) => {
    allStumblesRef.current = nextStumbles;
    setAllStumbles(nextStumbles);
  };

  const addStumble = (stumble: ReadingStumble) => {
    const alreadyRecorded = allStumblesRef.current.some((recorded) => recorded.id === stumble.id);
    if (alreadyRecorded) return;
    const updated = [...allStumblesRef.current, stumble];
    updateStumbles(updated);
    syncCurrentTelemetry(updated, false);
  };

  const setDisplayedStumble = (nextStumble: ActiveStumble) => {
    activeStumbleRef.current = nextStumble;
    setActiveStumble(nextStumble);
  };

  const syncCurrentTelemetry = (stumbles = allStumblesRef.current, isCompleted = false) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
    const completedSentenceWords = passage.sentences
      .slice(0, currentSentenceIndexRef.current)
      .reduce((total, sentence) => total + sentence.text.split(/\s+/).filter(Boolean).length, 0);

    updateOrAddTelemetrySession(
      sessionIdRef.current,
      passage,
      elapsedSeconds,
      completedSentenceWords + activeWordIndexRef.current,
      stumbles,
      [],
      isCompleted,
    );
  };

  const safePlay = (sound: () => void) => {
    try {
      sound();
    } catch (error) {
      console.warn('A non-essential sound effect could not play:', error);
    }
  };

  const finishSentence = () => {
    if (isAdvancingRef.current || isCompleteRef.current) return;
    isAdvancingRef.current = true;
    voiceListener.stop();
    safePlay(() => soundEngine.playSuccessChime());
    syncCurrentTelemetry(allStumblesRef.current, false);

    const sentenceIndex = currentSentenceIndexRef.current;
    if (sentenceIndex + 1 < passage.sentences.length) {
      advanceTimerRef.current = setTimeout(() => {
        if (isCompleteRef.current) return;
        const nextSentenceIndex = sentenceIndex + 1;
        currentSentenceIndexRef.current = nextSentenceIndex;
        updateActiveWordIndex(0);
        setCurrentSentenceIndex(nextSentenceIndex);
      }, 450);
      return;
    }

    isCompleteRef.current = true;
    safePlay(() => soundEngine.playShipsBell());
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5BC0BE', '#6FFFE9', '#fbbf24', '#0ea5e9'],
      });
    } catch (error) {
      console.warn('Completion animation could not play:', error);
    }

    const totalDuration = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
    syncCurrentTelemetry(allStumblesRef.current, true);
    advanceTimerRef.current = setTimeout(() => {
      onCompletePassage(allStumblesRef.current, totalDuration, totalPassageWords);
    }, 800);
  };

  useEffect(() => {
    if (!currentSentence || isCompleteRef.current) return;

    isAdvancingRef.current = false;
    updateActiveWordIndex(0);
    syncCurrentTelemetry(allStumblesRef.current, false);

    const tracker = new SentenceFluencyTracker(currentSentence, settings.hesitationThresholdSeconds);
    trackerRef.current = tracker;

    tracker.setMismatchCallback((stumble) => addStumble(stumble));
    tracker.setHesitationCallback((vocab, stumble) => {
      addStumble(stumble);
      voiceListener.stop();
      setDisplayedStumble({ vocab, stumble });
    });

    voiceListener.setCallbacks((result) => {
      if (activeStumbleRef.current || isCoachSpeakingRef.current || isAdvancingRef.current || isCompleteRef.current) {
        return;
      }

      const match = tracker.processSpokenWords(result.words);
      updateActiveWordIndex(match.currentWordIndex);
      if (match.isSentenceComplete) finishSentence();
    }, setSpeechStatus);
    voiceListener.start();

    return () => {
      tracker.destroy();
      if (trackerRef.current === tracker) trackerRef.current = null;
      voiceListener.stop();
      mentorVoice.stop();
    };
  }, [currentSentenceIndex, passage.id, settings.hesitationThresholdSeconds]);

  useEffect(() => () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    voiceListener.stop();
    mentorVoice.stop();
  }, []);

  const handleManualAdvanceWord = () => {
    safePlay(() => soundEngine.playWordClick());
    const tracker = trackerRef.current;
    if (!tracker || isAdvancingRef.current) return;
    const match = tracker.advanceManualWord();
    updateActiveWordIndex(match.currentWordIndex);
    if (match.isSentenceComplete) finishSentence();
  };

  const handleManualNextSentence = () => {
    const tracker = trackerRef.current;
    if (!tracker || isAdvancingRef.current) return;
    const match = tracker.markRemainingWordsAsSkipped();
    updateActiveWordIndex(match.currentWordIndex);
    finishSentence();
  };

  const handleTriggerStumble = (vocabulary?: VocabularyWord) => {
    trackerRef.current?.forceTriggerStumble(vocabulary);
  };

  const handleReadAloudByCoach = () => {
    if (!currentSentence || isCoachSpeakingRef.current || isAdvancingRef.current) return;
    isCoachSpeakingRef.current = true;
    setIsCoachSpeaking(true);
    voiceListener.pause();
    mentorVoice.speak(currentSentence.text, {
      rate: settings.voiceSpeed,
      pitch: settings.voicePitch,
      onEnd: () => {
        isCoachSpeakingRef.current = false;
        setIsCoachSpeaking(false);
        if (!activeStumbleRef.current && !isAdvancingRef.current && !isCompleteRef.current) {
          voiceListener.resume();
        }
      },
    });
  };

  const handleStumbleResolved = (resolvedStumble: ReadingStumble) => {
    const updated = allStumblesRef.current.map((stumble) => (
      stumble.id === resolvedStumble.id ? resolvedStumble : stumble
    ));
    updateStumbles(updated);
    syncCurrentTelemetry(updated, false);
    setDisplayedStumble(null);
    trackerRef.current?.reset();
    updateActiveWordIndex(0);
    if (!isCompleteRef.current && !isAdvancingRef.current) voiceListener.start();
  };

  const handleWordClick = (word: string, wordIndex: number) => {
    safePlay(() => soundEngine.playWordClick());
    if (!currentSentence) return;
    const cleanWord = word.toLowerCase().replace(/[^\w-]/g, '');
    const vocabulary = currentSentence.vocabularyWords.find((entry) => (
      entry.word.toLowerCase() === cleanWord || cleanWord.includes(entry.word.toLowerCase())
    ));
    if (vocabulary) {
      handleTriggerStumble(vocabulary);
    } else {
      updateActiveWordIndex(wordIndex + 1);
    }
  };

  const handleSafeExit = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    voiceListener.stop();
    syncCurrentTelemetry(allStumblesRef.current, false);
    onExit();
  };

  if (!currentSentence) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center space-y-5">
        <div className="bg-compass-navy border border-compass-teal/30 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white">Reading session paused safely</h2>
          <p className="mt-3 text-slate-300">The reader reached an unexpected sentence state. Your progress has been saved; return to the story list to begin again.</p>
          <button onClick={handleSafeExit} className="mt-6 px-5 py-3 rounded-xl bg-compass-teal text-compass-dark font-bold">
            Return to Story List
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round(((currentSentenceIndex + 1) / passage.sentences.length) * 100);

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-compass-slate/40 pb-4">
        <button onClick={handleSafeExit} className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Expedition</span>
        </button>
        <div className="text-center">
          <div className="text-xs font-mono text-compass-teal uppercase tracking-wider">
            {passage.category === 'singapore' ? 'Singapore' : passage.category} Expedition • {passage.lexileLevel}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-sans">{passage.title}</h2>
        </div>
        <span className="text-xs font-mono text-slate-300">Sentence <strong className="text-compass-glow">{currentSentenceIndex + 1}</strong> of {passage.sentences.length}</span>
      </div>

      <div className="w-full bg-compass-dark/90 h-2 rounded-full overflow-hidden border border-compass-slate/50">
        <div className="h-full bg-gradient-to-r from-compass-teal to-ocean-400 transition-all duration-300 rounded-full" style={{ width: `${progressPercentage}%` }} />
      </div>

      <div className="bg-gradient-to-b from-compass-navy via-slate-900 to-compass-dark border-2 border-compass-teal/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-compass-teal/5 rounded-full blur-3xl pointer-events-none" />
        {currentSentenceIndex > 0 && (
          <div className="space-y-2 opacity-40 hover:opacity-75 transition-opacity">
            {passage.sentences.slice(Math.max(0, currentSentenceIndex - 2), currentSentenceIndex).map((previous) => (
              <p key={previous.id} className="text-slate-400 font-serif text-base sm:text-lg leading-relaxed italic">{previous.text}</p>
            ))}
          </div>
        )}

        <div className="bg-compass-dark/95 border-2 border-compass-teal/40 rounded-2xl p-6 sm:p-8 shadow-inner space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-compass-teal animate-ping" />
              <span className="text-xs font-bold text-compass-glow uppercase tracking-wider">Active Sentence — Read Aloud</span>
            </div>
            {currentSentence.tacticalContext && <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-compass-slate/30 px-2.5 py-1 rounded-md border border-compass-slate/40">{currentSentence.tacticalContext}</span>}
          </div>

          <div className="text-2xl sm:text-3xl lg:text-4xl leading-relaxed font-serif tracking-wide text-slate-200 select-none">
            {sentenceWords.map((word, index) => {
              const cleanWord = word.toLowerCase().replace(/[^\w-]/g, '');
              const isVocabulary = currentSentence.vocabularyWords.some((vocabulary) => vocabulary.word.toLowerCase() === cleanWord || cleanWord.includes(vocabulary.word.toLowerCase()));
              const isRead = index < activeWordIndex;
              const isCurrent = index === activeWordIndex;
              return (
                <span key={`${word}-${index}`} onClick={() => handleWordClick(word, index)} className={`inline-block mr-2.5 my-1 px-1.5 py-0.5 rounded-lg transition-all duration-150 cursor-pointer ${isRead ? 'bg-compass-teal/20 text-emerald-300 font-medium' : isCurrent ? 'bg-compass-teal text-compass-dark font-extrabold shadow-lg shadow-compass-teal/30 scale-105 ring-2 ring-compass-glow' : isVocabulary ? 'text-compass-glow font-semibold underline decoration-compass-teal/80 decoration-2 underline-offset-4 bg-compass-teal/10' : 'text-slate-200 hover:text-white'}`} title={isVocabulary ? `Click to unpack "${word}"` : 'Click to mark this word'}>
                  {word}
                </span>
              );
            })}
          </div>

          {currentSentence.vocabularyWords.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 pt-3 border-t border-compass-slate/30">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Target Vocabulary:</span>
              {currentSentence.vocabularyWords.map((vocabulary, index) => (
                <button key={`${vocabulary.word}-${index}`} onClick={() => handleTriggerStumble(vocabulary)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-compass-slate/40 hover:bg-compass-teal/20 text-compass-glow border border-compass-teal/30 text-xs font-mono transition-all">
                  <Sparkles className="w-3 h-3 text-compass-teal" />
                  <span>{vocabulary.word}</span><span className="text-[10px] text-slate-400">({vocabulary.syllableBreakdown})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {currentSentenceIndex + 1 < passage.sentences.length && (
          <div className="space-y-2 opacity-30">
            {passage.sentences.slice(currentSentenceIndex + 1, currentSentenceIndex + 3).map((next) => (
              <p key={next.id} className="text-slate-400 font-serif text-base sm:text-lg leading-relaxed">{next.text}</p>
            ))}
          </div>
        )}
      </div>

      <div className="bg-compass-navy/90 border border-compass-slate/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${speechStatus === 'listening' ? 'bg-compass-teal/20 border-2 border-compass-teal text-compass-glow animate-pulse' : 'bg-compass-dark border border-compass-slate/40 text-slate-400'}`}>
            {speechStatus === 'listening' ? <Mic className="w-6 h-6 text-compass-glow" /> : <MicOff className="w-6 h-6 text-slate-500" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2"><span className="text-xs font-bold text-white font-mono uppercase">{isCoachSpeaking ? 'Co-Skipper Speaking' : speechStatus === 'listening' ? 'Microphone Listening' : 'Speech Paused'}</span><span className="text-[10px] text-slate-400">(Logs recognised errors to Parent Hub)</span></div>
            <AudioWaveform isListening={speechStatus === 'listening'} isSpeaking={isCoachSpeaking} barCount={20} height={28} />
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
          <button onClick={handleReadAloudByCoach} disabled={isCoachSpeaking} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-compass-dark hover:bg-compass-slate/40 text-slate-200 border border-compass-slate/40 text-xs font-medium transition-all disabled:opacity-50"><Volume2 className="w-4 h-4 text-brass-400" /><span>Hear Coach</span></button>
          <button onClick={() => handleTriggerStumble()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brass-500/15 hover:bg-brass-500/25 text-brass-300 border border-brass-400/30 text-xs font-medium transition-all"><AlertCircle className="w-4 h-4 text-brass-400" /><span>Check a Word</span></button>
          <button onClick={handleManualAdvanceWord} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-compass-dark hover:bg-compass-slate/40 text-slate-200 border border-compass-slate/40 text-xs font-mono transition-all"><span>Skip Word</span></button>
          <button onClick={handleManualNextSentence} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-compass-teal hover:bg-compass-glow text-compass-dark font-extrabold text-xs shadow-md transition-all"><span>{currentSentenceIndex + 1 === passage.sentences.length ? 'Finish & Debrief →' : 'Next Sentence →'}</span></button>
        </div>
      </div>

      {activeStumble && <UnpackModal vocabWord={activeStumble.vocab} sentence={currentSentence} stumble={activeStumble.stumble} onResolved={handleStumbleResolved} />}
    </div>
  );
};
