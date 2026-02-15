import { describe, it, expect, vi } from 'vitest';
import applyPalette from './applypalette.js';
import palettes from '../assets/palettes.js';

// Mock the palettes from the external asset file.
vi.mock('../assets/palettes.js', () => ({
    default: {
        'test-palette': {
            name: 'Test Palette',
            colors: [
                { r: 0, g: 0, b: 0 }, // index 0 -> black
                { r: 85, g: 85, b: 85 }, // index 1 -> dark grey
                { r: 170, g: 170, b: 170 }, // index 2 -> light grey
                { r: 255, g: 255, b: 255 } // index 3 -> white
            ]
        },
        'another-palette': {
            name: 'Another Palette',
            colors: [
                { r: 255, g: 0, b: 0 }, // index 0 -> red
                { r: 0, g: 255, b: 0 }, // index 1 -> green
                { r: 0, g: 0, b: 255 }, // index 2 -> blue
                { r: 255, g: 255, b: 0 } // index 3 -> yellow
            ]
        }
    }
}));

describe('applyPalette', () => {
    it('should correctly map pixels indices to RGBA pixel values for a given palette', () => {
        const pixels = [0, 1, 2, 3, 3, 2, 1, 0];
        const palette = palettes['test-palette'];

        const result = applyPalette(pixels, palette, 'none');

        const expectedPixels = new Uint8ClampedArray([
            // 0 -> black
            0, 0, 0, 255,
            // 1 -> dark grey
            85, 85, 85, 255,
            // 2 -> light grey
            170, 170, 170, 255,
            // 3 -> white
            255, 255, 255, 255,
            // 3 -> white
            255, 255, 255, 255,
            // 2 -> light grey
            170, 170, 170, 255,
            // 1 -> dark grey
            85, 85, 85, 255,
            // 0 -> black
            0, 0, 0, 255
        ]);

        expect(result).toEqual(expectedPixels);
    });

    it('should work with a different palette', () => {
        const pixels = [0, 1, 2, 3];
        const palette = palettes['another-palette'];

        const result = applyPalette(pixels, palette, 'none');

        const expectedPixels = new Uint8ClampedArray([
            // 0 -> red
            255, 0, 0, 255,
            // 1 -> green
            0, 255, 0, 255,
            // 2 -> blue
            0, 0, 255, 255,
            // 3 -> yellow
            255, 255, 0, 255
        ]);

        expect(result).toEqual(expectedPixels);
    });

    it('should return an empty array for empty pixels', () => {
        const pixels = [];
        const palette = palettes['test-palette'];

        const result = applyPalette(pixels, palette, 'none');

        expect(result).toEqual(new Uint8ClampedArray([]));
    });

    describe('reorderPalette', () => {
        it('should invert the palette order', () => {
            const pixels = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // The original data [0, 1, 2, 3] should be mapped to the inverted palette.
            // Original palette: [black, d-grey, l-grey, white]
            // Inverted palette: [white, l-grey, d-grey, black]
            // So, 0 -> white, 1 -> l-grey, 2 -> d-grey, 3 -> black
            const result = applyPalette(pixels, palette, 'invert');

            const expectedPixels = new Uint8ClampedArray([
                // 0
                255, 255, 255, 255,
                // 1
                170, 170, 170, 255,
                // 2
                85, 85, 85, 255,
                // 3
                0, 0, 0, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });

        it('should invert the palette order with i', () => {
            const pixels = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // The original data [0, 1, 2, 3] should be mapped to the inverted palette.
            // Original palette: [black, d-grey, l-grey, white]
            // Inverted palette: [white, l-grey, d-grey, black]
            // So, 0 -> white, 1 -> l-grey, 2 -> d-grey, 3 -> black
            const result = applyPalette(pixels, palette, 'i');

            const expectedPixels = new Uint8ClampedArray([
                // 0
                255, 255, 255, 255,
                // 1
                170, 170, 170, 255,
                // 2
                85, 85, 85, 255,
                // 3
                0, 0, 0, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });

        it('should reorder the palette for effect "pa"', () => {
            const pixels = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // The original data [0, 1, 2, 3] should be mapped to the 'pa' reordered palette.
            // Original palette: [black(0), d-grey(1), l-grey(2), white(3)]
            // 'pa' order from code: [2, 3, 0, 1] -> [l-grey, white, black, d-grey]
            // So, 0->l-grey, 1->white, 2->black, 3->d-grey
            const result = applyPalette(pixels, palette, 'pa');

            const expectedPixels = new Uint8ClampedArray([
                // 0
                0, 0, 0, 255,
                // 1
                170, 170, 170, 255,
                // 2
                85, 85, 85, 255,
                // 3
                255, 255, 255, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });

        it('should reorder the palette for effect "pb"', () => {
            const pixels = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // Original palette: [black(0), d-grey(1), l-grey(2), white(3)]
            // 'pb' order from code: [3, 1, 2, 0] -> [white, d-grey, l-grey, black]
            // So, 0->white, 1->d-grey, 2->l-grey, 3->black
            const result = applyPalette(pixels, palette, 'pb');

            const expectedPixels = new Uint8ClampedArray([
                // 0
                255, 255, 255, 255,
                // 1
                85, 85, 85, 255,
                // 2
                170, 170, 170, 255,
                // 3
                0, 0, 0, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });

        it('should reorder the palette for effect "pc"', () => {
            const pixels = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // Original palette: [black(0), d-grey(1), l-grey(2), white(3)]
            // 'pc' order from code: [1, 0, 3, 2] -> [d-grey, black, white, l-grey]
            // So, 0->d-grey, 1->black, 2->white, 3->l-grey
            const result = applyPalette(pixels, palette, 'pc');

            const expectedPixels = new Uint8ClampedArray([
                // 0
                85, 85, 85, 255,
                // 1
                170, 170, 170, 255,
                // 2
                255, 255, 255, 255,
                // 3
                0, 0, 0, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });

        it('should reorder the palette for effect "pd"', () => {
            const pixels = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // Original palette: [black(0), d-grey(1), l-grey(2), white(3)]
            // 'pd' order from code: [0, 2, 1, 3] -> [black, l-grey, d-grey, white]
            // So, 0->black, 1->l-grey, 2->d-grey, 3->white
            const result = applyPalette(pixels, palette, 'pd');

            const expectedPixels = new Uint8ClampedArray([
                // 0
                255, 255, 255, 255,
                // 1
                0, 0, 0, 255,
                // 2
                85, 85, 85, 255,
                // 3
                170, 170, 170, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });
    });
});
