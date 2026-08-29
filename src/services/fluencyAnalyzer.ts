import { SentenceData, VocabularyWord, ReadingStumble } from '../types';

export function calculateLevenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix: number[][] = [];
  for (let i = 0; i <= bn; ++i) matrix[i] = [i];
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  return matrix[bn][an];
}

export function areWordsSimilar(spoken: string, target: string): boolean {
  const s = spoken.toLowerCase().replace(/[^\w]/g, '');
  const t = target.toLowerCase().replace(/[^\w]/g, '');
  if (!s || !t) return false;
  if (s === t) return true;
  // Substring match
  if (s.includes(t) || t.includes(s)) return true;

  const dist = calculateLevenshteinDistance(s, t);
  const maxLen = Math.max(s.length, t.length);
  // Allow up to 25% edit distance for long words, or 1 character for short words
  const threshold = maxLen <= 4 ? 1 : Math.floor(maxLen * 0.3);
  return dist <= threshold;
}

export interface FluencyMatchResult {
  currentWordIndex: number;
  matchedWordsCount: number;
  isSentenceComplete: boolean;
  activeWord: string;
  isTargetVocab: boolean;
  activeVocabData?: VocabularyWord;
}

export class SentenceFluencyTracker {
  private sentence: SentenceData;
  private words: string[] = [];
  private cleanedWords: string[] = [];
  private currentIndex = 0;
  private wordStartTime: number = Date.now();
  private hesitationTimeoutId?: any;
  private onHesitationCallback?: (vocab: VocabularyWord, stumble: ReadingStumble) => void;
  private hesitationThresholdMs = 3800; // 3.8s pause on challenging word

  constructor(sentence: SentenceData, hesitationThresholdSeconds = 3.8) {
    this.sentence = sentence;
    this.hesitationThresholdMs = hesitationThresholdSeconds * 1000;
    this.words = sentence.text.split(/\s+/).filter(Boolean);
    this.cleanedWords = this.words.map((w) => w.toLowerCase().replace(/[^\w-]/g, ''));
    this.reset();
  }

  public reset() {
    this.currentIndex = 0;
    this.wordStartTime = Date.now();
    this.clearHesitationTimer();
    this.scheduleHesitationWatchdog();
  }

  public setHesitationCallback(
    callback: (vocab: VocabularyWord, stumble: ReadingStumble) => void
  ) {
    this.onHesitationCallback = callback;
  }

  private clearHesitationTimer() {
    if (this.hesitationTimeoutId) {
      clearTimeout(this.hesitationTimeoutId);
      this.hesitationTimeoutId = undefined;
    }
  }

  private scheduleHesitationWatchdog() {
    this.clearHesitationTimer();
    const currentClean = this.cleanedWords[this.currentIndex];
    if (!currentClean) return;

    // Check if current word is a target vocabulary term
    const matchedVocab = this.sentence.vocabularyWords.find(
      (v) => v.word.toLowerCase() === currentClean || currentClean.includes(v.word.toLowerCase())
    );

    if (matchedVocab && this.onHesitationCallback) {
      this.hesitationTimeoutId = setTimeout(() => {
        const stumble: ReadingStumble = {
          id: 'stumble-' + Date.now(),
          timestamp: Date.now(),
          sentenceId: this.sentence.id,
          sentenceText: this.sentence.text,
          targetWord: matchedVocab.word,
          stumbleType: 'hesitation',
          durationSeconds: Math.round((Date.now() - this.wordStartTime) / 100) / 10,
          resolvedWithReRead: false,
          notes: `Hesitated > ${this.hesitationThresholdMs / 1000}s on advanced word: "${matchedVocab.word}"`,
        };
        this.onHesitationCallback?.(matchedVocab, stumble);
      }, this.hesitationThresholdMs);
    }
  }

  public processSpokenWords(spokenWords: string[]): FluencyMatchResult {
    if (spokenWords.length === 0) {
      return this.getStatus();
    }

    // Try to advance index through spoken words
    for (const spoken of spokenWords) {
      const target = this.cleanedWords[this.currentIndex];
      if (!target) break;

      if (areWordsSimilar(spoken, target)) {
        this.currentIndex++;
        this.wordStartTime = Date.now();
        this.scheduleHesitationWatchdog();
      } else {
        // Check if next word was spoken instead (skipping a small word)
        const nextTarget = this.cleanedWords[this.currentIndex + 1];
        if (nextTarget && areWordsSimilar(spoken, nextTarget)) {
          this.currentIndex += 2;
          this.wordStartTime = Date.now();
          this.scheduleHesitationWatchdog();
        }
      }
    }

    if (this.currentIndex >= this.words.length) {
      this.clearHesitationTimer();
    }

    return this.getStatus();
  }

  public advanceManualWord() {
    if (this.currentIndex < this.words.length) {
      this.currentIndex++;
      this.wordStartTime = Date.now();
      this.scheduleHesitationWatchdog();
    }
    if (this.currentIndex >= this.words.length) {
      this.clearHesitationTimer();
    }
    return this.getStatus();
  }

  public forceTriggerStumble(vocabWord?: VocabularyWord) {
    this.clearHesitationTimer();
    const vocab =
      vocabWord ||
      this.sentence.vocabularyWords[0] || {
        word: this.cleanedWords[this.currentIndex] || 'word',
        phonetic: '',
        syllableBreakdown: this.cleanedWords[this.currentIndex] || 'word',
        partOfSpeech: 'term',
        definition: 'Key passage vocabulary.',
        tacticalAnalogy: 'Break down the syllable rhythm and read with smooth confidence!',
        sampleUsage: this.sentence.text,
      };

    const stumble: ReadingStumble = {
      id: 'stumble-' + Date.now(),
      timestamp: Date.now(),
      sentenceId: this.sentence.id,
      sentenceText: this.sentence.text,
      targetWord: vocab.word,
      stumbleType: 'mispronunciation',
      durationSeconds: Math.round((Date.now() - this.wordStartTime) / 100) / 10,
      resolvedWithReRead: false,
      notes: `Mispronunciation / phoneme stumble on "${vocab.word}"`,
    };

    this.onHesitationCallback?.(vocab, stumble);
    return stumble;
  }

  public getStatus(): FluencyMatchResult {
    const currentClean = this.cleanedWords[this.currentIndex] || '';
    const matchedVocab = this.sentence.vocabularyWords.find(
      (v) => v.word.toLowerCase() === currentClean || currentClean.includes(v.word.toLowerCase())
    );

    return {
      currentWordIndex: this.currentIndex,
      matchedWordsCount: this.currentIndex,
      isSentenceComplete: this.currentIndex >= this.words.length,
      activeWord: this.words[this.currentIndex] || '',
      isTargetVocab: !!matchedVocab,
      activeVocabData: matchedVocab,
    };
  }

  public destroy() {
    this.clearHesitationTimer();
  }
}
