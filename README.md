# TrickLensJS

A collection of JavaScript tools and assets for the Game Boy Camera™.

## Installation

```bash
npm i github:NickSneed/TrickLensJS
```

## Save parsing

The primary function of this library is to parse raw Game Boy Camera save files (`.sav`).

See the example dir for a sample node app.

## API Reference

### `parseSave(saveData)`

The main export. Parses the entire Game Boy Camera save file.

- **`saveData`**: `Uint8Array | ArrayBuffer` - The raw binary data from the `.sav` file. Can be a Node.js `Buffer`, a standard `Uint8Array`, or an `ArrayBuffer`.
- **Returns**: `object` - An object containing the parsed save data.

The returned object has the following structure:

```js
{
  username: string,
  gender: 'male' | 'female',
  images: [
    {
      width: number,      // Image width (128)
      height: number,     // Image height (112)
      comment: string,    // Photo comment
      frameId: string,    // The ID of the frame used (1-based)
      photoIndex: number, // Index of the photo (deleted photos are -1)
      isDeleted: boolean, // True if the photo slot is marked as deleted
      photoData: number[] // A lazy-loaded array of palette indices (0-3) for each pixel
    },
    ... // (30 images in total)
  ]
}
```

_Save parsing logic was based on gbcam2png and information from Raphael-Boichot's research._

https://github.com/raphnet/gbcam2png

https://github.com/Raphael-Boichot/Inject-pictures-in-your-Game-Boy-Camera-saves

### `applyPalette(photoData, palette, paletteOrder)`

Converts raw pixel data into an RGBA array using a specific palette.

- **`photoData`**: `number[]` - The array of palette indices (0-3) from an image.
- **`palette`**: `object` - A palette object containing a `colors` array of 4 RGB objects (e.g., `{ name: 'Super Game Boy 1A', colors: [{ r: 255, g: 232, b: 207 }, ...] }`).
- **`paletteOrder`**: `string` (optional) - Reorders the palette. Options: `'invert'`, `'pa'`, `'pb'`, `'pc'`, `'pd'`.
- **Returns**: `Uint8ClampedArray` - The RGBA pixel data (4 bytes per pixel).

!Game Boy Camera Palettes

### `applyEffect(photoData, effect)`

Applies a visual effect to the raw pixel data.

- **`photoData`**: `number[]` - The array of palette indices.
- **`effect`**: `string` - The effect to apply.
    - `'invert'`
    - `'mirror-rtl'`, `'mirror-ltr'`, `'mirror-btt'`, `'mirror-ttb'`
    - `'zoom'`, `'zoom-v'`, `'zoom-h'`
    - `'tile'`
- **Returns**: `Uint8Array` - The modified pixel data.

### `createMontage(photos, montageType)`

Combines multiple photos into a single 128x112 image.

- **`photos`**: `number[][]` - An array of photo data arrays.
- **`montageType`**: `string` (optional) - How to arrange the photos. Default is `'horizontal'`.
    - `'horizontal'`, `'vertical'` (Requires 2 photos)
    - `'quadrant'` (Requires 2 photos)
    - `'four-quadrant'` (Requires 4 photos)
    - `'horizontal-2/3'` (Requires 2 photos)
    - `'horizontal-bars'` (Requires 3 photos)
    - `'border'` (Requires 2 photos)
- **Returns**: `Uint8Array` - The combined pixel data.

## Frames

The `frameId` property in the image object corresponds to the index of the frame used for the photo.

| Frame type | Width | Height | Description                                          |
| ---------- | ----- | ------ | ---------------------------------------------------- |
| Raw Image  | `128` | `112`  | The raw sensor data size.                            |
| Standard   | `160` | `144`  | The size of the image with a standard frame applied. |
| Wild       | `160` | `244`  | The size of the image with a wild frame applied.     |

## Related Tools

- TrickLensStudio - https://github.com/NickSneed/TrickLensStudio
- TrickLensCLI - https://github.com/NickSneed/TrickLensCLI

_Game Boy™, Game Boy Camera™, Game Boy Color™, and Super Game Boy™ are registered trademarks of Nintendo._
