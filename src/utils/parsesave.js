import chars from '../assets/character.js';

// Define constants
const OFFSETS = {
    PHOTO_DELETED_FLAGS: 0x011d7,
    USERNAME: 0x02f04,
    USERNAME_END: 0x02f0c,
    GENDER: 0x02f0d,
    PHOTO_COMMENT_START: 0x02f15,
    PHOTO_COMMENT_END: 0x02f2f,
    PHOTO_FRAME_ID: 0x02f54,
    PHOTO_DATA_START: 0x2000
};

const SIZES = {
    PHOTO_BLOCK: 0x1000,
    TILE: 16, // bytes
    IMAGE_WIDTH: 128,
    IMAGE_HEIGHT: 112
};

const CONSTANTS = {
    NUM_PHOTOS: 30,
    DELETED_FLAG_VALUE: 0xff, // 255
    GENDER_MALE: 0x01,
    GBC_CHAR_CODE_START: 0x56,
    GBC_CHAR_CODE_END: 0xc8
};

/**
 * Checks if the provided photo data is empty or consists entirely of zero-value pixels.
 * This is used to determine if a photo slot in the save file contains actual image data.
 * @param {Uint8Array | number[]} photoData The pixel data for a photo, as an array of palette indices.
 * @returns {boolean} True if the photo data is considered empty, false otherwise.
 */
const isPhotoDataEmpty = (photoData) => {
    if (!photoData || photoData.length === 0) {
        return true; // An empty array is considered empty.
    }
    // Check if all pixels are the same as the first pixel.
    const firstPixel = photoData[0];
    return photoData.every((pixel) => pixel === firstPixel);
};

/**
 * Extracts pixel data for a single photo from the save file.
 * It reads the 2bpp tile data and maps it to palette indices (0-3).
 * @param {Uint8Array} saveData The raw save data for the Game Boy Camera.
 * @param {number} photoIndex The index of the photo to extract (0-29).
 * @returns {{width: number, height: number, photoData: number[]}} An object containing the image dimensions and a flat array of palette indices.
 */
export const getImgData = (saveData, photoIndex) => {
    const photoOffset = OFFSETS.PHOTO_DATA_START + photoIndex * SIZES.PHOTO_BLOCK;
    const width = SIZES.IMAGE_WIDTH;
    const height = SIZES.IMAGE_HEIGHT;
    const tilesW = width / 8; // 16
    const tilesH = height / 8; // 14

    // Use a Uint8Array for better performance and memory usage with pixel data.
    const decodedData = new Uint8Array(width * height);

    // Iterate through tiles, which is more aligned with the data's structure.
    for (let tileY = 0; tileY < tilesH; tileY++) {
        for (let tileX = 0; tileX < tilesW; tileX++) {
            const tileId = tileY * tilesW + tileX;
            const tileOffset = photoOffset + tileId * SIZES.TILE;

            // Process 8 rows of pixels for the current tile.
            for (let rowInTile = 0; rowInTile < 8; rowInTile++) {
                const byte1 = saveData[tileOffset + rowInTile * 2];
                const byte2 = saveData[tileOffset + rowInTile * 2 + 1];

                // Decode 8 pixels at once for the current row in the tile.
                for (let colInTile = 0; colInTile < 8; colInTile++) {
                    const mask = 0x80 >> colInTile;
                    const bit0 = byte1 & mask ? 1 : 0;
                    const bit1 = byte2 & mask ? 2 : 0; // bit1 is the most significant bit
                    const val = bit1 | bit0;

                    const pixelX = tileX * 8 + colInTile;
                    const pixelY = tileY * 8 + rowInTile;
                    decodedData[pixelY * width + pixelX] = val;
                }
            }
        }
    }
    return { width, height, photoData: decodedData };
};

/**
 * Checks if the photo at the given index is marked as deleted in the save file.
 * @param {Uint8Array} saveData The raw save data.
 * @param {number} photoIndex The index of the photo to check.
 * @returns {boolean} True if the photo is deleted, false otherwise.
 */
export const getIsDeleted = (saveData, photoIndex) => {
    return saveData[OFFSETS.PHOTO_DELETED_FLAGS + photoIndex] === CONSTANTS.DELETED_FLAG_VALUE;
};

