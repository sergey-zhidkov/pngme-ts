import { CrcCalculator } from "./crc";
import type { ChunkTypeArray } from "./types";

export function createFourElementUint8Array(values: number[]): ChunkTypeArray {
    const result = new Uint8Array(values) as ChunkTypeArray;
    if (result.length !== 4) {
        throw new Error("Array length must be 4");
    }

    return result;
}

export function isNumeric(value: string): boolean {
    return !isNaN(Number(value));
}

export function isAllASCII(str: string): boolean {
    for (const character of str) {
        if (character.charCodeAt(0) > 127) {
            return false;
        }
    }

    return true;
}

export function crc32(buffer: Buffer): number {
    return CrcCalculator.crc32(buffer);
}

export function stringToUint8Array(str: string): Uint8Array {
    return new TextEncoder("utf-8").encode(str);
}

export function uint8ArrayToString(data: Uint8Array): string {
    return new TextDecoder("utf-8").decode(data);
}

export function number32ToUint8Array(num: number): Uint8Array {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, num, false);

    return new Uint8Array(buffer);
}

export function arraysEqual(a1: Uint8Array, a2: Uint8Array) {
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
