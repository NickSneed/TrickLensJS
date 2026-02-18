/**
 * Inverts the colors of the photo.
 * It maps each pixel's palette index to a new one (0->3, 1->2, 2->1, 3->0).
 * @param {number[]} pixels The pixel data for a photo, as an array of palette indices.
 * @returns {number[]} A new array with the inverted colors.
 */
const invert = (pixels) => {
    return pixels.map((pixel) => 3 - pixel);
};

/**
 * Mirrors one half of the photo onto the other half.
 * @param {number[]} pixels The pixel data for a photo, as an array of palette indices.
 * @param {'rtl' | 'ltr' | 'btt' | 'ttb'} direction The direction of mirroring. 'rtl' (right-to-left), 'ltr' (left-to-right), 'btt' (bottom-to-top), 'ttb' (top-to-bottom).
 * @returns {number[]} A new array with the mirrored effect.
 */
const mirror = (pixels, direction) => {
    const width = 128;
    const height = 112;
    // Create a new array to avoid modifying the original pixels.
    const mirroredData = [...pixels];

    if (direction === 'rtl' || direction === 'ltr') {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width / 2; x++) {
                const leftPixelIndex = y * width + x;
                const rightPixelIndex = y * width + (width - 1 - x);
                if (direction === 'rtl') {
                    mirroredData[leftPixelIndex] = pixels[rightPixelIndex];
                } else {
                    // 'ltr'
                    mirroredData[rightPixelIndex] = pixels[leftPixelIndex];
                }
            }
        }
    } else {
        // Vertical mirroring
        for (let y = 0; y < height / 2; y++) {
            for (let x = 0; x < width; x++) {
                const topPixelIndex = y * width + x;
                const bottomPixelIndex = (height - 1 - y) * width + x;
                if (direction === 'btt') {
                    mirroredData[topPixelIndex] = pixels[bottomPixelIndex];
                } else {
                    // 'ttb'
                    mirroredData[bottomPixelIndex] = pixels[topPixelIndex];
                }
            }
        }
    }

    return mirroredData;
};

/**
 * Zooms into the center of the photo by 2x.
 * This crops the image to the central 64x56 area and scales it up to 128x112.
 * @param {number[]} pixels The pixel data for a photo, as an array of palette indices.
 * @param {'center' | 'v' | 'h'} direction The direction of the zoom/stretch. 'center' for 2x zoom, 'v' for vertical, 'h' for horizontal.
 * @returns {number[]} A new array with the zoom effect applied.
 */
const zoom = (pixels, direction) => {
    const width = 128;
    const height = 112;
    const zoomedData = new Array(width * height);

    if (direction === 'center') {
        const sourceWidth = width / 2; // 64
        const sourceHeight = height / 2; // 56
        const startX = (width - sourceWidth) / 2; // 32
        const startY = (height - sourceHeight) / 2; // 28

        for (let y = 0; y < sourceHeight; y++) {
            for (let x = 0; x < sourceWidth; x++) {
                const sourcePixelIndex = (startY + y) * width + (startX + x);
                const pixelValue = pixels[sourcePixelIndex];
                const outX = x * 2;
                const outY = y * 2;
                zoomedData[outY * width + outX] = pixelValue;
                zoomedData[outY * width + (outX + 1)] = pixelValue;
                zoomedData[(outY + 1) * width + outX] = pixelValue;
                zoomedData[(outY + 1) * width + (outX + 1)] = pixelValue;
            }
        }
    } else if (direction === 'v') {
        const sourceHeight = height / 2; // 56
        const startY = (height - sourceHeight) / 2; // 28
        for (let y = 0; y < sourceHeight; y++) {
            for (let x = 0; x < width; x++) {
                const sourcePixelIndex = (startY + y) * width + x;
                const pixelValue = pixels[sourcePixelIndex];
                const outY = y * 2;
                zoomedData[outY * width + x] = pixelValue;
                zoomedData[(outY + 1) * width + x] = pixelValue;
            }
        }
    } else if (direction === 'h') {
        const sourceWidth = width / 2; // 64
        const startX = (width - sourceWidth) / 2; // 32
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < sourceWidth; x++) {
                const sourcePixelIndex = y * width + (startX + x);
                const pixelValue = pixels[sourcePixelIndex];
                const outX = x * 2;
                zoomedData[y * width + outX] = pixelValue;
                zoomedData[y * width + outX + 1] = pixelValue;
            }
        }
    }

    return zoomedData;
};

