import { beforeEach, describe, expect, it } from "vitest";
import { FakeAudioContext } from "../test/fake-audio-context";
import { AudioService } from "./audio.service";

function createService() {
    const context = new FakeAudioContext();
    const service = new AudioService(() => context as unknown as AudioContext);
    return { service, context };
}

const SOUNDS = ["playX", "playO", "playWin", "playLose", "playDraw"] as const;

beforeEach(() => {
    FakeAudioContext.instances = [];
});

describe("AudioService", () => {
    it.each(SOUNDS)("%s synthesizes at least one tone", (sound) => {
        const { service, context } = createService();

        service[sound]();

        expect(context.oscillators.length).toBeGreaterThan(0);
    });

    it("gives each effect a distinct sound", () => {
        const signatures = SOUNDS.map((sound) => {
            const { service, context } = createService();
            service[sound]();
            return JSON.stringify(
                context.oscillators.map((o) => [o.type, o.frequency.setValueAtTime.mock.calls[0]?.[0]])
            );
        });

        expect(new Set(signatures).size).toBe(SOUNDS.length);
    });

    it("plays nothing while muted and resumes after unmuting", () => {
        const { service, context } = createService();

        service.setMuted(true);
        SOUNDS.forEach((sound) => service[sound]());
        expect(context.oscillators).toHaveLength(0);

        service.setMuted(false);
        service.playX();
        expect(context.oscillators.length).toBeGreaterThan(0);
    });

    it("starts unmuted", () => {
        expect(new AudioService(() => null).isMuted).toBe(false);
    });

    it("creates the audio context lazily and only once", () => {
        let created = 0;
        const service = new AudioService(() => {
            created++;
            return new FakeAudioContext() as unknown as AudioContext;
        });

        expect(created).toBe(0);
        service.playX();
        service.playO();
        expect(created).toBe(1);
    });

    it("resumes a suspended context", () => {
        const { service, context } = createService();
        context.state = "suspended";

        service.playX();

        expect(context.resume).toHaveBeenCalled();
    });

    it("does nothing when Web Audio is unavailable", () => {
        const service = new AudioService(() => null);
        expect(() => SOUNDS.forEach((sound) => service[sound]())).not.toThrow();
    });

    it("never throws when the audio backend fails", () => {
        const service = new AudioService(() => {
            throw new Error("audio backend failed");
        });
        expect(() => service.playWin()).not.toThrow();
    });
});
