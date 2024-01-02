import type { ChunkTypeArray } from "./types";
import { isAllASCII, isNumeric, stringToUint8Array, uint8ArrayToString } from "./utils";

export class ChunkType {
    private data: ChunkTypeArray;

    private constructor(bytes: Uint8Array) {
        this.data = new Uint8Array(bytes) as ChunkTypeArray;
    }

    bytes() {
        return this.data;
    }

    isCritical() {
        const firstCharacter = String.fromCharCode(this.data[0]);
        return firstCharacter.toUpperCase() === firstCharacter;
    }

    isPublic() {
        const secondCharacter = String.fromCharCode(this.data[1]);
        return secondCharacter.toUpperCase() === secondCharacter;
    }

    isReservedBitValid() {
        const thirdCharacter = String.fromCharCode(this.data[2]);
        return thirdCharacter.toUpperCase() === thirdCharacter;
    }

    isSafeToCopy() {
        const forthCharacter = String.fromCharCode(this.data[3]);
        return forthCharacter.toLowerCase() === forthCharacter;
    }

    isValid() {
        const text = this.toString();
        return this.isReservedBitValid() && isAllASCII(text);
    }

    toString() {
        return uint8ArrayToString(this.data);
    }

    static tryFrom(bytes: Uint8Array): ChunkType {
        if (bytes.length !== 4) {
            throw new Error("ChunkType should be 4 characters long");
        }
        return new ChunkType(bytes);
    }

    static fromString(str: string): ChunkType {
        if ([...str].length !== 4) {
            throw new Error("ChunkType should be 4 characters long");
        }

        for (const character of str) {
            if (isNumeric(character)) {
                throw new Error("Numeric characters are not allowed");
            }
            if (!isAllASCII(character)) {
                throw new Error("Only ASCII characters are allowed");
            }
        }

        const bytes = stringToUint8Array(str) as ChunkTypeArray;
        return new ChunkType(bytes);
    }
}
