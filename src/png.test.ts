import { describe, test, expect } from "bun:test";
import { ChunkType } from "./chunk-type";
import { stringToUint8Array } from "./utils";
import { Chunk } from "./chunk";
import { concatArrayBuffers } from "bun";
import { Png } from "./png";

describe("Png", () => {
    function testingChunks(): Chunk[] {
        const chunks = [];

        chunks.push(chunkFromStrings("FrSt", "I am the first chunk"));
        chunks.push(chunkFromStrings("miDl", "I am another chunk"));
        chunks.push(chunkFromStrings("LASt", "I am the last chunk"));

        return chunks;
    }

    function chunkFromStrings(chunkTypeStr: string, data: string): Chunk {
        const chunkType = ChunkType.fromString(chunkTypeStr);
        const bytes = stringToUint8Array(data);

        return new Chunk({ chunkType, data: bytes });
    }

    function testingPng(): Png {
        const chunks = testingChunks();
        return Png.fromChunks(chunks);
    }

    test("from chunks", () => {
        const chunks = testingChunks();
        const png = Png.fromChunks(chunks);

        expect(png.chunks.length).toBe(3);
    });

    test("valid fromBytes", () => {
        const chunks = testingChunks();
        const chunkBytes = concatArrayBuffers(chunks.map((c) => c.bytes()));
        const allBytes = concatArrayBuffers([Png.STANDARD_HEADER, chunkBytes]);

        const png = Png.tryFrom(new Uint8Array(allBytes));

        expect(png.chunks.length).toBe(3);
    });
});
