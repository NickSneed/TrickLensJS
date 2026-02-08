const applyRGB = (rData, gData, bData, width, height, factor = 0) => {
    const pixels = new Uint8ClampedArray(width * height * 4);
    const intensity = [255, 170 + (255 - 170) * factor, 85 + (255 - 85) * factor, 255 * factor];

    for (let i = 0; i < width * height; i++) {
        pixels[i * 4] = intensity[rData[i]]; // red
        pixels[i * 4 + 1] = intensity[gData[i]]; // green
        pixels[i * 4 + 2] = intensity[bData[i]]; // blue
        pixels[i * 4 + 3] = 255;
    }
    return pixels;
};

export default applyRGB;
