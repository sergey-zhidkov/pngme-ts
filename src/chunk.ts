import { concatArrayBuffers } from "bun";
import { ChunkType } from "./chunk-type";
import { crc32, number32ToUint8Array, stringToUint8Array, uint8ArrayToString } from "./utils";

export class Chunk {
    readonly chunkType: ChunkType;
    readonly data: Uint8Array;
    readonly crc: number;

    /**
     * Creates a new instance of Chunk
     * @param chunkType
     * @param message encoded message
     */
    constructor({ chunkType, data }: { chunkType: ChunkType; data: Uint8Array }) {
        this.data = new Uint8Array(data);
        this.chunkType = chunkType;

        // concatenate chunkType and message arrays to calculate CRC32
        const bytesForCrc = concatArrayBuffers([chunkType.bytes(), this.data]);
        this.crc = crc32(Buffer.from(bytesForCrc));
    }

    get length() {
        return this.data.length;
    }

    dataAsString() {
        return uint8ArrayToString(this.data);
    }

    bytes() {
        const lengthBytes = number32ToUint8Array(this.length);
        const chunkTypeBytes = this.chunkType.bytes();
        const messageBytes = stringToUint8Array(this.dataAsString());
        const crcBytes = number32ToUint8Array(this.crc);
        const combinedBytesBuffer = concatArrayBuffers([lengthBytes, chunkTypeBytes, messageBytes, crcBytes]);

        return new Uint8Array(combinedBytesBuffer);
    }

    static tryFrom(bytes: Uint8Array): Chunk {
        const dataLength = bytes.length;
        const first4 = bytes.slice(0, 4);
        const chunkLength = new DataView(first4.buffer).getUint32(0, true);

        const second4 = bytes.slice(4, 8);
        const chunkType = ChunkType.tryFrom(second4);

        // last 4 bytes are CRC32
        const dataBytes = bytes.slice(8, dataLength - 4);
        if (chunkLength !== dataBytes.length) {
            throw new Error("chunk length is not correct");
        }

        const lastBytes = bytes.slice(dataLength - 4);

        const expectedCrc = new DataView(lastBytes.buffer).getUint32(0, true);
        const combinedBytes = concatArrayBuffers([chunkType.bytes(), dataBytes]);
        const actualCrc = crc32(Buffer.from(combinedBytes));

        if (actualCrc !== expectedCrc) {
            throw new Error("Crc of the chunk is not correct");
        }

        return new Chunk({ chunkType, data: dataBytes });
    }
}
