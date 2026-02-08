const applyRGB = (rData, gData, bData, width, height, rFactor = 0, gFactor = 0, bFactor = 0) => {
    const pixels = new Uint8ClampedArray(width * height * 4);
    const rIntensity = [255, 170 + (255 - 170) * rFactor, 85 + (255 - 85) * rFactor, 0];
    const gIntensity = [255, 170 + (255 - 170) * gFactor, 85 + (255 - 85) * gFactor, 0];
    const bIntensity = [255, 170 + (255 - 170) * bFactor, 85 + (255 - 85) * bFactor, 0];

    for (let i = 0; i < width * height; i++) {
        pixels[i * 4] = rIntensity[rData[i]]; // red
        pixels[i * 4 + 1] = gIntensity[gData[i]]; // green
        pixels[i * 4 + 2] = bIntensity[bData[i]]; // blue
        pixels[i * 4 + 3] = 255;
    }
    return pixels;
};

export default applyRGB;
