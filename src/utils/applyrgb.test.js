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

    it('should apply contrast then brightness correctly', () => {
        const rData = [1]; // 170
        const gData = [1]; // 170
        const bData = [1]; // 170
        const width = 1;
        const height = 1;
        // Brightness +0.1 adds 25.5
        const brightness = 0.1;
        // Contrast +0.5 multiplies deviation from 128 by 1.5
        const contrast = 0.5;

        const result = applyRGB(rData, gData, bData, width, height, brightness, contrast);

        // 170 -> Contrast: (170 - 128) * 1.5 + 128 = 191
        // 191 -> Brightness: 191 + 25.5 = 216.5 -> 216 (floored/rounded by Uint8ClampedArray)
        // Note: If brightness was applied first (old way), result would be different (~229)
        expect(result[0]).toBe(216);
    });

    it('should handle negative brightness and contrast', () => {
        const rData = [0]; // 255
        const gData = [1]; // 170
        const bData = [3]; // 0
        const width = 1;
        const height = 1;

        // Brightness -0.5 (-127.5 offset)
        // Contrast -0.5 (0.5 factor)
        const brightness = -0.5;
        const contrast = -0.5;

        const result = applyRGB(rData, gData, bData, width, height, brightness, contrast);

        // 255 -> Contrast: (255-128)*0.5 + 128 = 191.5 -> Brightness: 191.5 - 127.5 = 64
        expect(result[0]).toBe(64);
        // 170 -> Contrast: (170-128)*0.5 + 128 = 149 -> Brightness: 149 - 127.5 = 21.5 -> 22
        expect(result[1]).toBe(22);
        // 0 -> Contrast: (0-128)*0.5 + 128 = 64 -> Brightness: 64 - 127.5 = -63.5 -> 0
        expect(result[2]).toBe(0);
    });
});
