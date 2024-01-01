import type { ChunkType } from "./chunk-type";
import { crc, crcDirect } from "./utils";

export class Chunk {
    private chunkType: ChunkType;
    private message: string;
    private data: Uint8Array;
    readonly crc: number;

    /**
     * Creates a new instance of Chunk
     * @param chunkType
     * @param message encoded message
     */
    constructor(chunkType: ChunkType, message: string) {
        this.message = message;
        this.data = new TextEncoder("utf-8").encode(message);
        this.chunkType = chunkType;

        // concatenate chunkType and message arrays
        const bytesForCrc = new Uint8Array(chunkType.bytes().length + this.data.length);
        bytesForCrc.set(chunkType.bytes(), 0);
        bytesForCrc.set(this.data, chunkType.bytes().length);
        this.crc = crc(Buffer.from(bytesForCrc));
    }

    get length() {
        return this.message.length;
    }
}
