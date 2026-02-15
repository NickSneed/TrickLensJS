const WIDTH = 128;
const HEIGHT = 112;
const TOTAL_PIXELS = WIDTH * HEIGHT;

/**
 * Creates a montage where the top half is from the first photo and the bottom half is from the second photo.
 * @param {Uint8Array} pixels1 The pixel data for the first photo.
 * @param {Uint8Array} pixels2 The pixel data for the second photo.
 * @returns {Uint8Array} The combined pixel data.
 */
const createHorizontalMontage = (pixels1, pixels2) => {
    const montageData = new Uint8Array(TOTAL_PIXELS);
    const halfHeightInPixels = TOTAL_PIXELS / 2;
    montageData.set(pixels1.subarray(0, halfHeightInPixels));
    montageData.set(pixels2.subarray(halfHeightInPixels), halfHeightInPixels);
    return montageData;
};

/**
 * Creates a montage where the left half is from the first photo and the right half is from the second photo.
 * @param {Uint8Array} pixels1 The pixel data for the first photo.
 * @param {Uint8Array} pixels2 The pixel data for the second photo.
 * @returns {Uint8Array} The combined pixel data.
 */
const createVerticalMontage = (pixels1, pixels2) => {
    const montageData = new Uint8Array(TOTAL_PIXELS);
    const halfWidth = WIDTH / 2;
    for (let y = 0; y < HEIGHT; y++) {
        const rowStartIndex = y * WIDTH;
        const rowEndIndex = rowStartIndex + WIDTH;
        montageData.set(pixels1.subarray(rowStartIndex, rowStartIndex + halfWidth), rowStartIndex);
        montageData.set(pixels2.subarray(rowStartIndex + halfWidth, rowEndIndex), rowStartIndex + halfWidth);
    }
    return montageData;
};

/**
 * Creates a checkerboard quadrant montage from two photos.
 * Top-Left: Photo 1, Top-Right: Photo 2
 * Bottom-Left: Photo 2, Bottom-Right: Photo 1
 * @param {Uint8Array} pixels1 The pixel data for the first photo.
 * @param {Uint8Array} pixels2 The pixel data for the second photo.
 * @returns {Uint8Array} The combined pixel data.
 */
const createQuadrantMontage = (pixels1, pixels2) => {
    const montageData = new Uint8Array(TOTAL_PIXELS);
    const halfWidth = WIDTH / 2;
    const halfHeight = HEIGHT / 2;

    for (let y = 0; y < HEIGHT; y++) {
        const rowStartIndex = y * WIDTH;
        const rowEndIndex = rowStartIndex + WIDTH;

        if (y < halfHeight) {
            // Top-left from photo1, top-right from photo2
            montageData.set(pixels1.subarray(rowStartIndex, rowStartIndex + halfWidth), rowStartIndex);
            montageData.set(pixels2.subarray(rowStartIndex + halfWidth, rowEndIndex), rowStartIndex + halfWidth);
        } else {
            // Bottom-left from photo2, bottom-right from photo1
            montageData.set(pixels2.subarray(rowStartIndex, rowStartIndex + halfWidth), rowStartIndex);
            montageData.set(pixels1.subarray(rowStartIndex + halfWidth, rowEndIndex), rowStartIndex + halfWidth);
        }
    }
    return montageData;
};

/**
 * Creates a quadrant montage from four different photos.
 * Top-Left: Photo 1, Top-Right: Photo 2
 * Bottom-Left: Photo 3, Bottom-Right: Photo 4
 * @param {Uint8Array[]} photos An array of 4 pixel data arrays.
 * @returns {Uint8Array} The combined pixel data.
 */
const createFourPhotoQuadrantMontage = (photos) => {
    const [pixels1, pixels2, pixels3, pixels4] = photos;
    const montageData = new Uint8Array(TOTAL_PIXELS);
    const halfWidth = WIDTH / 2;
    const halfHeight = HEIGHT / 2;

    for (let y = 0; y < HEIGHT; y++) {
        const rowStartIndex = y * WIDTH;
        const rowEndIndex = rowStartIndex + WIDTH;

        if (y < halfHeight) {
            // Top-left from photo1, top-right from photo2
            montageData.set(pixels1.subarray(rowStartIndex, rowStartIndex + halfWidth), rowStartIndex);
            montageData.set(pixels2.subarray(rowStartIndex + halfWidth, rowEndIndex), rowStartIndex + halfWidth);
        } else {
            // Bottom-left from photo3, bottom-right from photo4
            montageData.set(pixels3.subarray(rowStartIndex, rowStartIndex + halfWidth), rowStartIndex);
            montageData.set(pixels4.subarray(rowStartIndex + halfWidth, rowEndIndex), rowStartIndex + halfWidth);
        }
    }
    return montageData;
};

/**
 * Creates a montage with a 2/3 horizontal split.
 * The top 80 pixels height is from the first photo, and the bottom rest is from the second photo.
 * @param {Uint8Array} pixels1 The pixel data for the first photo.
 * @param {Uint8Array} pixels2 The pixel data for the second photo.
 * @returns {Uint8Array} The combined pixel data.
 */
