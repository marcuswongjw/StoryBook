import type { ReadingStumble, SentenceData, VocabularyWord } from '../types';

export function calculateLevenshteinDistance(a: string, b: string): number {
  const sourceLength = a?.length ?? 0;
  const targetLength = b?.length ?? 0;
  if (sourceLength === 0) return targetLength;
  if (targetLength === 0) return sourceLength;

  const matrix: number[][] = Array.from(
    { length: targetLength + 1 },
    (_, row) => [row],
  );
  matrix[0] = Array.from({ length: sourceLength + 1 }, (_, column) => column);

  for (let row = 1; row <= targetLength; row += 1) {
    for (let column = 1; column <= sourceLength; column += 1) {
      if (b.charAt(row - 1) === a.charAt(column - 1)) {
        matrix[row][column] = matrix[row - 1][column - 1];
      } else {
        matrix[row][column] = Math.min(
          matrix[row - 1][column - 1] + 1,
          matrix[row][column - 1] + 1,
          matrix[row - 1][column] + 1,
        );
      }
    }
  }

  return matrix[targetLength][sourceLength];
}

function normaliseWord(word: string): string {
  return word.toLowerCase().replace(/[^\w-]/g, '');
}

export function areWordsSimilar(spoken: string, target: string): boolean {
  const candidate = normaliseWord(spoken);
  const expected = normaliseWord(target);
  if (!candidate || !expected) return false;
  if (candidate === expected) return true;

  // Permit only harmless grammatical endings, never broad substring matching.
  if (expected.length > 3 && (candidate === `${expected}s` || candidate === `${expected}ed`)) {
    return true;
  }

  // Short words need an exact match. A one-character difference can change the word entirely.
  if (Math.min(candidate.length, expected.length) <= 4) return false;

  const distance = calculateLevenshteinDistance(candidate, expected);
  const maximumLength = Math.max(candidate.length, expected.length);
  const threshold = maximumLength <= 5 ? 1 : Math.max(1, Math.floor(maximumLength * 0.2));
  return distance <= threshold;
}

export interface FluencyMatchResult {
  currentWordIndex: number;
  matchedWordsCount: number;
  isSentenceComplete: boolean;
  activeWord: string;
  isTargetVocab: boolean;
  activeVocabData?: VocabularyWord;
}

type StumbleCallback = (vocab: VocabularyWord, stumble: ReadingStumble) => void;
type MismatchCallback = (stumble: ReadingStumble) => void;

export class SentenceFluencyTracker {
  private readonly sentence: SentenceData;
  private readonly words: string[];
  private readonly cleanedWords: string[];
  private currentIndex = 0;
  private wordStartTime = Date.now();
  private hesitationTimeoutId?: ReturnType<typeof setTimeout>;
  private onHesitationCallback?: StumbleCallback;
  private onMismatchCallback?: MismatchCallback;
  private readonly hesitationThresholdMs: number;
  private reportedMismatchKeys = new Set<string>();

  constructor(sentence: SentenceData, hesitationThresholdSeconds = 3.8) {
    this.sentence = sentence;
    this.hesitationThresholdMs = hesitationThresholdSeconds * 1000;
    this.words = sentence.text.split(/\s+/).filter(Boolean);
    this.cleanedWords = this.words.map(normaliseWord);
    this.reset();
  }

  public reset(): void {
    this.currentIndex = 0;
    this.wordStartTime = Date.now();
    this.reportedMismatchKeys.clear();
    this.clearHesitationTimer();
    this.scheduleHesitationWatchdog();
  }

  public setHesitationCallback(callback: StumbleCallback): void {
    this.onHesitationCallback = callback;
  }

  public setMismatchCallback(callback: MismatchCallback): void {
    this.onMismatchCallback = callback;
  }

  private clearHesitationTimer(): void {
    if (this.hesitationTimeoutId) {
      clearTimeout(this.hesitationTimeoutId);
      this.hesitationTimeoutId = undefined;
    }
  }

  private vocabularyFor(targetWord: string): VocabularyWord {
    return this.sentence.vocabularyWords.find((vocabulary) => (
      normaliseWord(vocabulary.word) === targetWord
      || targetWord.includes(normaliseWord(vocabulary.word))
    )) ?? {
      word: targetWord || 'word',
      phonetic: '',
      syllableBreakdown: targetWord || 'word',
      partOfSpeech: 'word',
      definition: 'A word from the active reading sentence.',
      tacticalAnalogy: 'Pause, check the word, and try the sentence again with steady pacing.',
      sampleUsage: this.sentence.text,
    };
  }

  private reportMismatch(
    expectedWord: string,
    spokenAttempt: string,
    stumbleType: 'mispronunciation' | 'syntax_stall',
    note: string,
  ): void {
    const key = `${this.currentIndex}:${normaliseWord(spokenAttempt)}:${stumbleType}`;
    if (this.reportedMismatchKeys.has(key)) return;
    this.reportedMismatchKeys.add(key);

    this.onMismatchCallback?.({
      id: `stumble-${Date.now()}-${this.currentIndex}`,
      timestamp: Date.now(),
      sentenceId: this.sentence.id,
      sentenceText: this.sentence.text,
      targetWord: expectedWord,
      spokenAttempt,
      stumbleType,
      durationSeconds: Math.max(0.1, Math.round((Date.now() - this.wordStartTime) / 100) / 10),
      resolvedWithReRead: false,
      notes: note,
    });
  }

