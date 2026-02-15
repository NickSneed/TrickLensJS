const reorderPalette = (palette, effect) => {
    let palOrder;
    let orderedMainPalette = [];

    // These match the palette options in the shooting menu
    switch (effect) {
        case 'i':
        case 'invert':
            palOrder = [3, 2, 1, 0];
            break;
        case 'pa':
            palOrder = [0, 2, 1, 3];
            break;
        case 'pb':
            palOrder = [3, 1, 2, 0];
            break;
        case 'pc':
            palOrder = [1, 2, 3, 0];
            break;
        case 'pd':
            palOrder = [3, 0, 1, 2];
            break;
        default:
            palOrder = [0, 1, 2, 3];
    }

    for (let i = 0; i < 4; i++) {
        orderedMainPalette[i] = palette.colors[palOrder[i]];
    }

    return orderedMainPalette;
};

const applyPalette = (pixels, palette, paletteOrder) => {
    const imgData = new Uint8ClampedArray(pixels.length * 4);

    const orderedPalette = reorderPalette(palette, paletteOrder);

    for (let i = 0; i < pixels.length; i++) {
        const val = pixels[i];
        const color = orderedPalette[val];
        const pixelIndex = i * 4;
        imgData[pixelIndex + 0] = color.r;
        imgData[pixelIndex + 1] = color.g;
        imgData[pixelIndex + 2] = color.b;
        imgData[pixelIndex + 3] = 255;
    }

    return imgData;
};

export default applyPalette;
