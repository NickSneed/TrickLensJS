const applyPalette = (photoData, palette) => {
    const pixels = new Uint8ClampedArray(photoData.length * 4);

    for (let i = 0; i < photoData.length; i++) {
        const val = photoData[i];
        const color = palette[val];
        const pixelIndex = i * 4;
        pixels[pixelIndex + 0] = color.r;
        pixels[pixelIndex + 1] = color.g;
        pixels[pixelIndex + 2] = color.b;
        pixels[pixelIndex + 3] = 255; // Alpha
    }

    return pixels;
};

export default applyPalette;
