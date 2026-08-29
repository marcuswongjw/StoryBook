export type AdventureCategory = 'singapore' | 'sailing' | 'mountaineering' | 'oceanic' | 'polar' | 'custom';

export interface VocabularyWord {
  word: string;
  phonetic: string;
  syllableBreakdown: string; // e.g. "GUN-wull" or "mon-SOON"
  partOfSpeech: string;
  definition: string;
  tacticalAnalogy: string; // Vivid, real-world sailing / extreme sport analogy
  etymologyAnchor?: string;
  sampleUsage: string;
}

export interface SentenceData {
  id: string;
  text: string;
  vocabularyWords: VocabularyWord[];
  tacticalContext?: string;
  complexSyntaxNote?: string;
}

export interface DebriefPrompt {
  id: string;
  category: 'tactical_decision' | 'character_motive' | 'strategic_prediction' | 'environmental_risk';
  categoryLabel: string;
  question: string;
  mentorContext: string;
  probingQuestions: string[];
  keyTacticalInsights: string[];
}

export interface Passage {
  id: string;
  title: string;
  subtitle: string;
  category: AdventureCategory;
  lexileLevel: string; // e.g., "780L (Grade 6)"
  estimatedReadingTimeMinutes: number;
  missionBrief: string;
  coverGradient: string;
  accentColor: string;
  sentences: SentenceData[];
  debriefPrompts: DebriefPrompt[];
  isCustom?: boolean;
}

export type StumbleType = 'hesitation' | 'mispronunciation' | 'syntax_stall';

export interface ReadingStumble {
  id: string;
  timestamp: number;
  sentenceId: string;
  sentenceText: string;
  targetWord?: string;
  spokenAttempt?: string;
  stumbleType: StumbleType;
  durationSeconds: number;
  resolvedWithReRead: boolean;
  notes?: string;
}

export interface DebriefTurn {
  id: string;
  promptId: string;
  category: string;
  question: string;
  studentResponse: string;
  mentorFeedback: string;
  timestamp: number;
}

export interface SessionTelemetry {
  sessionId: string;
  timestamp: number;
  passageId: string;
  passageTitle: string;
  passageCategory: AdventureCategory;
  durationSeconds: number;
  wordsRead: number;
  effectiveWpm: number;
  smoothnessScore: number; // 0 - 100
  stumbles: ReadingStumble[];
  debriefTurns: DebriefTurn[];
  parentInsights: {
    bottleneckVocab: Array<{ word: string; count: number; sentence: string }>;
    syntaxNotes: string[];
    dinnerTablePrompt: string;
    tacticalTakeaway: string;
  };
}

export interface TutorSettings {
  voiceSpeed: number;
  voicePitch: number;
  soundEffectsVolume: number;
  ambientVolume: number;
  ambientSound: 'ocean' | 'mountain' | 'polar' | 'none';
  sessionTargetMinutes: number;
  theme: 'nautical' | 'amber' | 'arctic';
  hesitationThresholdSeconds: number; // default 4.0s for Grade 6
}
