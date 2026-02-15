import { describe, it, expect, beforeEach } from 'vitest';
import applyEffect from './applyeffect.js';

const WIDTH = 128;
const HEIGHT = 112;
const TOTAL_PIXELS = WIDTH * HEIGHT;

describe('applyEffect', () => {
    it('should return original data for an unknown effect', () => {
        const pixels = [1, 2, 3];
        const result = applyEffect(pixels, 'unknown-effect');
        expect(result).toBe(pixels);
    });

    describe('invert', () => {
        it('should invert the pixel values', () => {
            const pixels = [0, 1, 2, 3, 0, 1, 2, 3];
            const result = applyEffect(pixels, 'invert');
            expect(result).toEqual([3, 2, 1, 0, 3, 2, 1, 0]);
        });

        it('should handle an empty array', () => {
            const pixels = [];
            const result = applyEffect(pixels, 'invert');
            expect(result).toEqual([]);
        });
    });

    describe('mirror', () => {
        let pixels;

        beforeEach(() => {
            pixels = new Array(TOTAL_PIXELS).fill(0);
            // Fill left half with 1s, right half with 2s
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    if (x < WIDTH / 2) {
                        pixels[y * WIDTH + x] = 1; // Left
                    } else {
                        pixels[y * WIDTH + x] = 2; // Right
                    }
                }
            }
        });

        it('should mirror right-to-left (rtl)', () => {
            const result = applyEffect(pixels, 'mirror-rtl');
            // The entire image should now be filled with the value from the right side (2)
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    expect(result[y * WIDTH + x]).toBe(2);
                }
            }
        });

        it('should mirror left-to-right (ltr)', () => {
            const result = applyEffect(pixels, 'mirror-ltr');
            // The entire image should now be filled with the value from the left side (1)
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    expect(result[y * WIDTH + x]).toBe(1);
                }
            }
        });

        it('should mirror bottom-to-top (btt)', () => {
            // Fill top half with 1s, bottom half with 3s
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    pixels[y * WIDTH + x] = y < HEIGHT / 2 ? 1 : 3;
                }
            }
            const result = applyEffect(pixels, 'mirror-btt');
            // The entire image should now be filled with the value from the bottom side (3)
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    expect(result[y * WIDTH + x]).toBe(3);
                }
            }
        });

        it('should mirror top-to-bottom (ttb)', () => {
            // Fill top half with 1s, bottom half with 3s
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    pixels[y * WIDTH + x] = y < HEIGHT / 2 ? 1 : 3;
                }
            }
            const result = applyEffect(pixels, 'mirror-ttb');
            // The entire image should now be filled with the value from the top side (1)
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    expect(result[y * WIDTH + x]).toBe(1);
                }
            }
        });
    });

    describe('zoom', () => {
        let pixels;

        beforeEach(() => {
            pixels = new Array(TOTAL_PIXELS).fill(0);
            // Create a pattern in the center 64x56 area
            const startX = WIDTH / 4; // 32
            const startY = HEIGHT / 4; // 28
            for (let y = 0; y < HEIGHT / 2; y++) {
                for (let x = 0; x < WIDTH / 2; x++) {
                    pixels[(startY + y) * WIDTH + (startX + x)] = 1;
                }
            }
        });

        it('should zoom into the center (2x)', () => {
            const result = applyEffect(pixels, 'zoom');
            // The entire result should be the zoomed center area, so all 1s
            expect(result.every((pixel) => pixel === 1)).toBe(true);
        });

        it('should stretch vertically', () => {
            const result = applyEffect(pixels, 'zoom-v');
            // Check that the vertical stretch happened correctly
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    const sourceY = Math.floor(y / 2) + HEIGHT / 4;
                    const sourcePixel = pixels[sourceY * WIDTH + x];
                    expect(result[y * WIDTH + x]).toBe(sourcePixel);
                }
            }
        });

        it('should stretch horizontally', () => {
            const result = applyEffect(pixels, 'zoom-h');
            // Check that the horizontal stretch happened correctly
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    const sourceX = Math.floor(x / 2) + WIDTH / 4;
                    const sourcePixel = pixels[y * WIDTH + sourceX];
                    expect(result[y * WIDTH + x]).toBe(sourcePixel);
                }
            }
        });
    });

    describe('tile', () => {
        it('should scale down and tile the image in a 2x2 grid', () => {
            const pixels = new Array(TOTAL_PIXELS).fill(0);

            // Create a 2x2 block pattern in the original image
            // Top-left quadrant = 1
            // Top-right quadrant = 2
            // Bottom-left quadrant = 3
            // Bottom-right quadrant = 0 (default)
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    if (y < HEIGHT / 2 && x < WIDTH / 2) {
                        pixels[y * WIDTH + x] = 1;
                    } else if (y < HEIGHT / 2 && x >= WIDTH / 2) {
                        pixels[y * WIDTH + x] = 2;
                    } else if (y >= HEIGHT / 2 && x < WIDTH / 2) {
                        pixels[y * WIDTH + x] = 3;
                    }
                }
            }

            const result = applyEffect(pixels, 'tile');

            // The 'tile' effect scales the image down to half size (64x56)
            // by taking every other pixel, and then tiles that 2x2.
            // The scaled image will be a 64x56 representation of the original quadrants.
            const scaledWidth = WIDTH / 2;
            const scaledHeight = HEIGHT / 2;

            // Check top-left tile
            for (let y = 0; y < scaledHeight; y++) {
                for (let x = 0; x < scaledWidth; x++) {
                    const originalX = x * 2;
                    const originalY = y * 2;
                    const expectedPixel = pixels[originalY * WIDTH + originalX];
                    expect(result[y * WIDTH + x]).toBe(expectedPixel);
                }
            }

            // Check top-right tile
            for (let y = 0; y < scaledHeight; y++) {
                for (let x = scaledWidth; x < WIDTH; x++) {
                    const originalX = (x - scaledWidth) * 2;
                    const originalY = y * 2;
                    const expectedPixel = pixels[originalY * WIDTH + originalX];
                    expect(result[y * WIDTH + x]).toBe(expectedPixel);
                }
            }
        });
    });
});