/**
 * Scales the image down to 1/4 size and tiles it in a 2x2 grid.
 * @param {number[]} pixels The pixel data for a photo, as an array of palette indices.
 * @returns {number[]} A new array with the tile effect applied.
 */
const tile = (pixels) => {
    const width = 128;
    const height = 112;
    const scaledWidth = width / 2;
    const scaledHeight = height / 2;

    // First, create the scaled-down 64x56 image using nearest-neighbor sampling.
    const scaledData = new Array(scaledWidth * scaledHeight);
    for (let y = 0; y < scaledHeight; y++) {
        for (let x = 0; x < scaledWidth; x++) {
            const sourceIndex = y * 2 * width + x * 2;
            scaledData[y * scaledWidth + x] = pixels[sourceIndex];
        }
    }

    // Second, create the final 128x112 image by tiling the scaled-down image.
    const tiledData = new Array(width * height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const sourceX = x % scaledWidth;
            const sourceY = y % scaledHeight;
            tiledData[y * width + x] = scaledData[sourceY * scaledWidth + sourceX];
        }
    }

    return tiledData;
};

/**
 * Flips the photo along the specified axis.
 * @param {number[]} pixels The pixel data for a photo, as an array of palette indices.
 * @param {'v' | 'h'} direction The direction of the flip. 'v' (vertical), 'h' (horizontal).
 * @returns {number[]} A new array with the flip effect applied.
 */
const flip = (pixels, direction) => {
    const width = 128;
    const height = 112;
    const flippedData = new Array(width * height);

    if (direction === 'h') {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const sourceIndex = y * width + (width - 1 - x);
                flippedData[y * width + x] = pixels[sourceIndex];
            }
        }
    } else {
        // 'v'
        for (let y = 0; y < height; y++) {
            const sourceY = height - 1 - y;
            for (let x = 0; x < width; x++) {
                const sourceIndex = sourceY * width + x;
                flippedData[y * width + x] = pixels[sourceIndex];
            }
        }
    }

    return flippedData;
};

/**
 * Applies a specified visual effect to the photo data.
 * @param {number[]} pixels The pixel data for a photo, as an array of palette indices.
 * @param {'invert' | 'mirror-rtl' | 'mirror-ltr' | 'mirror-btt' | 'mirror-ttb' | 'zoom' | 'zoom-v' | 'zoom-h' | 'tile' | 'flip-v' | 'flip-h'} effect The name of the effect to apply.
 * @returns {number[]} A new array with the effect applied. Returns the original data if the effect is not recognized.
 */
const applyEffect = (pixels, effect) => {
    if (effect === 'invert') {
        return invert(pixels);
    } else if (effect === 'mirror-rtl') {
        return mirror(pixels, 'rtl');
    } else if (effect === 'mirror-ltr') {
        return mirror(pixels, 'ltr');
    } else if (effect === 'mirror-btt') {
        return mirror(pixels, 'btt');
    } else if (effect === 'mirror-ttb') {
        return mirror(pixels, 'ttb');
    } else if (effect === 'zoom') {
        return zoom(pixels, 'center');
    } else if (effect === 'zoom-v') {
        return zoom(pixels, 'v');
    } else if (effect === 'zoom-h') {
        return zoom(pixels, 'h');
    } else if (effect === 'tile') {
        return tile(pixels);
    } else if (effect === 'flip-v') {
        return flip(pixels, 'v');
    } else if (effect === 'flip-h') {
        return flip(pixels, 'h');
    }
    return pixels;
};

export default applyEffect;
