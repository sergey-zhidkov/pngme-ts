// Copied from https://github.com/pngjs/pngjs
const crcTable: number[] = [];

for (let i = 0; i < 256; i++) {
    let currentCrc = i;
    for (let j = 0; j < 8; j++) {
        if (currentCrc & 1) {
            currentCrc = 0xedb88320 ^ (currentCrc >>> 1);
        } else {
            currentCrc = currentCrc >>> 1;
        }
    }
    crcTable[i] = currentCrc;
}

export class CrcCalculator {
    static crc32(buf: Buffer) {
        let crc = -1;
        for (let i = 0; i < buf.length; i++) {
            crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
        }
        crc = crc ^ -1;
        return crc >>> 0;
    }
}
