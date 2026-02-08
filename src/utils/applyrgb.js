const applyRGB = (rData, gData, bData, width, height, brightness = 0, contrast = 0) => {
    const pixels = new Uint8ClampedArray(width * height * 4);
    let intensity = [255, 170, 85, 0];

    const contrastFactor = 1 + Number(contrast);
    const brightnessOffset = Number(brightness) * 255;

    intensity = intensity.map((v) => {
        // Apply contrast first
        let newValue = (v - 128) * contrastFactor + 128;
        // Apply brightness second
        newValue += brightnessOffset;
        return Math.max(0, Math.min(255, newValue));
    });

    for (let i = 0; i < width * height; i++) {
        pixels[i * 4] = intensity[rData[i]]; // red
        pixels[i * 4 + 1] = intensity[gData[i]]; // green
        pixels[i * 4 + 2] = intensity[bData[i]]; // blue
        pixels[i * 4 + 3] = 255;
    }
    return pixels;
};

export default applyRGB;
