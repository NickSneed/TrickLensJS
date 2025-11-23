import { describe, it, expect, vi } from 'vitest';
import applyPalette from './applypalette.js';
import palettes from '../assets/palettes.js';

// Mock the palettes from the external asset file.
vi.mock('../assets/palettes.js', () => ({
    default: {
        'test-palette': [
            { r: 0, g: 0, b: 0 }, // index 0 -> black
            { r: 85, g: 85, b: 85 }, // index 1 -> dark grey
            { r: 170, g: 170, b: 170 }, // index 2 -> light grey
            { r: 255, g: 255, b: 255 } // index 3 -> white
        ],
        'another-palette': [
            { r: 255, g: 0, b: 0 }, // index 0 -> red
            { r: 0, g: 255, b: 0 }, // index 1 -> green
            { r: 0, g: 0, b: 255 }, // index 2 -> blue
            { r: 255, g: 255, b: 0 } // index 3 -> yellow
        ]
    }
}));

describe('applyPalette', () => {
    it('should correctly map photoData indices to RGBA pixel values for a given palette', () => {
        const photoData = [0, 1, 2, 3, 3, 2, 1, 0];
        const palette = palettes['test-palette'];

        const result = applyPalette(photoData, palette, 'none');

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
        const photoData = [0, 1, 2, 3];
        const palette = palettes['another-palette'];

        const result = applyPalette(photoData, palette, 'none');

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

    it('should return an empty array for empty photoData', () => {
        const photoData = [];
        const palette = palettes['test-palette'];

        const result = applyPalette(photoData, palette, 'none');

        expect(result).toEqual(new Uint8ClampedArray([]));
    });

    describe('reorderPalette', () => {
        it('should invert the palette order', () => {
            const photoData = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // The original data [0, 1, 2, 3] should be mapped to the inverted palette.
            // Original palette: [black, d-grey, l-grey, white]
            // Inverted palette: [white, l-grey, d-grey, black]
            // So, 0 -> white, 1 -> l-grey, 2 -> d-grey, 3 -> black
            const result = applyPalette(photoData, palette, 'invert');

            const expectedPixels = new Uint8ClampedArray([
                // 0 -> white
                255, 255, 255, 255,
                // 1 -> light grey
                170, 170, 170, 255,
                // 2 -> dark grey
                85, 85, 85, 255,
                // 3 -> black
                0, 0, 0, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });

        it('should invert the palette order with i', () => {
            const photoData = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // The original data [0, 1, 2, 3] should be mapped to the inverted palette.
            // Original palette: [black, d-grey, l-grey, white]
            // Inverted palette: [white, l-grey, d-grey, black]
            // So, 0 -> white, 1 -> l-grey, 2 -> d-grey, 3 -> black
            const result = applyPalette(photoData, palette, 'i');

            const expectedPixels = new Uint8ClampedArray([
                // 0 -> white
                255, 255, 255, 255,
                // 1 -> light grey
                170, 170, 170, 255,
                // 2 -> dark grey
                85, 85, 85, 255,
                // 3 -> black
                0, 0, 0, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });

        it('should reorder the palette for effect "pa"', () => {
            const photoData = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // The original data [0, 1, 2, 3] should be mapped to the 'pa' reordered palette.
            // Original palette: [black, d-grey, l-grey, white]
            // 'pa' order: [3, 1, 2, 0] -> [white, d-grey, l-grey, black]
            // So, 0 -> white, 1 -> d-grey, 2 -> l-grey, 3 -> black
            const result = applyPalette(photoData, palette, 'pa');

            const expectedPixels = new Uint8ClampedArray([
                // 0 -> white
                255, 255, 255, 255,
                // 1 -> dark grey
                85, 85, 85, 255,
                // 2 -> light grey
                170, 170, 170, 255,
                // 3 -> black
                0, 0, 0, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });

        it('should reorder the palette for effect "pb"', () => {
            const photoData = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // Original palette: [black, d-grey, l-grey, white]
            // 'pb' order: [0, 2, 1, 3] -> [black, l-grey, d-grey, white]
            // So, 0 -> black, 1 -> l-grey, 2 -> d-grey, 3 -> white
            const result = applyPalette(photoData, palette, 'pb');

            const expectedPixels = new Uint8ClampedArray([
                // 0 -> black
                0, 0, 0, 255,
                // 1 -> light grey
                170, 170, 170, 255,
                // 2 -> dark grey
                85, 85, 85, 255,
                // 3 -> white
                255, 255, 255, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });

        it('should reorder the palette for effect "pc"', () => {
            const photoData = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // Original palette: [black, d-grey, l-grey, white]
            // 'pc' order: [0, 3, 2, 1] -> [black, white, l-grey, d-grey]
            // So, 0 -> black, 1 -> white, 2 -> l-grey, 3 -> d-grey
            const result = applyPalette(photoData, palette, 'pc');

            const expectedPixels = new Uint8ClampedArray([
                // 0 -> black
                0, 0, 0, 255,
                // 1 -> white
                255, 255, 255, 255,
                // 2 -> light grey
                170, 170, 170, 255,
                // 3 -> dark grey
                85, 85, 85, 255
            ]);

            expect(result).toEqual(expectedPixels);
        });

        it('should reorder the palette for effect "pd"', () => {
            const photoData = [0, 1, 2, 3];
            const palette = palettes['test-palette'];

            // Original palette: [black, d-grey, l-grey, white]
            // 'pd' order: [2, 1, 0, 3] -> [l-grey, d-grey, black, white]
            // So, 0 -> l-grey, 1 -> d-grey, 2 -> black, 3 -> white
            const result = applyPalette(photoData, palette, 'pd');

            const expectedPixels = new Uint8ClampedArray([170, 170, 170, 255, 85, 85, 85, 255, 0, 0, 0, 255, 255, 255, 255, 255]);

            expect(result).toEqual(expectedPixels);
        });
    });
});
