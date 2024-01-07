import { Chunk } from "./chunk";
import { arraysEqual } from "./utils";

export class Png {
    static readonly STANDARD_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

    private chunks: Chunk[];
    constructor(chunks: Chunk[]) {
        this.chunks = chunks;
    }

    chunkByType(chunkType: string): Chunk | undefined {
        return this.chunks.find((c) => c.chunkType.toString() === chunkType);
    }

    appendChunk(chunk: Chunk): void {
        this.chunks.push(chunk);
    }

    removeChunk(chunkType: string): void {
        this.chunks = this.chunks.filter((c) => c.chunkType.toString() !== chunkType);
    }

    getChunks(): Chunk[] {
        return this.chunks;
    }

    bytes(): Uint8Array {
        const chunkBytes = Buffer.concat(this.chunks.map((c) => c.bytes()));
        const allBytes = Buffer.concat([Png.STANDARD_HEADER, chunkBytes]);
        return new Uint8Array(allBytes.buffer);
    }

    static fromChunks(chunks: Chunk[]): Png {
        return new Png(chunks);
    }

    static tryFrom(bytes: Uint8Array): Png {
        const headerBytes = bytes.slice(0, 8);

        if (!arraysEqual(headerBytes, Png.STANDARD_HEADER)) {
            throw new Error("PNG header is incorrect");
        }

        const chunks: Chunk[] = [];
        let startOffset = 8;
        while (startOffset < bytes.length) {
            const first4 = bytes.slice(startOffset, startOffset + 4);
            const chunkLength = new DataView(first4.buffer).getUint32(0, false);
            const endOffset = startOffset + chunkLength + 4 /* length */ + 4 /* chunk type */ + 4; /* crc32 */

            const chunk = Chunk.tryFrom(bytes.slice(startOffset, endOffset));
            chunks.push(chunk);

            startOffset = endOffset;
        }

        return Png.fromChunks(chunks);
    }
}
