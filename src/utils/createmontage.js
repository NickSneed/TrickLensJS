const WIDTH = 128;
const HEIGHT = 112;
const TOTAL_PIXELS = WIDTH * HEIGHT;

const createHorizontalMontage = (photoData1, photoData2) => {
    const montageData = new Uint8Array(TOTAL_PIXELS);
    const halfHeightInPixels = TOTAL_PIXELS / 2;
    montageData.set(photoData1.subarray(0, halfHeightInPixels));
    montageData.set(photoData2.subarray(halfHeightInPixels), halfHeightInPixels);
    return montageData;
};

const createVerticalMontage = (photoData1, photoData2) => {
    const montageData = new Uint8Array(TOTAL_PIXELS);
    const halfWidth = WIDTH / 2;
    for (let y = 0; y < HEIGHT; y++) {
        const rowStartIndex = y * WIDTH;
        const rowEndIndex = rowStartIndex + WIDTH;
        montageData.set(photoData1.subarray(rowStartIndex, rowStartIndex + halfWidth), rowStartIndex);
        montageData.set(photoData2.subarray(rowStartIndex + halfWidth, rowEndIndex), rowStartIndex + halfWidth);
    }
    return montageData;
};

const createQuadrantMontage = (photoData1, photoData2) => {
    const montageData = new Uint8Array(TOTAL_PIXELS);
    const halfWidth = WIDTH / 2;
    const halfHeight = HEIGHT / 2;

    for (let y = 0; y < HEIGHT; y++) {
        const rowStartIndex = y * WIDTH;
        const rowEndIndex = rowStartIndex + WIDTH;

        if (y < halfHeight) {
            // Top-left from photo1, top-right from photo2
            montageData.set(photoData1.subarray(rowStartIndex, rowStartIndex + halfWidth), rowStartIndex);
            montageData.set(photoData2.subarray(rowStartIndex + halfWidth, rowEndIndex), rowStartIndex + halfWidth);
        } else {
            // Bottom-left from photo2, bottom-right from photo1
            montageData.set(photoData2.subarray(rowStartIndex, rowStartIndex + halfWidth), rowStartIndex);
            montageData.set(photoData1.subarray(rowStartIndex + halfWidth, rowEndIndex), rowStartIndex + halfWidth);
        }
    }
    return montageData;
};

const createFourPhotoQuadrantMontage = (photos) => {
    const [photoData1, photoData2, photoData3, photoData4] = photos;
    const montageData = new Uint8Array(TOTAL_PIXELS);
    const halfWidth = WIDTH / 2;
    const halfHeight = HEIGHT / 2;

    for (let y = 0; y < HEIGHT; y++) {
        const rowStartIndex = y * WIDTH;
        const rowEndIndex = rowStartIndex + WIDTH;

        if (y < halfHeight) {
            // Top-left from photo1, top-right from photo2
            montageData.set(photoData1.subarray(rowStartIndex, rowStartIndex + halfWidth), rowStartIndex);
            montageData.set(photoData2.subarray(rowStartIndex + halfWidth, rowEndIndex), rowStartIndex + halfWidth);
        } else {
            // Bottom-left from photo3, bottom-right from photo4
            montageData.set(photoData3.subarray(rowStartIndex, rowStartIndex + halfWidth), rowStartIndex);
            montageData.set(photoData4.subarray(rowStartIndex + halfWidth, rowEndIndex), rowStartIndex + halfWidth);
        }
    }
    return montageData;
};

const createHorizontalTwoThirdsMontage = (photoData1, photoData2) => {
    const montageData = new Uint8Array(TOTAL_PIXELS);
    const topHeight = 80;
    const splitPointInPixels = topHeight * WIDTH;

    montageData.set(photoData1.subarray(0, splitPointInPixels));
    montageData.set(photoData2.subarray(splitPointInPixels), splitPointInPixels);
    return montageData;
};

const createHorizontalBarsMontage = (photos) => {
    const [photoData1, photoData2, photoData3] = photos;
    const montageData = new Uint8Array(TOTAL_PIXELS);

    const topHeight = 32;
    const middleHeight = 48;

    const topPixels = topHeight * WIDTH;
    const middleStartPixel = 32 * WIDTH;
    const middleEndPixel = (32 + middleHeight) * WIDTH;
    const bottomStartPixel = (HEIGHT - topHeight) * WIDTH;

    montageData.set(photoData2.subarray(0, topPixels));
    montageData.set(photoData1.subarray(middleStartPixel, middleEndPixel), topPixels);
    montageData.set(photoData3.subarray(bottomStartPixel), topPixels + (middleEndPixel - middleStartPixel));

    return montageData;
};

const createBorderMontage = (photoData1, photoData2) => {
    const montageData = new Uint8Array(photoData2); // Start with the border image
    const innerWidth = 80;
    const innerHeight = 64;

    // Calculate offsets to center the inner image
    const offsetX = (WIDTH - innerWidth) / 2; // (128 - 80) / 2 = 24
    const offsetY = (HEIGHT - innerHeight) / 2; // (112 - 64) / 2 = 24

    for (let y = 0; y < innerHeight; y++) {
        const sourceRowStartIndex = (offsetY + y) * WIDTH + offsetX;
        const sourceRowEndIndex = sourceRowStartIndex + innerWidth;
        const destRowStartIndex = (offsetY + y) * WIDTH + offsetX;
        montageData.set(photoData1.subarray(sourceRowStartIndex, sourceRowEndIndex), destRowStartIndex);
    }
    return montageData;
};

/**
 * Creates a new 128x112 image by combining two photos.
 * The left half of the new image is taken from the first photo,
 * and the right half is taken from the second photo.
 *
 * @param {Array<number[]>} photos An array containing two photo data arrays.
 * Each photo data is a flat array of 14336 (128x112) pixel values (0-3).
 * @returns {number[]} A new flat array of 14336 pixel values for the combined image.
 * @param {'horizontal' | 'vertical' | 'quadrant' | 'four-quadrant' | 'horizontal-2/3' | 'horizontal-bars' | 'border'} splitType The type of split for the montage.
 */
const createMontage = (photos, splitType = 'horizontal') => {
    if (!photos) {
        return [];
    }

    switch (splitType) {
        case 'four-quadrant':
            if (photos.length < 4 || photos.some((p) => !p)) {
                return [];
            }
            return createFourPhotoQuadrantMontage(photos);
        case 'horizontal-bars':
            if (photos.length < 3 || photos.slice(0, 3).some((p) => !p)) {
                return [];
            }
            return createHorizontalBarsMontage(photos);
        case 'horizontal':
        case 'vertical':
        case 'quadrant':
        case 'border':
        case 'horizontal-2/3':
        default: {
            if (photos.length < 2 || !photos[0] || !photos[1]) {
                return [];
            }
            const [photoData1, photoData2] = photos;
            if (splitType === 'vertical') return createVerticalMontage(photoData1, photoData2);
            if (splitType === 'quadrant') return createQuadrantMontage(photoData1, photoData2);
            if (splitType === 'border') return createBorderMontage(photoData1, photoData2);
            if (splitType === 'horizontal-2/3') {
                return createHorizontalTwoThirdsMontage(photoData1, photoData2);
            }
            return createHorizontalMontage(photoData1, photoData2); // Default to horizontal
        }
    }
};

export default createMontage;
