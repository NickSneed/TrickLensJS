import { describe, it, expect, vi, beforeEach } from 'vitest';
import parseSave from './parsesave.js';

// Mock the character map from an external asset file.
vi.mock('../assets/character.js', () => {
    const chars = [];
    // This mock populates a-z for character codes 0x56-0x6F for testing purposes.
    for (let i = 0; i < 26; i++) {
        chars[i] = String.fromCharCode('A'.charCodeAt(0) + i);
    }
    // Manually add a few more for specific tests
    chars['T'.charCodeAt(0) - 'A'.charCodeAt(0)] = 'T';
    chars['E'.charCodeAt(0) - 'A'.charCodeAt(0)] = 'E';
    chars['S'.charCodeAt(0) - 'A'.charCodeAt(0)] = 'S';

    return { default: chars };
});

describe('parsesave', () => {
    let saveData;

    beforeEach(() => {
        // A Game Boy Camera save file is 128KB.
        // We create a fresh buffer for each test.
        saveData = new Uint8Array(128 * 1024);
    });

    it('should extract username correctly', () => {
        // Set bytes for username 'TEST'
        saveData[0x02f04] = 'T'.charCodeAt(0) - 'A'.charCodeAt(0) + 0x56;
        saveData[0x02f05] = 'E'.charCodeAt(0) - 'A'.charCodeAt(0) + 0x56;
        saveData[0x02f06] = 'S'.charCodeAt(0) - 'A'.charCodeAt(0) + 0x56;
        saveData[0x02f07] = 'T'.charCodeAt(0) - 'A'.charCodeAt(0) + 0x56;

        const result = parseSave(saveData);
        expect(result.username).toBe('TEST');
    });

    it('should extract gender as male', () => {
        saveData[0x02f0d] = 0x01;
        const result = parseSave(saveData);
        expect(result.gender).toBe('male');
    });

    it('should extract gender as female', () => {
        saveData[0x02f0d] = 0x00;
        const result = parseSave(saveData);
        expect(result.gender).toBe('female');
    });

    it('should correctly identify a non-deleted photo', () => {
        const photoIndex = 5;
        saveData[0x011d7 + photoIndex] = 0x00; // Not deleted
        const result = parseSave(saveData);
        expect(result.images[photoIndex].isDeleted).toBe(false);
    });

    it('should correctly identify a deleted photo', () => {
        const photoIndex = 10;
        saveData[0x011d7 + photoIndex] = 255; // Deleted
        const result = parseSave(saveData);
        expect(result.images[photoIndex].isDeleted).toBe(true);
    });

    it('should extract a photo comment', () => {
        const photoIndex = 3;
        const commentOffset = 0x02f15 + 0x1000 * photoIndex;
        // 'ABC'
        saveData[commentOffset] = 0x56; // A
        saveData[commentOffset + 1] = 0x57; // B
        saveData[commentOffset + 2] = 0x58; // C

        const result = parseSave(saveData);
        expect(result.images[photoIndex].comment).toBe('ABC');
    });

    it('should extract the frame ID for a photo', () => {
        const photoIndex = 7;
        const frameIdOffset = 0x02f54 + 0x1000 * photoIndex;
        saveData[frameIdOffset] = 4; // This is 0-indexed in the save, so it corresponds to frame 5.

        const result = parseSave(saveData);
        expect(result.images[photoIndex].frameId).toBe('5');
    });

    describe('getImgData', () => {
        it('should decode a simple 8x8 checkerboard tile correctly', () => {
            const photoIndex = 0;
            const photoOffset = 0x2000 + photoIndex * 0x1000;
            const tileDataOffset = photoOffset; // First tile of the photo

            // Create a tile with a checkerboard pattern
            // low bits:  01010101 -> 0x55
            // high bits: 10101010 -> 0xAA
            // This results in palette indices: 2, 1, 2, 1, ...
            for (let i = 0; i < 8; i++) {
                saveData[tileDataOffset + i * 2] = 0x55;
                saveData[tileDataOffset + i * 2 + 1] = 0xaa;
            }

            const { images } = parseSave(saveData);
            const { photoData, width } = images[photoIndex];

            // Check the first 8x8 pixels
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const pixelIndex = y * width + x;
                    const expectedValue = x % 2 === 0 ? 2 : 1;
                    expect(photoData[pixelIndex]).toBe(expectedValue);
                }
            }
        });

        it('should decode a full black tile (palette index 3)', () => {
            const photoIndex = 1;
            const photoOffset = 0x2000 + photoIndex * 0x1000;
            const tileDataOffset = photoOffset;

            // All bits set to 1 for high and low bytes results in palette index 3
            for (let i = 0; i < 16; i++) {
                saveData[tileDataOffset + i] = 0xff;
            }

            const { images } = parseSave(saveData);
            const { photoData, width } = images[photoIndex];

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const pixelIndex = y * width + x;
                    expect(photoData[pixelIndex]).toBe(3);
                }
            }
        });
    });

    it('should return a complete data structure for a save file', () => {
        // Set up a more complete mock save file
        saveData[0x02f04] = 0x56; // Username 'A'
        saveData[0x02f0d] = 0x01; // Gender male

        // Photo 0
        const photoIndex0 = 0;
        saveData[0x011d7 + photoIndex0] = 0x00; // Not deleted
        saveData[0x02f54 + 0x1000 * photoIndex0] = 0; // Frame 1
        const commentOffset0 = 0x02f15 + 0x1000 * photoIndex0;
        saveData[commentOffset0] = 0x56; // Comment 'A'

        // Photo 1
        const photoIndex1 = 1;
        saveData[0x011d7 + photoIndex1] = 255; // Deleted

        const result = parseSave(saveData);

        expect(result.username).toBe('A');
        expect(result.gender).toBe('male');
        expect(result.images).toHaveLength(30);

        // Check photo 0
        expect(result.images[0].isDeleted).toBe(false);
        expect(result.images[0].frameId).toBe('1');
        expect(result.images[0].comment).toBe('A');
        expect(result.images[0].width).toBe(128);
        expect(result.images[0].height).toBe(112);
        expect(result.images[0].photoData).toBeInstanceOf(Array);
        expect(result.images[0].photoData.length).toBe(128 * 112);

        // Check photo 1
        expect(result.images[1].isDeleted).toBe(true);
    });
});
