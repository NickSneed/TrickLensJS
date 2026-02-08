import { describe, it, expect } from 'vitest';
import applyRGB from './applyrgb.js';

describe('applyRGB', () => {
    it('should correctly combine R, G, and B channels into RGBA pixels', () => {
        // intensity map: 0->255, 1->170, 2->85, 3->0
        const rData = [0, 3]; // 255, 0
        const gData = [1, 2]; // 170, 85
        const bData = [2, 1]; // 85, 170
        const width = 2;
        const height = 1;

        const result = applyRGB(rData, gData, bData, width, height);

        const expected = new Uint8ClampedArray([
            255,
            170,
            85,
            255, // Pixel 1
            0,
            85,
            170,
            255 // Pixel 2
        ]);

        expect(result).toEqual(expected);
    });

    it('should handle a single pixel', () => {
        const rData = [3];
        const gData = [3];
        const bData = [3];
        const width = 1;
        const height = 1;

        const result = applyRGB(rData, gData, bData, width, height);

        const expected = new Uint8ClampedArray([0, 0, 0, 255]);

        expect(result).toEqual(expected);
    });

    it('should return an empty array for 0 width/height', () => {
        const result = applyRGB([], [], [], 0, 0);
        expect(result).toEqual(new Uint8ClampedArray(0));
    });

    it('should produce the correct output length based on dimensions', () => {
        const width = 10;
        const height = 10;
        const dummyData = new Array(100).fill(0);

        const result = applyRGB(dummyData, dummyData, dummyData, width, height);
        expect(result.length).toBe(width * height * 4);
    });

    it('should apply contrast correctly', () => {
        const rData = [1]; // 170
        const gData = [2]; // 85
        const bData = [1]; // 170
        const width = 1;
        const height = 1;
        const factor = 0;
        const contrast = 0.5; // Increase contrast by 1.5x

        const result = applyRGB(rData, gData, bData, width, height, factor, contrast);

        // 170 -> (170-128)*1.5 + 128 = 191
        // 85 -> (85-128)*1.5 + 128 = 63.5 -> 64 (Uint8ClampedArray rounds half to even)
        expect(result[0]).toBe(191);
        expect(result[1]).toBe(64);
        expect(result[2]).toBe(191);
        expect(result[3]).toBe(255);
    });
});
