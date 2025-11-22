const WIDTH = 128;
const HEIGHT = 112;

const createHorizontalMontage = (photoData1, photoData2) => {
    const montageData = [];
    const halfHeightInPixels = (WIDTH * HEIGHT) / 2;
    montageData.push(...photoData1.slice(0, halfHeightInPixels));
    montageData.push(...photoData2.slice(halfHeightInPixels));
    return montageData;
};

const createVerticalMontage = (photoData1, photoData2) => {
    const montageData = [];
    const halfWidth = WIDTH / 2;
    for (let y = 0; y < HEIGHT; y++) {
        const rowStartIndex = y * WIDTH;
        montageData.push(...photoData1.slice(rowStartIndex, rowStartIndex + halfWidth));
        montageData.push(...photoData2.slice(rowStartIndex + halfWidth, rowStartIndex + WIDTH));
    }
    return montageData;
};

const createQuadrantMontage = (photoData1, photoData2) => {
    const montageData = [];
    const halfWidth = WIDTH / 2;
    const halfHeight = HEIGHT / 2;

    for (let y = 0; y < HEIGHT; y++) {
        const rowStartIndex = y * WIDTH;

        if (y < halfHeight) {
            // Top-left from photo1, top-right from photo2
            montageData.push(...photoData1.slice(rowStartIndex, rowStartIndex + halfWidth));
            montageData.push(...photoData2.slice(rowStartIndex + halfWidth, rowStartIndex + WIDTH));
        } else {
            // Bottom-left from photo2, bottom-right from photo1
            montageData.push(...photoData2.slice(rowStartIndex, rowStartIndex + halfWidth));
            montageData.push(...photoData1.slice(rowStartIndex + halfWidth, rowStartIndex + WIDTH));
        }
    }
    return montageData;
};

const createFourPhotoQuadrantMontage = (photos) => {
    const [photoData1, photoData2, photoData3, photoData4] = photos;
    const montageData = [];
    const halfWidth = WIDTH / 2;
    const halfHeight = HEIGHT / 2;

    for (let y = 0; y < HEIGHT; y++) {
        const rowStartIndex = y * WIDTH;

        if (y < halfHeight) {
            // Top-left from photo1, top-right from photo2
            montageData.push(...photoData1.slice(rowStartIndex, rowStartIndex + halfWidth));
            montageData.push(...photoData2.slice(rowStartIndex + halfWidth, rowStartIndex + WIDTH));
        } else {
            // Bottom-left from photo3, bottom-right from photo4
            montageData.push(...photoData3.slice(rowStartIndex, rowStartIndex + halfWidth));
            montageData.push(...photoData4.slice(rowStartIndex + halfWidth, rowStartIndex + WIDTH));
        }
    }
    return montageData;
};

const createHorizontalTwoThirdsMontage = (photoData1, photoData2) => {
    const montageData = [];
    const topHeight = 80;
    const splitPointInPixels = topHeight * WIDTH;

    montageData.push(...photoData1.slice(0, splitPointInPixels));
    montageData.push(...photoData2.slice(splitPointInPixels));
    return montageData;
};

const createHorizontalBarsMontage = (photos) => {
    const [photoData1, photoData2, photoData3] = photos;
    const montageData = [];

    const topHeight = 32;
    const middleHeight = 48;

    const topPixels = topHeight * WIDTH;
    const middleStartRow = (HEIGHT - middleHeight) / 2; // 32
    const middleStartPixel = middleStartRow * WIDTH;
    const middleEndPixel = (middleStartRow + middleHeight) * WIDTH; // 80 * 128
    const bottomStartPixel = (HEIGHT - topHeight) * WIDTH; // 80 * 128

    montageData.push(...photoData1.slice(0, topPixels));
    montageData.push(...photoData2.slice(middleStartPixel, middleEndPixel));
    montageData.push(...photoData3.slice(bottomStartPixel));

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
 * @param {'horizontal' | 'vertical' | 'quadrant' | 'four-quadrant' | 'horizontal-2/3' | 'horizontal-bars'} splitType The type of split for the montage.
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
        case 'vertical':
        case 'quadrant':
        case 'horizontal-2/3':
        case 'horizontal':
        default: {
            if (photos.length < 2 || !photos[0] || !photos[1]) {
                return [];
            }
            const [photoData1, photoData2] = photos;
            if (splitType === 'vertical') return createVerticalMontage(photoData1, photoData2);
            if (splitType === 'quadrant') return createQuadrantMontage(photoData1, photoData2);
            if (splitType === 'horizontal-2/3') {
                return createHorizontalTwoThirdsMontage(photoData1, photoData2);
            }
            return createHorizontalMontage(photoData1, photoData2);
        }
    }
};

export default createMontage;
