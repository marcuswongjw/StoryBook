import React, { useState, useEffect } from 'react';
import { VocabularyWord, SentenceData, ReadingStumble } from '../types';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, Mic, Anchor } from 'lucide-react';
import { mentorVoice } from '../services/speechSynthesis';
import { soundEngine } from '../services/soundEffects';
import { voiceListener, SpeechRecognitionResultPayload } from '../services/speechRecognition';
import { areWordsSimilar } from '../services/fluencyAnalyzer';
import confetti from 'canvas-confetti';

interface UnpackModalProps {
  vocabWord: VocabularyWord;
  sentence: SentenceData;
  stumble: ReadingStumble;
  onResolved: (updatedStumble: ReadingStumble) => void;
}

export const UnpackModal: React.FC<UnpackModalProps> = ({
  vocabWord,
  sentence,
  stumble,
  onResolved,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [reReadProgressIndex, setReReadProgressIndex] = useState(0);
  const [reReadComplete, setReReadComplete] = useState(false);

  const sentenceWords = sentence.text.split(/\s+/).filter(Boolean);
  const cleanedSentenceWords = sentenceWords.map((w) =>
    w.toLowerCase().replace(/[^\w-]/g, '')
  );

  useEffect(() => {
    soundEngine.playTacticalPauseRadar();
    handlePronounceWord();

    const handleSpeechResult = (result: SpeechRecognitionResultPayload) => {
      if (reReadComplete) return;

      let currentIndex = reReadProgressIndex;
      for (const spoken of result.words) {
        const target = cleanedSentenceWords[currentIndex];
        if (target && areWordsSimilar(spoken, target)) {
          currentIndex++;
        }
      }

      setReReadProgressIndex(currentIndex);

      if (currentIndex >= sentenceWords.length) {
        handleReReadSuccess();
      }
    };

    voiceListener.setCallbacks(handleSpeechResult);
    voiceListener.start();

    return () => {
      mentorVoice.stop();
    };
  }, []);

  const handlePronounceWord = () => {
    setIsPlayingAudio(true);
    mentorVoice.speakWordUnpack(
      vocabWord.word,
      vocabWord.syllableBreakdown,
      vocabWord.tacticalAnalogy,
      () => setIsPlayingAudio(false)
    );
  };

  const handleReReadSuccess = () => {
    setReReadComplete(true);
    soundEngine.playSuccessChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#5BC0BE', '#6FFFE9', '#fbbf24'],
    });

    setTimeout(() => {
      onResolved({
        ...stumble,
        resolvedWithReRead: true,
      });
    }, 1200);
  };

  const handleManualAdvanceWord = () => {
    soundEngine.playWordClick();
    const nextIdx = reReadProgressIndex + 1;
    setReReadProgressIndex(nextIdx);
    if (nextIdx >= sentenceWords.length) {
      handleReReadSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-compass-navy to-slate-900 border-2 border-compass-teal/50 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl shadow-compass-teal/20 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Intervention Header */}
        <div className="flex items-center justify-between border-b border-compass-slate/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brass-500/20 border border-brass-400/40 flex items-center justify-center text-brass-400">
              <Anchor className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-brass-500/20 text-brass-300 border border-brass-500/30">
                  Tactical Pause & Flow
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {stumble.stumbleType === 'hesitation'
                    ? `Hesitated (${stumble.durationSeconds}s)`
                    : 'Pronunciation Check'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-sans mt-0.5">
                Let's Unpack This Word
              </h3>
            </div>
          </div>

          <button
            onClick={handlePronounceWord}
            disabled={isPlayingAudio}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isPlayingAudio
                ? 'bg-brass-400 text-slate-950 shadow-lg shadow-brass-400/20 animate-pulse'
                : 'bg-compass-dark text-compass-glow hover:bg-compass-slate/50 border border-compass-teal/40'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'Speaking...' : 'Hear Coach'}</span>
          </button>
        </div>

        {/* Big Word & Syllable Breakdown */}
        <div className="bg-compass-dark/90 border border-compass-teal/30 rounded-2xl p-5 text-center space-y-2 relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Key Vocabulary ({vocabWord.partOfSpeech})
          </div>
          <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-compass-glow via-cyan-200 to-white font-sans tracking-wide">
            {vocabWord.word}
          </div>
          <div className="flex items-center justify-center gap-3 pt-1">
            <span className="font-mono text-base sm:text-lg text-brass-300 bg-compass-slate/40 px-3 py-1 rounded-lg border border-brass-400/30">
              {vocabWord.syllableBreakdown}
            </span>
            {vocabWord.phonetic && (
              <span className="font-mono text-sm text-slate-400">{vocabWord.phonetic}</span>
            )}
          </div>
        </div>

        {/* Real-World Adventure Analogy & Definition */}
        <div className="space-y-3">
          <div className="bg-ocean-950/40 border border-ocean-800/40 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-compass-teal uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-compass-glow" />
              Real-World Nautical / Tactical Context
            </div>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic">
              “{vocabWord.tacticalAnalogy}”
            </p>
          </div>

          <div className="text-xs text-slate-300 bg-compass-dark/50 p-3 rounded-lg border border-compass-slate/40 flex items-start gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Definition:
            </span>
            <span>{vocabWord.definition}</span>
          </div>
        </div>

        {/* Fluency Loop: Re-read Full Sentence Prompt */}
        <div className="bg-compass-dark/95 border-2 border-dashed border-compass-teal/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-compass-glow uppercase tracking-wider">
              <RotateCcw className="w-4 h-4 text-compass-teal animate-spin-slow" />
              Take the Helm: Re-Read Sentence Smoothly
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Mic className="w-3.5 h-3.5 text-compass-teal animate-pulse" />
              <span>Listening to Mikaela...</span>
            </div>
          </div>

          {/* Sentence Words with real-time green highlight */}
          <div className="text-base sm:text-lg leading-relaxed font-serif text-slate-300 p-3 bg-compass-navy/60 rounded-xl border border-compass-slate/50">
            {sentenceWords.map((w, idx) => {
              const isCleared = idx < reReadProgressIndex;
              const isCurrent = idx === reReadProgressIndex;
              const isVocab = w.toLowerCase().includes(vocabWord.word.toLowerCase());

              return (
                <span
                  key={idx}
                  className={`inline-block mr-1.5 px-1 py-0.5 rounded transition-all duration-200 cursor-pointer ${
                    isCleared
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : isCurrent
                      ? 'bg-brass-400/30 text-brass-300 font-bold underline decoration-brass-400 underline-offset-4 scale-105'
                      : isVocab
                      ? 'text-compass-glow font-semibold underline decoration-compass-teal'
                      : 'text-slate-300'
                  }`}
                  onClick={handleManualAdvanceWord}
                  title="Click word to advance if needed"
                >
                  {w}
                </span>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleManualAdvanceWord}
              className="text-xs text-slate-400 hover:text-slate-200 underline font-mono"
            >
              Step Word Forward (+1)
            </button>

            <button
              onClick={handleReReadSuccess}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-compass-teal to-ocean-500 hover:from-compass-glow hover:to-ocean-400 text-compass-dark font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-compass-teal/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Read Smoothly! Resume Mission →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