/**
 * Converts a Game Boy Camera character code to its corresponding ASCII character.
 * It uses a lookup table for the conversion.
 * @param {number} code The character code from the save file.
 * @returns {string} The corresponding ASCII character, or an empty string if not found.
 */
export const gbcCharToAscii = (code) => {
    if (code >= CONSTANTS.GBC_CHAR_CODE_START && code <= CONSTANTS.GBC_CHAR_CODE_END) {
        return chars[code - CONSTANTS.GBC_CHAR_CODE_START];
    }
    console.log(code);
    return ' ';
};

/**
 * Reads a section of the save data, converts the character codes to ASCII, and returns the resulting string.
 * It iterates over a given address range.
 * @param {Uint8Array} saveData The raw save data.
 * @param {number} start The starting address of the section.
 * @param {number} end The ending address of the section.
 * @param {number} [offset=0] An optional offset to add to the start and end addresses.
 * @returns {string} The decoded string from the specified section.
 */
const convertSection = (saveData, start, end, offset = 0) => {
    let str = '';
    for (let addr = start + offset; addr <= end + offset; addr++) {
        if (saveData[addr]) {
            str += gbcCharToAscii(saveData[addr]);
        } else {
            str += ' ';
        }
    }
    return str;
};

/**
 * Extracts the comment for a specific photo from the save file.
 * @param {Uint8Array} saveData The raw save data.
 * @param {number} photoIndex The index of the photo.convertSection
 * @returns {string} The photo's comment.
 */
export const getComment = (saveData, photoIndex) => {
    const offset = SIZES.PHOTO_BLOCK * photoIndex;
    return convertSection(saveData, OFFSETS.PHOTO_COMMENT_START, OFFSETS.PHOTO_COMMENT_END, offset);
};

/**
 * Extracts the owner's username from the save file.
 * @param {Uint8Array} saveData The raw save data.
 * @returns {string} The owner's username.
 */
export const getUsername = (saveData) => {
    return convertSection(saveData, OFFSETS.USERNAME, OFFSETS.USERNAME_END);
};

/**
 * Extracts the owner's gender from the save file.
 * @param {Uint8Array} saveData The raw save data.
 * @returns {'male' | 'female'} The owner's gender.
 */
export const getGender = (saveData) => {
    return saveData[OFFSETS.GENDER] === CONSTANTS.GENDER_MALE ? 'male' : 'female';
};

/**
 * Extracts the frame ID used for a specific photo from the save file.
 * The value in the save data is 0-indexed, so 1 is added to match the frame filenames (e.g., frame1.png).
 * @param {Uint8Array} saveData The raw save data.
 * @param {number} photoIndex The index of the photo.
 * @returns {string} The frame ID (1-based).
 */
export const getFrameId = (saveData, photoIndex) => {
    const offset = SIZES.PHOTO_BLOCK * photoIndex;
    const frameId = saveData[OFFSETS.PHOTO_FRAME_ID + offset] + 1;
    return String(frameId);
};

/**
 * Converts save data to a JS object.
 * This function parses metadata for all photos, but image pixel data is loaded lazily
 * upon first access to the `photoData` property of an image object.
 * @param {Uint8Array} saveData The raw save data.
 * @returns {object} An object containing all of the save data.
 */
const parseSave = (saveData) => {
    const images = [];
    const array8Bit = new Uint8Array(saveData);

    for (let i = 0; i < CONSTANTS.NUM_PHOTOS; i++) {
        // Use a closure to capture the photo index `i`
        const photoIndex = i;
        let decodedPhotoData = null; // Cache for the decoded data

        let image = {
            width: SIZES.IMAGE_WIDTH,
            height: SIZES.IMAGE_HEIGHT,
            comment: getComment(array8Bit, photoIndex),
            frameId: getFrameId(array8Bit, photoIndex),
            isDeleted: getIsDeleted(array8Bit, photoIndex),
            get photoData() {
                if (decodedPhotoData === null) {
                    // Decode image data on first access and cache it.
                    decodedPhotoData = getImgData(array8Bit, photoIndex).photoData;
                }
                return decodedPhotoData;
            }
        };

        if (!isPhotoDataEmpty(image.photoData)) {
            images.push(image);
        }
    }

    return {
        username: getUsername(array8Bit),
        gender: getGender(array8Bit),
        images: images
    };
};

export default parseSave;
