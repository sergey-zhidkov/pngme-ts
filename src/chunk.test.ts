import { describe, test, expect } from "bun:test";
import { ChunkType } from "./chunk-type";
import { number32ToUint8Array, stringToUint8Array } from "./utils";
import { Chunk } from "./chunk";
import { concatArrayBuffers } from "bun";

describe("Chunk", () => {
    function testingChunk() {
        const dataLength = 42;
        const chunkType = "RuSt";
        const message = "This is where your secret message will be!";
        const crc = 2882656334;

        const lengthBytes = number32ToUint8Array(dataLength);
        const chunkTypeBytes = stringToUint8Array(chunkType);
        const messageBytes = stringToUint8Array(message);
        const crcBytes = number32ToUint8Array(crc);
        const combinedBytesBuffer = concatArrayBuffers([lengthBytes, chunkTypeBytes, messageBytes, crcBytes]);

        return Chunk.tryFrom(new Uint8Array(combinedBytesBuffer));
    }

    test("new Chunk", () => {
        const chunkType = ChunkType.fromString("RuSt");
        const message = "This is where your secret message will be!";
        const chunk = new Chunk({ chunkType, data: stringToUint8Array(message) });

        expect(chunk.length).toBe(42);
        expect(chunk.crc).toBe(2882656334);
    });

    test("length", () => {
        const chunk = testingChunk();

        expect(chunk.length).toBe(42);
    });

    test("type", () => {
        const chunk = testingChunk();

        expect(chunk.chunkType.toString()).toBe("RuSt");
    });

    test("string", () => {
        const chunk = testingChunk();

        expect(chunk.dataAsString()).toBe("This is where your secret message will be!");
    });

    test("crc32", () => {
        const chunk = testingChunk();

        expect(chunk.crc).toBe(2882656334);
    });

    test("bytes", () => {
        const chunk = testingChunk();
        const bytes = chunk.bytes();
        const chunkFromBytes = Chunk.tryFrom(bytes);

        expect(chunkFromBytes.crc).toBe(2882656334);
    });
});
