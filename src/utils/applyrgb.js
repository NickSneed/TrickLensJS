const applyRGB = (rData, gData, bData, width, height, brightness = 0, contrast = 0) => {
    const pixels = new Uint8ClampedArray(width * height * 4);
    let intensity = [255, 170, 85, 0];

    // Apply brightness (factor)
    intensity = intensity.map((v) => v + (255 - v) * brightness);

    // Apply contrast
    if (contrast !== 0) {
        const contrastFactor = 1 + Number(contrast);
        intensity = intensity.map((v) => (v - 128) * contrastFactor + 128);
    }

    // Clamp values
    intensity = intensity.map((v) => Math.max(0, Math.min(255, v)));

    for (let i = 0; i < width * height; i++) {
        pixels[i * 4] = intensity[rData[i]]; // red
        pixels[i * 4 + 1] = intensity[gData[i]]; // green
        pixels[i * 4 + 2] = intensity[bData[i]]; // blue
        pixels[i * 4 + 3] = 255;
    }
    return pixels;
};

export default applyRGB;
