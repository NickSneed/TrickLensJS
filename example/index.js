import { promises as fs } from 'fs';
import { parseSave } from '../src/main.js';

async function main() {
    try {
        // Read the raw save file data. In Node.js, this returns a Buffer,
        // which is a subclass of Uint8Array.
        const saveData = await fs.readFile('./your-save-file.sav');

        // Parse the data
        const parsedData = parseSave(saveData);

        console.log(`Username: ${parsedData.username}`);
        console.log(`Gender: ${parsedData.gender}`);
        console.log(`Found ${parsedData.images.length} images.`);

        // Accessing image data (this is lazy-loaded)
        const firstImage = parsedData.images[0];
        if (!firstImage.isDeleted) {
            console.log(`First image comment: ${firstImage.comment}`);
            console.log(`First image frame ID: ${firstImage.frameId}`);
            // The `photoData` getter will decode the image on first access.
            const pixelData = firstImage.photoData;
            console.log(`First image has ${pixelData.length} pixels.`);
        }

        console.log(parsedData);
    } catch (error) {
        console.error('Error processing save file:', error);
    }
}

main();
