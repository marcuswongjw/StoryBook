import { SessionTelemetry, Passage, TutorSettings, ReadingStumble, DebriefTurn } from '../types';
import { INITIAL_PASSAGES } from '../data/passages';

const SESSIONS_KEY = 'storybook_sessions_v1';
const PASSAGES_KEY = 'storybook_custom_passages_v1';
const SETTINGS_KEY = 'storybook_settings_v1';

export const DEFAULT_SETTINGS: TutorSettings = {
  voiceSpeed: 1.0,
  voicePitch: 1.05,
  soundEffectsVolume: 0.8,
  ambientVolume: 0.2,
  ambientSound: 'ocean',
  sessionTargetMinutes: 20,
  theme: 'nautical',
  hesitationThresholdSeconds: 4.0,
};

export function loadSessions(): SessionTelemetry[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed: SessionTelemetry[] = JSON.parse(raw);
    return parsed.sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error('Failed to load sessions from storage:', e);
    return [];
  }
}

export function saveSession(session: SessionTelemetry): void {
  try {
    const existing = loadSessions();
    const filtered = existing.filter((s) => s.sessionId !== session.sessionId);
    const updated = [session, ...filtered];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

export function deleteSession(sessionId: string): void {
  try {
    const existing = loadSessions();
    const updated = existing.filter((s) => s.sessionId !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete session:', e);
  }
}

export function updateOrAddTelemetrySession(
  sessionId: string,
  passage: Passage,
  durationSeconds: number,
  wordsRead: number,
  stumbles: ReadingStumble[],
  debriefTurns: DebriefTurn[] = [],
  isCompleted = false
): SessionTelemetry {
  const minutes = Math.max(0.1, durationSeconds / 60);
  const effectiveWpm = Math.round(wordsRead / minutes);
  const stumblePenalty = Math.min(40, stumbles.length * 7);
  const smoothnessScore = Math.max(60, 100 - stumblePenalty);

  const vocabBottlenecks = stumbles
    .filter((s) => s.targetWord)
    .map((s) => ({
      word: s.targetWord!,
      count: 1,
      sentence: s.sentenceText,
    }));

  const syntaxNotes = stumbles.length > 0
    ? stumbles.map((s) => `Decoded phrase hurdle: "${s.sentenceText.slice(0, 48)}..."`)
    : ['Navigated nautical transitions and compound sentences with smooth flow.'];

  const session: SessionTelemetry = {
    sessionId,
    timestamp: Date.now(),
    passageId: passage.id,
    passageTitle: passage.title,
    passageCategory: passage.category,
    durationSeconds,
    wordsRead,
    effectiveWpm,
    smoothnessScore,
    stumbles,
    debriefTurns,
    status: isCompleted ? 'completed' : 'in_progress',
    parentInsights: {
      bottleneckVocab: vocabBottlenecks,
      syntaxNotes,
      dinnerTablePrompt: `Ask Mikaela: "What was the most challenging tactical decision in '${passage.title}' and how did the skipper handle it?"`,
      tacticalTakeaway: `Reinforce vocabulary like "${vocabBottlenecks.map((v) => v.word).join(', ') || 'nautical flow'}" during casual conversation.`,
    },
  };

  saveSession(session);
  return session;
}

export function loadPassages(): Passage[] {
  try {
    const raw = localStorage.getItem(PASSAGES_KEY);
    const customPassages: Passage[] = raw ? JSON.parse(raw) : [];
    return [...INITIAL_PASSAGES, ...customPassages];
  } catch (e) {
    console.error('Failed to load passages:', e);
    return INITIAL_PASSAGES;
  }
}

export function saveCustomPassage(passage: Passage): void {
  try {
    const raw = localStorage.getItem(PASSAGES_KEY);
    const customPassages: Passage[] = raw ? JSON.parse(raw) : [];
    const updated = [passage, ...customPassages.filter((p) => p.id !== passage.id)];
    localStorage.setItem(PASSAGES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom passage:', e);
  }
}

export function loadSettings(): TutorSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TutorSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function generateParentMarkdownReport(session: SessionTelemetry): string {
  const dateStr = new Date(session.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const durationMin = Math.round((session.durationSeconds / 60) * 10) / 10;

  let md = `# Mikaela's Tactical Reading Diagnostic Report\n\n`;
  md += `**Session Date:** ${dateStr}\n`;
  md += `**Passage Title:** ${session.passageTitle} (${session.passageCategory.toUpperCase()})\n`;
  md += `**Status:** ${session.status === 'completed' ? 'Mission Completed' : 'Session Logged'} | **Session Duration:** ${durationMin} min | **Words Read:** ${session.wordsRead} | **Effective WPM:** ${session.effectiveWpm} | **Fluency Score:** ${session.smoothnessScore}%\n\n`;

  md += `## 1. Vocabulary Bottlenecks & Interventions\n`;
  if (session.stumbles.length === 0) {
    md += `*Flawless delivery! No significant vocabulary hesitations or pronunciation bottlenecks recorded.*\n\n`;
  } else {
    session.stumbles.forEach((stumble, idx) => {
      md += `### ${idx + 1}. Word: **${stumble.targetWord || 'Sentence Stumble'}**\n`;
      md += `- **Issue Type:** ${stumble.stumbleType.replace('_', ' ').toUpperCase()} (${stumble.durationSeconds}s duration)\n`;
      md += `- **Sentence Context:** "${stumble.sentenceText}"\n`;
      md += `- **Resolution:** ${stumble.resolvedWithReRead ? 'Resolved with smooth full-sentence re-read' : 'Flagged for follow-up'}\n\n`;
    });
  }

  md += `## 2. Syntax & Sentence Structure Observations\n`;
  if (session.parentInsights.syntaxNotes.length > 0) {
    session.parentInsights.syntaxNotes.forEach((note) => {
      md += `- ${note}\n`;
    });
  } else {
    md += `- Handled compound and complex sentence transitions smoothly.\n`;
  }
  md += `\n`;

  md += `## 3. Two-Way Tactical Debrief & Comprehension Notes\n`;
  if (session.debriefTurns.length > 0) {
    session.debriefTurns.forEach((turn, idx) => {
      md += `**Exchange ${idx + 1} (${turn.category}):**\n`;
      md += `*Prompt:* "${turn.question}"\n\n`;
      md += `*Mikaela's Insight:* "${turn.studentResponse}"\n\n`;
      md += `*Mentor Reflection:* ${turn.mentorFeedback}\n\n`;
    });
  } else {
    md += `*Passage read aloud; debrief stage logged.*\n\n`;
  }

  md += `## 4. Dinner-Table & Car-Ride Coaching Sparks for Dad\n`;
  md += `> ${session.parentInsights.dinnerTablePrompt}\n\n`;
  md += `**Tactical Concept Takeaway:** ${session.parentInsights.tacticalTakeaway}\n`;

  return md;
}
