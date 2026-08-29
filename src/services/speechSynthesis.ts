// Speech Synthesis (TTS) Service for the Co-Skipper / Expedition Mentor

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
  onEnd?: () => void;
  onStart?: () => void;
}

class MentorVoiceService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Prioritize natural English voices
    const preferred =
      this.voices.find((v) => v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Victoria')) ||
      this.voices.find((v) => v.name.includes('Google US English') || v.name.includes('Natural') || v.name.includes('Daniel')) ||
      this.voices.find((v) => v.lang.startsWith('en-US')) ||
      this.voices.find((v) => v.lang.startsWith('en')) ||
      this.voices[0];

    this.preferredVoice = preferred || null;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public speak(text: string, options: SpeakOptions = {}) {
    if (!this.synth) {
      options.onEnd?.();
      return;
    }

    // Cancel any ongoing utterance to keep mentor voice immediate and crisp
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.preferredVoice;
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.05;
    utterance.volume = options.volume ?? 1.0;

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('[MentorVoiceService] TTS Utterance error:', e);
      options.onEnd?.();
    };

    this.synth.speak(utterance);
  }

  public speakWordUnpack(
    word: string,
    syllableBreakdown: string,
    tacticalAnalogy: string,
    onComplete?: () => void
  ) {
    const coachingScript = `${word}. Say it with me: ${syllableBreakdown.replace(/-/g, ' ')}. ${tacticalAnalogy}`;
    this.speak(coachingScript, {
      rate: 0.95,
      pitch: 1.05,
      onEnd: onComplete,
    });
  }

  public speakSentenceReReadPrompt(sentenceText: string, onComplete?: () => void) {
    const script = `Great! Now take the helm and read that full sentence smoothly: "${sentenceText}"`;
    this.speak(script, {
      rate: 1.0,
      pitch: 1.05,
      onEnd: onComplete,
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }
}

export const mentorVoice = new MentorVoiceService();
