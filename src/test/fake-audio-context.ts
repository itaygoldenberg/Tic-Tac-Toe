import { vi } from "vitest";

function fakeParam() {
    return {
        value: 0,
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
    };
}

/** Minimal stand-in for the Web Audio API (jsdom has none); records created oscillators. */
export class FakeAudioContext {
    static instances: FakeAudioContext[] = [];

    state: AudioContextState = "running";
    currentTime = 0;
    destination = {};
    oscillators: Array<{ type: OscillatorType; frequency: ReturnType<typeof fakeParam> }> = [];
    resume = vi.fn(() => {
        this.state = "running";
        return Promise.resolve();
    });

    constructor() {
        FakeAudioContext.instances.push(this);
    }

    createOscillator() {
        const oscillator = {
            type: "sine" as OscillatorType,
            frequency: fakeParam(),
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn()
        };
        this.oscillators.push(oscillator);
        return oscillator;
    }

    createGain() {
        return { gain: fakeParam(), connect: vi.fn() };
    }
}

export function totalOscillators(): number {
    return FakeAudioContext.instances.reduce((sum, context) => sum + context.oscillators.length, 0);
}

export function resetFakeAudio(): void {
    for (const context of FakeAudioContext.instances) context.oscillators = [];
}
