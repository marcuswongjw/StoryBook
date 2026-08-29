// Speech Recognition Service with real-time streaming and fallback support

export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
  confidence: number;
  words: string[];
}

export type SpeechStatus = 'idle' | 'listening' | 'processing' | 'paused' | 'error' | 'unsupported';

export class VoiceListener {
  private recognition: any = null;
  private isListening = false;
  private onResultCallback?: (result: SpeechRecognitionResultPayload) => void;
  private onStatusChangeCallback?: (status: SpeechStatus, error?: string) => void;
  private simulatedTimer?: any;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition;

    if (SpeechRecognitionAPI) {
      try {
        this.recognition = new SpeechRecognitionAPI();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 3;

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const combined = (finalTranscript || interimTranscript).trim();
          const cleanWords = combined
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .split(/\s+/)
            .filter(Boolean);

          if (this.onResultCallback && combined.length > 0) {
            this.onResultCallback({
              transcript: combined,
              isFinal: !!finalTranscript,
              confidence: event.results[0]?.[0]?.confidence || 0.9,
              words: cleanWords,
            });
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('[VoiceListener] Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            this.onStatusChangeCallback?.('error', 'Microphone permission denied.');
          } else if (event.error === 'no-speech') {
            // Normal silence timeout, keep listening
          } else {
            this.onStatusChangeCallback?.('error', `Speech error: ${event.error}`);
          }
        };

        this.recognition.onend = () => {
          if (this.isListening) {
            // Auto restart continuous listening if still active
            try {
              this.recognition.start();
            } catch (err) {
              // Ignore if already started
            }
          } else {
            this.onStatusChangeCallback?.('idle');
          }
        };
      } catch (err) {
        console.error('[VoiceListener] Failed to initialize SpeechRecognition:', err);
        this.recognition = null;
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public setCallbacks(
    onResult: (result: SpeechRecognitionResultPayload) => void,
    onStatusChange?: (status: SpeechStatus, error?: string) => void
  ) {
    this.onResultCallback = onResult;
    this.onStatusChangeCallback = onStatusChange;
  }

  public start() {
    if (this.isListening) return;

    if (this.recognition) {
      try {
        this.recognition.start();
        this.isListening = true;
        this.onStatusChangeCallback?.('listening');
      } catch (e) {
        console.warn('[VoiceListener] Start error, retrying:', e);
        this.recognition.stop();
        setTimeout(() => {
          try {
            this.recognition.start();
            this.isListening = true;
            this.onStatusChangeCallback?.('listening');
          } catch (e2) {
            this.startSimulation();
          }
        }, 150);
      }
    } else {
      this.startSimulation();
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    if (this.simulatedTimer) {
      clearInterval(this.simulatedTimer);
      this.simulatedTimer = undefined;
    }
    this.onStatusChangeCallback?.('idle');
  }

  public pause() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.onStatusChangeCallback?.('paused');
  }

  public resume() {
    if (this.isListening) {
      if (this.recognition) {
        try {
          this.recognition.start();
          this.onStatusChangeCallback?.('listening');
        } catch (e) {}
      }
    }
  }

  // Simulation fallback for environments without microphone access
  public startSimulation(targetSentenceWords?: string[]) {
    this.isListening = true;
    this.onStatusChangeCallback?.('listening');

    if (!targetSentenceWords || targetSentenceWords.length === 0) return;

    let index = 0;
    const accumulated: string[] = [];

    this.simulatedTimer = setInterval(() => {
      if (index < targetSentenceWords.length) {
        accumulated.push(targetSentenceWords[index]);
        index++;
        if (this.onResultCallback) {
          this.onResultCallback({
            transcript: accumulated.join(' '),
            isFinal: index === targetSentenceWords.length,
            confidence: 0.95,
            words: [...accumulated],
          });
        }
      } else {
        clearInterval(this.simulatedTimer);
      }
    }, 900);
  }

  public feedSimulatedWord(word: string) {
    if (this.onResultCallback) {
      const clean = word.toLowerCase().replace(/[^\w\s-]/g, '');
      this.onResultCallback({
        transcript: word,
        isFinal: false,
        confidence: 0.95,
        words: [clean],
      });
    }
  }
}

export const voiceListener = new VoiceListener();