const createHorizontalTwoThirdsMontage = (pixels1, pixels2) => {
    const montageData = new Uint8Array(TOTAL_PIXELS);
    const topHeight = 80;
    const splitPointInPixels = topHeight * WIDTH;

    montageData.set(pixels1.subarray(0, splitPointInPixels));
    montageData.set(pixels2.subarray(splitPointInPixels), splitPointInPixels);
    return montageData;
};

/**
 * Creates a montage with three horizontal bars.
 * Top bar (32px): Photo 2
 * Middle bar (48px): Photo 1
 * Bottom bar (32px): Photo 3
 * @param {Uint8Array[]} photos An array of 3 pixel data arrays.
 * @returns {Uint8Array} The combined pixel data.
 */
const createHorizontalBarsMontage = (photos) => {
    const [pixels1, pixels2, pixels3] = photos;
    const montageData = new Uint8Array(TOTAL_PIXELS);

    const topHeight = 32;
    const middleHeight = 48;

    const topPixels = topHeight * WIDTH;
    const middleStartPixel = 32 * WIDTH;
    const middleEndPixel = (32 + middleHeight) * WIDTH;
    const bottomStartPixel = (HEIGHT - topHeight) * WIDTH;

    montageData.set(pixels2.subarray(0, topPixels));
    montageData.set(pixels1.subarray(middleStartPixel, middleEndPixel), topPixels);
    montageData.set(pixels3.subarray(bottomStartPixel), topPixels + (middleEndPixel - middleStartPixel));

    return montageData;
};

/**
 * Creates a montage where the first photo is placed in the center of the second photo.
 * The inner image is 80x64 pixels.
 * @param {Uint8Array} pixels1 The inner photo pixel data.
 * @param {Uint8Array} pixels2 The outer/border photo pixel data.
 * @returns {Uint8Array} The combined pixel data.
 */
const createBorderMontage = (pixels1, pixels2) => {
    const montageData = new Uint8Array(pixels2); // Start with the border image
    const innerWidth = 80;
    const innerHeight = 64;

    // Calculate offsets to center the inner image
    const offsetX = (WIDTH - innerWidth) / 2; // (128 - 80) / 2 = 24
    const offsetY = (HEIGHT - innerHeight) / 2; // (112 - 64) / 2 = 24

    for (let y = 0; y < innerHeight; y++) {
        const sourceRowStartIndex = (offsetY + y) * WIDTH + offsetX;
        const sourceRowEndIndex = sourceRowStartIndex + innerWidth;
        const destRowStartIndex = (offsetY + y) * WIDTH + offsetX;
        montageData.set(pixels1.subarray(sourceRowStartIndex, sourceRowEndIndex), destRowStartIndex);
    }
    return montageData;
};

/**
 * Converts the input data to a Uint8Array if it isn't one already.
 * @param {Uint8Array|number[]} data The data to convert.
 * @returns {Uint8Array} The data as a Uint8Array.
 */
const toUint8 = (data) => {
    if (data instanceof Uint8Array) return data;
    return new Uint8Array(data);
};

/**
 * Creates a new 128x112 image by combining multiple photos based on the specified montage type.
 * @param {Array<Uint8Array|number[]>} photos An array containing photo data arrays.
 * @param {'horizontal' | 'vertical' | 'quadrant' | 'four-quadrant' | 'horizontal-2/3' | 'horizontal-bars' | 'border'} montageType The type of split for the montage.
 * @returns {Uint8Array} A new flat array of 14336 pixel values for the combined image.
 */
const createMontage = (photos, montageType = 'horizontal') => {
    if (!photos) {
        return new Uint8Array(0);
    }

    switch (montageType) {
        case 'four-quadrant':
            if (photos.length < 4 || photos.some((p) => !p)) {
                return new Uint8Array(0);
            }
            return createFourPhotoQuadrantMontage(photos.map(toUint8));
        case 'horizontal-bars':
            if (photos.length < 3 || photos.slice(0, 3).some((p) => !p)) {
                return new Uint8Array(0);
            }
            return createHorizontalBarsMontage(photos.map(toUint8));
        case 'horizontal':
        case 'vertical':
        case 'quadrant':
        case 'border':
        case 'horizontal-2/3':
        default: {
            if (photos.length < 2 || !photos[0] || !photos[1]) {
                return new Uint8Array(0);
            }
            const pixels1 = toUint8(photos[0]);
            const pixels2 = toUint8(photos[1]);

            if (montageType === 'vertical') return createVerticalMontage(pixels1, pixels2);
            if (montageType === 'quadrant') return createQuadrantMontage(pixels1, pixels2);
            if (montageType === 'border') return createBorderMontage(pixels1, pixels2);
            if (montageType === 'horizontal-2/3') {
                return createHorizontalTwoThirdsMontage(pixels1, pixels2);
            }
            return createHorizontalMontage(pixels1, pixels2); // Default to horizontal
        }
    }
};

export default createMontage;
