/**
 * @file This script generates a PNG image that visually represents all available color palettes.
 * It arranges the palettes in a grid, where each palette is shown as a series of color swatches
 * with its name printed below. The resulting image, `palettes.png`, is saved in the `assets` directory.
 * This is a standalone utility script and is not part of the main application flow.
 */
import path from 'path';
import fs from 'fs';
import { createCanvas } from 'canvas';
import { palettes as p } from 'tricklens-js';

const palettes = Object.entries(p);
const palettesPerRow = 4;
const swatchSize = 32;
const swatchGap = 4;
const paletteGap = 30;

const numRows = Math.ceil(palettes.length / palettesPerRow);
const width = palettesPerRow * (swatchSize * 4 + swatchGap * 3 + paletteGap);
const height = numRows * (swatchSize + paletteGap);

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const createPNG = (data) => {
    // Output to an 'output' sub-directory in the current working directory
    const folderPath = path.resolve(process.cwd(), 'src/assets/');

    try {
        // Ensure the output directory exists
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filename = `palettes.png`;
        const filePath = path.join(folderPath, filename);
        console.log(filePath);
        const out = fs.createWriteStream(filePath);
        const stream = data.createPNGStream();

        stream.pipe(out);
    } catch (err) {
        console.log(err);
    }
};

palettes.forEach(([name, colors], i) => {
    const row = Math.floor(i / palettesPerRow);
    const col = i % palettesPerRow;
    const x0 = col * (swatchSize * 4 + swatchGap * 3 + paletteGap);
    const y0 = row * (swatchSize + paletteGap);

    // Draw each color swatch
    colors.colors.forEach((color, j) => {
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
        ctx.fillRect(x0 + j * (swatchSize + swatchGap), y0, swatchSize, swatchSize);
    });

    // Draw palette name
    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.fillText(name, x0, y0 + swatchSize + 14);
});

createPNG(canvas);
