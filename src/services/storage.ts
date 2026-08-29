import { DebriefTurn, Passage, ReadingStumble, SessionTelemetry, TutorSettings } from '../types';
import { INITIAL_PASSAGES } from '../data/passages';

const SESSIONS_KEY = 'storybook_sessions_v1';
const PASSAGES_KEY = 'storybook_custom_passages_v1';
const SETTINGS_KEY = 'storybook_settings_v1';
const TELEMETRY_API_URL = 'https://storyapi.marcusw.xyz/api/sessions';

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
    return parsed.sort((first, second) => second.timestamp - first.timestamp);
  } catch (error) {
    console.error('Failed to load sessions from local storage:', error);
    return [];
  }
}

function saveSessionsLocally(sessions: SessionTelemetry[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

async function requestTelemetry(path = '', init?: RequestInit): Promise<Response> {
  const response = await fetch(`${TELEMETRY_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Telemetry service returned ${response.status}`);
  }

  return response;
}

async function syncSessionToDashboard(session: SessionTelemetry): Promise<void> {
  try {
    await requestTelemetry('', {
      method: 'PUT',
      body: JSON.stringify(session),
    });
  } catch (error) {
    // Local storage keeps the reader usable during a temporary network outage.
    console.warn('Unable to sync telemetry to the parent dashboard:', error);
  }
}

export async function loadRemoteSessions(): Promise<SessionTelemetry[]> {
  try {
    const response = await requestTelemetry();
    const sessions = (await response.json()) as SessionTelemetry[];
    const sortedSessions = sessions.sort((first, second) => second.timestamp - first.timestamp);
    saveSessionsLocally(sortedSessions);
    return sortedSessions;
  } catch (error) {
    console.warn('Unable to load remote telemetry; using this device’s cached sessions:', error);
    return loadSessions();
  }
}

export function saveSession(session: SessionTelemetry): void {
  try {
    const existing = loadSessions();
    const updated = [session, ...existing.filter((stored) => stored.sessionId !== session.sessionId)];
    saveSessionsLocally(updated);
    void syncSessionToDashboard(session);
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export function deleteSession(sessionId: string): void {
  try {
    saveSessionsLocally(loadSessions().filter((session) => session.sessionId !== sessionId));
    void requestTelemetry(`/${encodeURIComponent(sessionId)}`, { method: 'DELETE' }).catch((error) => {
      console.warn('Unable to delete telemetry from the parent dashboard:', error);
    });
  } catch (error) {
    console.error('Failed to delete session:', error);
  }
}

export function updateOrAddTelemetrySession(
  sessionId: string,
  passage: Passage,
  durationSeconds: number,
  wordsRead: number,
  stumbles: ReadingStumble[],
  debriefTurns: DebriefTurn[] = [],
  isCompleted = false,
): SessionTelemetry {
  const minutes = Math.max(0.1, durationSeconds / 60);
  const effectiveWpm = Math.round(wordsRead / minutes);
  const stumblePenalty = Math.min(40, stumbles.length * 7);
  const smoothnessScore = Math.max(60, 100 - stumblePenalty);

  const vocabBottlenecks = stumbles
    .filter((stumble) => stumble.targetWord)
    .map((stumble) => ({
      word: stumble.targetWord!,
      count: 1,
      sentence: stumble.sentenceText,
    }));

  const syntaxNotes = stumbles.length > 0
    ? stumbles.map((stumble) => `Decoded phrase hurdle: "${stumble.sentenceText.slice(0, 48)}..."`)
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
      tacticalTakeaway: `Reinforce vocabulary like "${vocabBottlenecks.map((vocabulary) => vocabulary.word).join(', ') || 'nautical flow'}" during casual conversation.`,
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
  } catch (error) {
    console.error('Failed to load custom passages:', error);
    return INITIAL_PASSAGES;
  }
}

export function saveCustomPassage(passage: Passage): void {
  try {
    const raw = localStorage.getItem(PASSAGES_KEY);
    const customPassages: Passage[] = raw ? JSON.parse(raw) : [];
    saveSessionsLocally(loadSessions());
    localStorage.setItem(
      PASSAGES_KEY,
      JSON.stringify([passage, ...customPassages.filter((stored) => stored.id !== passage.id)]),
    );
  } catch (error) {
    console.error('Failed to save custom passage:', error);
  }
}

export function loadSettings(): TutorSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (error) {
    console.warn('Failed to load tutor settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TutorSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save tutor settings:', error);
  }
}

export function generateParentMarkdownReport(session: SessionTelemetry): string {
  const date = new Date(session.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const durationMinutes = Math.round((session.durationSeconds / 60) * 10) / 10;

  let markdown = `# Mikaela's Tactical Reading Diagnostic Report\n\n`;
  markdown += `**Session Date:** ${date}\n`;
  markdown += `**Passage Title:** ${session.passageTitle} (${session.passageCategory.toUpperCase()})\n`;
  markdown += `**Status:** ${session.status === 'completed' ? 'Mission Completed' : 'Session Logged'} | **Session Duration:** ${durationMinutes} min | **Words Read:** ${session.wordsRead} | **Effective WPM:** ${session.effectiveWpm} | **Fluency Score:** ${session.smoothnessScore}%\n\n`;

  markdown += `## 1. Vocabulary Bottlenecks & Interventions\n`;
  if (session.stumbles.length === 0) {
    markdown += `*Flawless delivery! No significant vocabulary hesitations or pronunciation bottlenecks recorded.*\n\n`;
  } else {
    session.stumbles.forEach((stumble, index) => {
      markdown += `### ${index + 1}. Word: **${stumble.targetWord || 'Sentence Stumble'}**\n`;
      markdown += `- **Issue Type:** ${stumble.stumbleType.replace('_', ' ').toUpperCase()} (${stumble.durationSeconds}s duration)\n`;
      markdown += `- **Sentence Context:** "${stumble.sentenceText}"\n`;
      markdown += `- **Resolution:** ${stumble.resolvedWithReRead ? 'Resolved with smooth full-sentence re-read' : 'Flagged for follow-up'}\n\n`;
    });
  }

  markdown += `## 2. Syntax & Sentence Structure Observations\n`;
  session.parentInsights.syntaxNotes.forEach((note) => {
    markdown += `- ${note}\n`;
  });
  markdown += `\n## 3. Two-Way Tactical Debrief & Comprehension Notes\n`;
  if (session.debriefTurns.length === 0) {
    markdown += `*Passage read aloud; debrief stage logged.*\n\n`;
  } else {
    session.debriefTurns.forEach((turn, index) => {
      markdown += `**Exchange ${index + 1} (${turn.category}):**\n`;
      markdown += `*Prompt:* "${turn.question}"\n\n`;
      markdown += `*Mikaela's Insight:* "${turn.studentResponse}"\n\n`;
      markdown += `*Mentor Reflection:* ${turn.mentorFeedback}\n\n`;
    });
  }

  markdown += `## 4. Dinner-Table & Car-Ride Coaching Sparks for Dad\n`;
  markdown += `> ${session.parentInsights.dinnerTablePrompt}\n\n`;
  markdown += `**Tactical Concept Takeaway:** ${session.parentInsights.tacticalTakeaway}\n`;
  return markdown;
}
