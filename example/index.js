import { promises as fs } from 'fs';
import { parseSave } from '../src/main.js';

async function main() {
    try {
        // Read the raw save file data. In Node.js, this returns a Buffer,
        // which is a subclass of Uint8Array.
        const saveData = await fs.readFile('./save.sav');

        // Parse the data
        const parsedData = parseSave(saveData);

        console.log(`Username: ${parsedData.username}`);
        console.log(`Gender: ${parsedData.gender}`);
        console.log(`Found ${parsedData.photos.length} photos.`);

        // Accessing image data (this is lazy-loaded)
        const firstPhoto = parsedData.photos[0];
        if (!firstPhoto.isDeleted) {
            console.log(`First photo comment: ${firstPhoto.comment}`);
            console.log(`First photo frame ID: ${firstPhoto.frameId}`);
            // The `pixels` getter will decode the image on first access.
            const pixelData = firstPhoto.pixels;
            console.log(`First photo has ${pixelData.length} pixels.`);
        }

        console.log(parsedData);
    } catch (error) {
        console.error('Error processing save file:', error);
    }
}

main();
