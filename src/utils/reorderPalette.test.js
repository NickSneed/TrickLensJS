import { describe, it, expect } from 'vitest';
import reorderPalette from './reorderPalette.js';

describe('reorderPalette', () => {
    const mainPalette = ['#000', '#555', '#AAA', '#FFF']; // [black, dark-gray, light-gray, white]
    const paletteKey = 'test-key';

    it('should return the original palette and key for an unknown effect', () => {
        const { orderedPalette, newKey } = reorderPalette(mainPalette, 'unknown-effect', paletteKey);
        expect(orderedPalette).toEqual(['#000', '#555', '#AAA', '#FFF']);
        expect(newKey).toBe('test-key');
    });

    it('should return the original palette and key when no effect is provided', () => {
        const { orderedPalette, newKey } = reorderPalette(mainPalette, undefined, paletteKey);
        expect(orderedPalette).toEqual(['#000', '#555', '#AAA', '#FFF']);
        expect(newKey).toBe('test-key');
    });

    it('should reorder for "invert" effect', () => {
        const { orderedPalette, newKey } = reorderPalette(mainPalette, 'invert', paletteKey);
        expect(orderedPalette).toEqual(['#FFF', '#AAA', '#555', '#000']);
        expect(newKey).toBe('test-keyi');
    });

    it('should reorder for "i" effect (alias for invert)', () => {
        const { orderedPalette, newKey } = reorderPalette(mainPalette, 'i', paletteKey);
        expect(orderedPalette).toEqual(['#FFF', '#AAA', '#555', '#000']);
        expect(newKey).toBe('test-keyi');
    });

    it('should reorder for "pa" effect', () => {
        const { orderedPalette, newKey } = reorderPalette(mainPalette, 'pa', paletteKey);
        expect(orderedPalette).toEqual(['#FFF', '#555', '#AAA', '#000']);
        expect(newKey).toBe('test-keypa');
    });

    it('should reorder for "pb" effect', () => {
        const { orderedPalette, newKey } = reorderPalette(mainPalette, 'pb', paletteKey);
        expect(orderedPalette).toEqual(['#000', '#AAA', '#555', '#FFF']);
        expect(newKey).toBe('test-keypb');
    });

    it('should reorder for "pc" effect', () => {
        const { orderedPalette, newKey } = reorderPalette(mainPalette, 'pc', paletteKey);
        expect(orderedPalette).toEqual(['#000', '#FFF', '#AAA', '#555']);
        expect(newKey).toBe('test-keypc');
    });

    it('should reorder for "pd" effect', () => {
        const { orderedPalette, newKey } = reorderPalette(mainPalette, 'pd', paletteKey);
        expect(orderedPalette).toEqual(['#AAA', '#555', '#000', '#FFF']);
        expect(newKey).toBe('test-keypd');
    });

    it('should return an empty array for an empty palette but still update the key', () => {
        const { orderedPalette, newKey } = reorderPalette([], 'invert', 'empty-key');
        expect(orderedPalette).toEqual([]);
        expect(newKey).toBe('empty-keyi');
    });

    it('should not update the key for an unknown effect with an empty palette', () => {
        const { orderedPalette, newKey } = reorderPalette([], 'unknown', 'empty-key');
        expect(orderedPalette).toEqual([]);
        expect(newKey).toBe('empty-key');
    });
});