  private scheduleHesitationWatchdog(): void {
    this.clearHesitationTimer();
    const currentWord = this.cleanedWords[this.currentIndex];
    if (!currentWord) return;

    const vocabulary = this.sentence.vocabularyWords.find((word) => (
      normaliseWord(word.word) === currentWord
      || currentWord.includes(normaliseWord(word.word))
    ));

    if (!vocabulary || !this.onHesitationCallback) return;

    this.hesitationTimeoutId = setTimeout(() => {
      const stumble: ReadingStumble = {
        id: `stumble-${Date.now()}-${this.currentIndex}`,
        timestamp: Date.now(),
        sentenceId: this.sentence.id,
        sentenceText: this.sentence.text,
        targetWord: vocabulary.word,
        stumbleType: 'hesitation',
        durationSeconds: Math.round((Date.now() - this.wordStartTime) / 100) / 10,
        resolvedWithReRead: false,
        notes: `Hesitated for more than ${this.hesitationThresholdMs / 1000}s on "${vocabulary.word}".`,
      };
      this.onHesitationCallback?.(vocabulary, stumble);
    }, this.hesitationThresholdMs);
  }

  public processSpokenWords(spokenWords: string[]): FluencyMatchResult {
    if (spokenWords.length === 0 || this.currentIndex >= this.words.length) {
      return this.getStatus();
    }

    for (const spokenWord of spokenWords) {
      const expectedWord = this.cleanedWords[this.currentIndex];
      if (!expectedWord) break;

      if (areWordsSimilar(spokenWord, expectedWord)) {
        this.currentIndex += 1;
        this.wordStartTime = Date.now();
        this.scheduleHesitationWatchdog();
        continue;
      }

      const nextExpectedWord = this.cleanedWords[this.currentIndex + 1];
      if (nextExpectedWord && areWordsSimilar(spokenWord, nextExpectedWord)) {
        this.reportMismatch(
          expectedWord,
          '[skipped]',
          'syntax_stall',
          `Skipped expected word "${this.words[this.currentIndex]}" before continuing.`,
        );
        this.currentIndex += 2;
        this.wordStartTime = Date.now();
        this.scheduleHesitationWatchdog();
        continue;
      }

      this.reportMismatch(
        expectedWord,
        spokenWord,
        'mispronunciation',
        `Recognised "${spokenWord}" while expecting "${this.words[this.currentIndex]}".`,
      );
    }

    if (this.currentIndex >= this.words.length) {
      this.clearHesitationTimer();
    }

    return this.getStatus();
  }

  public advanceManualWord(): FluencyMatchResult {
    if (this.currentIndex < this.words.length) {
      this.reportMismatch(
        this.cleanedWords[this.currentIndex],
        '[manual advance]',
        'syntax_stall',
        `Advanced past "${this.words[this.currentIndex]}" without a recognised reading attempt.`,
      );
      this.currentIndex += 1;
      this.wordStartTime = Date.now();
      this.scheduleHesitationWatchdog();
    }

    if (this.currentIndex >= this.words.length) {
      this.clearHesitationTimer();
    }

    return this.getStatus();
  }

  public markRemainingWordsAsSkipped(): FluencyMatchResult {
    while (this.currentIndex < this.words.length) {
      this.reportMismatch(
        this.cleanedWords[this.currentIndex],
        '[manual sentence advance]',
        'syntax_stall',
        `Advanced past \"${this.words[this.currentIndex]}\" without a recognised reading attempt.`,
      );
      this.currentIndex += 1;
    }
    this.clearHesitationTimer();
    return this.getStatus();
  }

  public forceTriggerStumble(vocabularyWord?: VocabularyWord): ReadingStumble {
    this.clearHesitationTimer();
    const vocabulary = vocabularyWord ?? this.vocabularyFor(this.cleanedWords[this.currentIndex] || 'word');
    const stumble: ReadingStumble = {
      id: `stumble-${Date.now()}-${this.currentIndex}`,
      timestamp: Date.now(),
      sentenceId: this.sentence.id,
      sentenceText: this.sentence.text,
      targetWord: vocabulary.word,
      stumbleType: 'mispronunciation',
      durationSeconds: Math.max(0.1, Math.round((Date.now() - this.wordStartTime) / 100) / 10),
      resolvedWithReRead: false,
      notes: `Manual pronunciation check for "${vocabulary.word}".`,
    };

    this.onHesitationCallback?.(vocabulary, stumble);
    return stumble;
  }

  public getStatus(): FluencyMatchResult {
    const currentWord = this.cleanedWords[this.currentIndex] || '';
    const vocabulary = this.sentence.vocabularyWords.find((word) => (
      normaliseWord(word.word) === currentWord
      || currentWord.includes(normaliseWord(word.word))
    ));

    return {
      currentWordIndex: this.currentIndex,
      matchedWordsCount: this.currentIndex,
      isSentenceComplete: this.currentIndex >= this.words.length,
      activeWord: this.words[this.currentIndex] || '',
      isTargetVocab: Boolean(vocabulary),
      activeVocabData: vocabulary,
    };
  }

  public destroy(): void {
    this.clearHesitationTimer();
  }
}
