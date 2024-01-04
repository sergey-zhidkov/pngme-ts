import { Chunk } from "./chunk";
import { arraysEqual } from "./utils";

export class Png {
    static readonly STANDARD_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

    chunks: Chunk[];
    constructor(chunks: Chunk[]) {
        this.chunks = chunks;
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
            const chunkLength = new DataView(first4.buffer).getUint32(0, true);
            const endOffset = startOffset + chunkLength + 4 /* length */ + 4 /* chunk type */ + 4; /* crc32 */
            const chunk = Chunk.tryFrom(bytes.slice(startOffset, endOffset));
            chunks.push(chunk);
            startOffset = endOffset;
        }

        return Png.fromChunks(chunks);
    }
}
