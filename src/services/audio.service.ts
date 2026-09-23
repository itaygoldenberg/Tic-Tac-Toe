interface Tone {
    frequency: number;
    /** Glide to this frequency over the tone's duration. */
    endFrequency?: number;
    duration: number;
    /** Seconds after the sound starts. */
    offset?: number;
    type?: OscillatorType;
    volume?: number;
}

const MASTER_VOLUME = 0.18;
const ATTACK_SECONDS = 0.01;
const SILENCE = 0.0001;
/** Result sounds start slightly after the move sound so the two do not clash. */
const RESULT_DELAY_SECONDS = 0.18;

const X_SOUND: Tone[] = [{ frequency: 520, endFrequency: 660, duration: 0.12, type: "square", volume: 0.35 }];

const O_SOUND: Tone[] = [{ frequency: 330, endFrequency: 440, duration: 0.14, type: "sine", volume: 0.8 }];

const WIN_SOUND: Tone[] = [523.25, 659.25, 783.99, 1046.5].map((frequency, index) => ({
    frequency,
    duration: index === 3 ? 0.32 : 0.13,
    offset: index * 0.11,
    type: "triangle" as const,
    volume: 0.8
}));

const LOSE_SOUND: Tone[] = [392, 329.63, 261.63].map((frequency, index) => ({
    frequency,
    endFrequency: index === 2 ? 196 : undefined,
    duration: index === 2 ? 0.4 : 0.16,
    offset: index * 0.16,
    type: "sawtooth" as const,
    volume: 0.3
}));

const DRAW_SOUND: Tone[] = [
    { frequency: 440, duration: 0.14, type: "triangle", volume: 0.7 },
    { frequency: 440, duration: 0.22, offset: 0.18, type: "triangle", volume: 0.7 }
];

export type AudioContextFactory = () => AudioContext | null;

function createBrowserAudioContext(): AudioContext | null {
    if (typeof AudioContext === "undefined") return null;
    return new AudioContext();
}

/**
 * Synthesized sound effects via the Web Audio API. Audio is an enhancement only:
 * every failure is swallowed so the game keeps working without sound.
 * Mute state lives in memory only and resets to "on" on reload.
 */
export class AudioService {
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private muted = false;
    private readonly createContext: AudioContextFactory;

    constructor(createContext: AudioContextFactory = createBrowserAudioContext) {
        this.createContext = createContext;
    }

    get isMuted(): boolean {
        return this.muted;
    }

    setMuted(muted: boolean): void {
        this.muted = muted;
    }

    playX(): void {
        this.play(X_SOUND);
    }

    playO(): void {
        this.play(O_SOUND);
    }

    playWin(): void {
        this.play(WIN_SOUND, RESULT_DELAY_SECONDS);
    }

    playLose(): void {
        this.play(LOSE_SOUND, RESULT_DELAY_SECONDS);
    }

    playDraw(): void {
        this.play(DRAW_SOUND, RESULT_DELAY_SECONDS);
    }

    private play(tones: Tone[], delaySeconds = 0): void {
        if (this.muted) return;

        try {
            const context = this.getContext();
            if (!context || !this.masterGain) return;

            if (context.state === "suspended") void context.resume().catch(() => {});

            const start = context.currentTime + delaySeconds;
            for (const tone of tones) this.scheduleTone(context, this.masterGain, tone, start);
        } catch {
            // Audio must never break the game.
        }
    }

    // Created lazily: the first sound always follows a user click, which satisfies autoplay policy.
    private getContext(): AudioContext | null {
        if (this.context) return this.context;

        const context = this.createContext();
        if (!context) return null;

        const masterGain = context.createGain();
        masterGain.gain.value = MASTER_VOLUME;
        masterGain.connect(context.destination);

        this.context = context;
        this.masterGain = masterGain;
        return context;
    }

    private scheduleTone(context: AudioContext, output: AudioNode, tone: Tone, soundStart: number): void {
        const start = soundStart + (tone.offset ?? 0);
        const end = start + tone.duration;

        const oscillator = context.createOscillator();
        oscillator.type = tone.type ?? "sine";
        oscillator.frequency.setValueAtTime(tone.frequency, start);
        if (tone.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(tone.endFrequency, end);

        const envelope = context.createGain();
        envelope.gain.setValueAtTime(SILENCE, start);
        envelope.gain.linearRampToValueAtTime(tone.volume ?? 1, start + ATTACK_SECONDS);
        envelope.gain.exponentialRampToValueAtTime(SILENCE, end);

        oscillator.connect(envelope);
        envelope.connect(output);
        oscillator.start(start);
        oscillator.stop(end + 0.02);
    }
}

export const audioService = new AudioService();
