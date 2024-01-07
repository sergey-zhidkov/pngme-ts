import { Chunk } from "./chunk";
import { ChunkType } from "./chunk-type";
import { Png } from "./png";
import { stringToUint8Array } from "./utils";

export class Command {
    static async parseAndExecute(commandLineArgs: string[]): Promise<void> {
        const command = commandLineArgs[2];
        switch (command) {
            case "print": {
                const path = commandLineArgs[3];
                await print(path);
                break;
            }
            case "encode": {
                const path = commandLineArgs[3];
                const chunkType = commandLineArgs[4];
                const message = commandLineArgs[5];
                await encode(path, chunkType, message);
                break;
            }
            case "decode": {
                const path = commandLineArgs[3];
                const chunkType = commandLineArgs[4];
                await decode(path, chunkType);
                break;
            }
            case "remove": {
                const path = commandLineArgs[3];
                const chunkType = commandLineArgs[4];
                await remove(path, chunkType);
                break;
            }
        }
    }
}

// pngme print ./dice.png
export async function print(path: string) {
    if (!path) {
        throw new Error("unknown path to file " + path);
    }

    const bytes = await getBytesFromPath(path);
    const png = Png.tryFrom(bytes);

    console.log("The following chunks can be decoded:");
    for (const singleChunk of png.getChunks()) {
        console.log(singleChunk.chunkType.toString());
    }
}

// pngme encode ./dice.png ruSt "This is a secret message!
export async function encode(path: string, chunkTypeString: string, message: string) {
    if (!path) {
        throw new Error("unknown path to file " + path);
    }

    if (!chunkTypeString) {
        throw new Error("unknown chunkType " + chunkTypeString);
    }

    if (!message) {
        throw new Error("empty message " + message);
    }

    const bytes = await getBytesFromPath(path);
    const png = Png.tryFrom(bytes);

    const chunkType = ChunkType.fromString(chunkTypeString);
    const chunk = new Chunk({ chunkType, data: stringToUint8Array(message) });
    png.appendChunk(chunk);

    await writeFileCopy(png.bytes(), path);
    console.log("File was saved with new chunk");
}

// pngme decode ./dice.png ruSt
export async function decode(path: string, chunkType: string) {
    if (!path) {
        throw new Error("unknown path to file " + path);
    }

    if (!chunkType) {
        throw new Error("unknown chunkType " + chunkType);
    }

    const bytes = await getBytesFromPath(path);
    const png = Png.tryFrom(bytes);
    const chunk = png.chunkByType(chunkType);
    console.log("Reading chunk: ", chunkType);
    console.log("Message is: ", chunk?.dataAsString());
}

// pngme remove ./dice.png ruSt
export async function remove(path: string, chunkType: string) {
    if (!path) {
        throw new Error("unknown path to file " + path);
    }

    if (!chunkType) {
        throw new Error("unknown chunkType " + chunkType);
    }

    const bytes = await getBytesFromPath(path);
    const png = Png.tryFrom(bytes);
    png.removeChunk(chunkType);

    await writeFileCopy(png.bytes(), path);
    console.log("File was saved and chunk was removed");
}

async function getBytesFromPath(path: string): Promise<Uint8Array> {
    const file = Bun.file(path);
    const buffer = await file.arrayBuffer();
    return new Uint8Array(buffer);
}

async function writeFileCopy(bytes: Uint8Array, oldPath: string) {
    const newPath = oldPath + "-copy.png";
    await Bun.write(newPath, bytes);
}
