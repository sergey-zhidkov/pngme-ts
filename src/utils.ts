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

export function crc(buffer: Buffer): number {
    return CrcCalculator.crc32(buffer);
}
