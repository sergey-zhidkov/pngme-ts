import { describe, test, expect } from "bun:test";
import { ChunkType } from "./chunk-type";
import type { ChunkTypeArray } from "./types";
import { createFourElementUint8Array } from "./utils";
import { Chunk } from "./chunk";

describe.only("Chunk", () => {
    test("from bytes", () => {
        const chunkType = ChunkType.fromString("RuSt");
        const message = "This is where your secret message will be!";
        const chunk = new Chunk(chunkType, message);

        expect(chunk.length).toBe(42);
        expect(chunk.crc).toBe(2882656334);
    });
});
