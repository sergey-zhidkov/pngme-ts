import { describe, test, expect } from "bun:test";
import { ChunkType } from "./chunk-type";
import type { ChunkTypeArray } from "./types";
import { createFourElementUint8Array } from "./utils";

describe("ChunkType", () => {
    function arraysEqual(a1: Uint8Array, a2: Uint8Array) {
        if (a1.byteLength !== a2.byteLength) {
            return false;
        }

        for (let i = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }

        return true;
    }

    test("from bytes", () => {
        const expected = createFourElementUint8Array([82, 117, 83, 116]);
        const actual = ChunkType.tryFrom(expected);

        expect(arraysEqual(expected, actual.bytes())).toBeTrue();
    });

    test("from string", () => {
        const bytes = createFourElementUint8Array([82, 117, 83, 116]);
        const expected = ChunkType.tryFrom(bytes);
        const actual = ChunkType.fromString("RuSt");

        expect(arraysEqual(expected.bytes(), actual.bytes())).toBeTrue();
    });

    test("isCritical", () => {
        const chunk = ChunkType.fromString("RuSt");

        expect(chunk.isCritical()).toBeTrue();
    });
    test("is not critical", () => {
        const chunk = ChunkType.fromString("ruSt");

        expect(chunk.isCritical()).toBeFalse();
    });

    test("isPublic", () => {
        const chunk = ChunkType.fromString("RUSt");

        expect(chunk.isPublic()).toBeTrue();
    });
    test("is not public", () => {
        const chunk = ChunkType.fromString("RuSt");

        expect(chunk.isPublic()).toBeFalse();
    });

    test("isReservedBitValid", () => {
        const chunk = ChunkType.fromString("RuSt");

        expect(chunk.isReservedBitValid()).toBeTrue();
    });
    test("is not reserved bit valid", () => {
        const chunk = ChunkType.fromString("Rust");

        expect(chunk.isReservedBitValid()).toBeFalse();
    });

    test("isSafeToCopy", () => {
        const chunk = ChunkType.fromString("RuSt");

        expect(chunk.isSafeToCopy()).toBeTrue();
    });
    test("is unsafe to copy", () => {
        const chunk = ChunkType.fromString("RuST");

        expect(chunk.isSafeToCopy()).toBeFalse();
    });

    test("chunk is valid", () => {
        const chunk = ChunkType.fromString("RuSt");

        expect(chunk.isValid()).toBeTrue();
    });
    test("chunk is invalid", () => {
        const chunk = ChunkType.fromString("Rust");

        expect(chunk.isValid()).toBeFalse();
    });
    test("chunk is invalid, throw exception", () => {
        expect(() => ChunkType.fromString("Ru1t")).toThrow(Error);
    });

    test("toString", () => {
        expect(ChunkType.fromString("RuSt").toString()).toBe("RuSt");
    });
});
