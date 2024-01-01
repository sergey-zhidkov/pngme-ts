import type { ChunkTypeArray } from "./types";
import { isAllASCII, isNumeric } from "./utils";

export class ChunkType {
    private data: ChunkTypeArray;

    private constructor(bytes: ChunkTypeArray) {
        this.data = bytes;
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
        return new TextDecoder("utf-8").decode(this.data);
    }

    static tryFrom(bytes: ChunkTypeArray): ChunkType {
        return new ChunkType(bytes);
    }

    static fromString(str: string): ChunkType {
        if ([...str].length !== 4) {
            throw new Error("String should be 4 characters long");
        }

        for (const character of str) {
            if (isNumeric(character)) {
                throw new Error("Numeric characters are not allowed");
            }
            if (!isAllASCII(character)) {
                throw new Error("Only ASCII characters are allowed");
            }
        }

        const bytes = new TextEncoder("utf-8").encode(str) as ChunkTypeArray;
        return new ChunkType(bytes);
    }
}
