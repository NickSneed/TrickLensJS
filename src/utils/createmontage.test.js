import { describe, it, expect, beforeEach } from 'vitest';
import createMontage from './createmontage.js';

const WIDTH = 128;
const HEIGHT = 112;
const TOTAL_PIXELS = WIDTH * HEIGHT;

describe('createMontage', () => {
    let photoData1, photoData2, photoData3, photoData4;

    beforeEach(() => {
        // Create mock photo data with distinct values for easy testing
        photoData1 = new Uint8Array(TOTAL_PIXELS).fill(1);
        photoData2 = new Uint8Array(TOTAL_PIXELS).fill(2);
        photoData3 = new Uint8Array(TOTAL_PIXELS).fill(3);
        photoData4 = new Uint8Array(TOTAL_PIXELS).fill(0);
    });

    describe('Edge Cases', () => {
        it('should return an empty array if no photos are provided', () => {
            expect(createMontage()).toEqual([]);
            expect(createMontage(null)).toEqual([]);
        });

        it('should return an empty array if not enough photos are provided for the split type', () => {
            expect(createMontage([photoData1], 'horizontal')).toEqual([]);
            expect(createMontage([photoData1, photoData2], 'four-quadrant')).toEqual([]);
            expect(createMontage([photoData1, photoData2], 'horizontal-bars')).toEqual([]);
        });

        it('should return an empty array if any required photo is null or undefined', () => {
            expect(createMontage([photoData1, null], 'vertical')).toEqual([]);
            expect(createMontage([photoData1, photoData2, undefined], 'horizontal-bars')).toEqual([]);
        });
    });

    describe('horizontal montage', () => {
        it('should combine two photos horizontally', () => {
            const result = createMontage([photoData1, photoData2], 'horizontal');
            const halfHeight = HEIGHT / 2;

            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    const pixelIndex = y * WIDTH + x;
                    const expectedValue = y < halfHeight ? 1 : 2;
                    expect(result[pixelIndex]).toBe(expectedValue);
                }
            }
        });
    });

    describe('vertical montage', () => {
        it('should combine two photos vertically', () => {
            const result = createMontage([photoData1, photoData2], 'vertical');
            const halfWidth = WIDTH / 2;

            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    const pixelIndex = y * WIDTH + x;
                    const expectedValue = x < halfWidth ? 1 : 2;
                    expect(result[pixelIndex]).toBe(expectedValue);
                }
            }
        });
    });

    describe('quadrant montage (2 photos)', () => {
        it('should combine two photos in a quadrant pattern', () => {
            const result = createMontage([photoData1, photoData2], 'quadrant');
            const halfWidth = WIDTH / 2;
            const halfHeight = HEIGHT / 2;

            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    const pixelIndex = y * WIDTH + x;
                    let expectedValue;

                    if (y < halfHeight) {
                        expectedValue = x < halfWidth ? 1 : 2; // Top-left: 1, Top-right: 2
                    } else {
                        expectedValue = x < halfWidth ? 2 : 1; // Bottom-left: 2, Bottom-right: 1
                    }
                    expect(result[pixelIndex]).toBe(expectedValue);
                }
            }
        });
    });

    describe('four-quadrant montage', () => {
        it('should combine four photos in a quadrant pattern', () => {
            const photos = [photoData1, photoData2, photoData3, photoData4];
            const result = createMontage(photos, 'four-quadrant');
            const halfWidth = WIDTH / 2;
            const halfHeight = HEIGHT / 2;

            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    const pixelIndex = y * WIDTH + x;
                    let expectedValue;

                    if (y < halfHeight) {
                        expectedValue = x < halfWidth ? 1 : 2; // Top-left: 1, Top-right: 2
                    } else {
                        expectedValue = x < halfWidth ? 3 : 0; // Bottom-left: 3, Bottom-right: 0
                    }
                    expect(result[pixelIndex]).toBe(expectedValue);
                }
            }
        });
    });

    describe('horizontal-2/3 montage', () => {
        it('should combine two photos with a 2/3 horizontal split', () => {
            const result = createMontage([photoData1, photoData2], 'horizontal-2/3');
            const topHeight = 80;

            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    const pixelIndex = y * WIDTH + x;
                    const expectedValue = y < topHeight ? 1 : 2;
                    expect(result[pixelIndex]).toBe(expectedValue);
                }
            }
        });
    });

    describe('horizontal-bars montage', () => {
        it('should combine three photos in horizontal bars', () => {
            // For this test, we need to simulate the source data more accurately.
            // The function takes specific slices from the source images.
            // photoData1 (middle): slice from y=32 to y=80
            // photoData2 (top): slice from y=0 to y=32
            // photoData3 (bottom): slice from y=80 to y=112

            // Let's create source images with a horizontal line to track the slices
            const p1 = new Uint8Array(TOTAL_PIXELS).fill(0);
            const p2 = new Uint8Array(TOTAL_PIXELS).fill(0);
            const p3 = new Uint8Array(TOTAL_PIXELS).fill(0);

            // Draw a line on each source image in the middle of the area that will be copied
            for (let x = 0; x < WIDTH; x++) {
                p1[(32 + 48 / 2) * WIDTH + x] = 1; // Line in the middle of photo1's slice
                p2[16 * WIDTH + x] = 2; // Line in the middle of photo2's slice
                p3[(112 - 32 / 2) * WIDTH + x] = 3; // Line in the middle of photo3's slice
            }

            const result = createMontage([p1, p2, p3], 'horizontal-bars');

            const topHeight = 32;
            const middleHeight = 48;

            // Check that the top bar (0-31) contains the line from photo2
            expect(result[16 * WIDTH + 64]).toBe(2);
            // Check that the middle bar (32-79) contains the line from photo1
            expect(result[(topHeight + middleHeight / 2) * WIDTH + 64]).toBe(1);
            // Check that the bottom bar (80-111) contains the line from photo3
            expect(result[(topHeight + middleHeight + (HEIGHT - topHeight - middleHeight) / 2) * WIDTH + 64]).toBe(3);

            // Check a pixel that should not have a line
            expect(result[0]).toBe(0);
        });
    });

    describe('border montage', () => {
        it('should place one photo inside another as a border', () => {
            // photoData1 is the inner image (all 1s)
            // photoData2 is the outer/border image (all 2s)

            // To make it more robust, let's modify photoData1 to have a pattern
            // that we can check for, to ensure the correct part is copied.
            const innerWidth = 80;
            const innerHeight = 64;
            const offsetX = (WIDTH - innerWidth) / 2; // 24
            const offsetY = (HEIGHT - innerHeight) / 2; // 24

            // Put a unique value (5) in the center of the region that should be copied from photoData1
            const sourceY = offsetY + innerHeight / 2;
            const sourceX = offsetX + innerWidth / 2;
            photoData1[sourceY * WIDTH + sourceX] = 5;

            const result = createMontage([photoData1, photoData2], 'border');

            // Check the corners of the result, they should be from the border image (photoData2)
            expect(result[0]).toBe(2); // Top-left
            expect(result[WIDTH - 1]).toBe(2); // Top-right
            expect(result[(HEIGHT - 1) * WIDTH]).toBe(2); // Bottom-left
            expect(result[TOTAL_PIXELS - 1]).toBe(2); // Bottom-right

            // Check the corners of the inner image area
            // Top-left of inner area
            expect(result[offsetY * WIDTH + offsetX]).toBe(1);
            // Top-right of inner area
            expect(result[offsetY * WIDTH + (offsetX + innerWidth - 1)]).toBe(1);
            // Bottom-left of inner area
            expect(result[(offsetY + innerHeight - 1) * WIDTH + offsetX]).toBe(1);
            // Bottom-right of inner area
            expect(result[(offsetY + innerHeight - 1) * WIDTH + (offsetX + innerWidth - 1)]).toBe(1);

            // Check for the unique value (5) we placed in the source image.
            // It should be at the same absolute coordinates in the final result.
            const destY = offsetY + innerHeight / 2;
            const destX = offsetX + innerWidth / 2;
            expect(result[destY * WIDTH + destX]).toBe(5);

            // Check a pixel just outside the inner area, it should be from the border
            expect(result[(offsetY - 1) * WIDTH + offsetX]).toBe(2);
        });
    });
});
