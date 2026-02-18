// Super Game Boy™ values were sources from:
// https://gamefaqs.gamespot.com/snes/588731-super-game-boy/faqs/58647

const palettes = {
    sgb1a: {
        name: 'Super Game Boy 1A',
        colors: [
            { r: 255, g: 232, b: 207 },
            { r: 223, g: 144, b: 79 },
            { r: 175, g: 40, b: 32 },
            { r: 48, g: 24, b: 80 }
        ]
    },
    sgb1b: {
        name: 'Super Game Boy 1B',
        colors: [
            { r: 223, g: 216, b: 192 },
            { r: 207, g: 176, b: 112 },
            { r: 176, g: 80, b: 16 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    sgb1c: {
        name: 'Super Game Boy 1C',
        colors: [
            { r: 255, g: 192, b: 255 },
            { r: 239, g: 152, b: 80 },
            { r: 159, g: 56, b: 96 },
            { r: 63, g: 56, b: 159 }
        ]
    },
    sgb1d: {
        name: 'Super Game Boy 1D',
        colors: [
            { r: 255, g: 248, b: 175 },
            { r: 192, g: 128, b: 79 },
            { r: 255, g: 0, b: 0 },
            { r: 80, g: 24, b: 0 }
        ]
    },
    sgb1e: {
        name: 'Super Game Boy 1E',
        colors: [
            { r: 255, g: 248, b: 175 },
            { r: 127, g: 192, b: 127 },
            { r: 111, g: 136, b: 64 },
            { r: 95, g: 56, b: 32 }
        ]
    },
    sgb1f: {
        name: 'Super Game Boy 1F',
        colors: [
            { r: 223, g: 232, b: 255 },
            { r: 224, g: 136, b: 80 },
            { r: 175, g: 0, b: 0 },
            { r: 0, g: 64, b: 16 }
        ]
    },
    sgb1g: {
        name: 'Super Game Boy 1G',
        colors: [
            { r: 0, g: 0, b: 80 },
            { r: 0, g: 160, b: 239 },
            { r: 127, g: 120, b: 0 },
            { r: 255, g: 248, b: 95 }
        ]
    },
    sgb1h: {
        name: 'Super Game Boy 1H',
        colors: [
            { r: 255, g: 232, b: 224 },
            { r: 255, g: 184, b: 143 },
            { r: 128, g: 64, b: 0 },
            { r: 48, g: 24, b: 0 }
        ]
    },
    sgb2a: {
        name: 'Super Game Boy 2A',
        colors: [
            { r: 240, g: 200, b: 160 },
            { r: 192, g: 136, b: 79 },
            { r: 47, g: 120, b: 0 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    sgb2b: {
        name: 'Super Game Boy 2B',
        colors: [
            { r: 255, g: 248, b: 255 },
            { r: 255, g: 232, b: 80 },
            { r: 255, g: 48, b: 0 },
            { r: 80, g: 0, b: 95 }
        ]
    },
    sgb2c: {
        name: 'Super Game Boy 2C',
        colors: [
            { r: 255, g: 192, b: 255 },
            { r: 239, g: 136, b: 143 },
            { r: 127, g: 48, b: 239 },
            { r: 47, g: 40, b: 159 }
        ]
    },
    sgb2d: {
        name: 'Super Game Boy 2D',
        colors: [
            { r: 255, g: 248, b: 160 },
            { r: 0, g: 248, b: 0 },
            { r: 255, g: 48, b: 0 },
            { r: 0, g: 0, b: 80 }
        ]
    },
    sgb2e: {
        name: 'Super Game Boy 2E',
        colors: [
            { r: 255, g: 248, b: 128 },
            { r: 144, g: 176, b: 224 },
            { r: 47, g: 16, b: 96 },
            { r: 16, g: 8, b: 16 }
        ]
    },
    sgb2f: {
        name: 'Super Game Boy 2F',
        colors: [
            { r: 208, g: 248, b: 255 },
            { r: 255, g: 144, b: 80 },
            { r: 160, g: 0, b: 0 },
            { r: 31, g: 0, b: 0 }
        ]
    },
    sgb2g: {
        name: 'Super Game Boy 2G',
        colors: [
            { r: 111, g: 184, b: 63 },
            { r: 224, g: 80, b: 64 },
            { r: 224, g: 184, b: 128 },
            { r: 0, g: 24, b: 0 }
        ]
    },
    sgb2h: {
        name: 'Super Game Boy 2H',
        colors: [
            { r: 255, g: 248, b: 255 },
            { r: 191, g: 184, b: 191 },
            { r: 112, g: 112, b: 112 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    sgb3a: {
        name: 'Super Game Boy 3A',
        colors: [
            { r: 255, g: 208, b: 159 },
            { r: 112, g: 192, b: 192 },
            { r: 255, g: 96, b: 47 },
            { r: 48, g: 72, b: 96 }
        ]
    },
    sgb3b: {
        name: 'Super Game Boy 3B',
        colors: [
            { r: 223, g: 216, b: 192 },
            { r: 224, g: 128, b: 32 },
            { r: 0, g: 80, b: 0 },
            { r: 0, g: 16, b: 16 }
        ]
    },
    sgb3c: {
        name: 'Super Game Boy 3C',
        colors: [
            { r: 224, g: 168, b: 207 },
            { r: 255, g: 248, b: 127 },
            { r: 0, g: 184, b: 255 },
            { r: 32, g: 32, b: 95 }
        ]
    },
    sgb3d: {
        name: 'Super Game Boy 3D',
        colors: [
            { r: 240, g: 248, b: 191 },
            { r: 224, g: 168, b: 127 },
            { r: 15, g: 200, b: 0 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    sgb3e: {
        name: 'Super Game Boy 3E',
        colors: [
            { r: 255, g: 248, b: 191 },
            { r: 224, g: 176, b: 111 },
            { r: 176, g: 120, b: 32 },
            { r: 80, g: 72, b: 112 }
        ]
    },
    sgb3f: {
        name: 'Super Game Boy 3F',
        colors: [
            { r: 127, g: 120, b: 207 },
            { r: 255, g: 104, b: 255 },
            { r: 255, g: 208, b: 0 },
            { r: 64, g: 64, b: 64 }
        ]
    },
    sgb3g: {
        name: 'Super Game Boy 3G',
        colors: [
            { r: 96, g: 216, b: 80 },
            { r: 255, g: 248, b: 255 },
            { r: 207, g: 48, b: 63 },
            { r: 63, g: 0, b: 0 }
        ]
    },
    sgb3h: {
        name: 'Super Game Boy 3H',
        colors: [
            { r: 224, g: 248, b: 160 },
            { r: 127, g: 200, b: 63 },
            { r: 79, g: 136, b: 31 },
            { r: 15, g: 24, b: 0 }
        ]
    },
    sgb4a: {
        name: 'Super Game Boy 4A',
        colors: [
            { r: 240, g: 168, b: 111 },
            { r: 127, g: 168, b: 255 },
            { r: 208, g: 0, b: 208 },
            { r: 0, g: 0, b: 127 }
        ]
    },
    sgb4b: {
        name: 'Super Game Boy 4B',
        colors: [
            { r: 240, g: 232, b: 240 },
            { r: 239, g: 160, b: 96 },
            { r: 64, g: 120, b: 63 },
            { r: 31, g: 8, b: 15 }
        ]
    },
    sgb4c: {
        name: 'Super Game Boy 4C',
        colors: [
            { r: 255, g: 224, b: 224 },
            { r: 223, g: 160, b: 208 },
            { r: 159, g: 160, b: 224 },
            { r: 15, g: 0, b: 0 }
        ]
    },
    sgb4d: {
        name: 'Super Game Boy 4D',
        colors: [
            { r: 255, g: 248, b: 191 },
            { r: 144, g: 200, b: 207 },
            { r: 79, g: 104, b: 127 },
            { r: 15, g: 32, b: 79 }
        ]
    },
    sgb4e: {
        name: 'Super Game Boy 4E',
        colors: [
            { r: 255, g: 224, b: 176 },
            { r: 232, g: 176, b: 120 },
            { r: 120, g: 66, b: 144 },
            { r: 0, g: 10, b: 21 }
        ]
    },
    sgb4f: {
        name: 'Super Game Boy 4F',
        colors: [
            { r: 191, g: 208, b: 208 },
            { r: 223, g: 128, b: 223 },
            { r: 128, g: 0, b: 160 },
            { r: 63, g: 0, b: 0 }
        ]
    },
    sgb4g: {
        name: 'Super Game Boy 4G',
        colors: [
            { r: 176, g: 224, b: 31 },
            { r: 191, g: 32, b: 95 },
            { r: 47, g: 16, b: 0 },
            { r: 0, g: 128, b: 96 }
        ]
    },
    sgb4h: {
        name: 'Super Game Boy 4H',
        colors: [
            { r: 255, g: 248, b: 207 },
            { r: 191, g: 192, b: 95 },
            { r: 128, g: 136, b: 64 },
            { r: 64, g: 80, b: 47 }
        ]
    },
    gbc1: {
        name: 'Game Boy Color 1',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 255, g: 173, b: 99 },
            { r: 132, g: 49, b: 0 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc2: {
        name: 'Game Boy Color 2',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 255, g: 132, b: 132 },
            { r: 148, g: 58, b: 58 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc3: {
        name: 'Game Boy Color 3',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 123, g: 255, b: 49 },
            { r: 0, g: 132, b: 0 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc4: {
        name: 'Game Boy Color 4',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 99, g: 165, b: 255 },
            { r: 0, g: 0, b: 255 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc5: {
        name: 'Game Boy Color 5',
        colors: [
            { r: 255, g: 230, b: 197 },
            { r: 206, g: 156, b: 132 },
            { r: 132, g: 107, b: 41 },
            { r: 90, g: 49, b: 8 }
        ]
    },
    gbc6: {
        name: 'Game Boy Color 6',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 140, g: 140, b: 222 },
            { r: 82, g: 82, b: 140 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc7: {
        name: 'Game Boy Color 7',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 165, g: 165, b: 165 },
            { r: 82, g: 82, b: 82 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc8: {
        name: 'Game Boy Color 8',
        colors: [
            { r: 255, g: 255, b: 165 },
            { r: 255, g: 148, b: 148 },
            { r: 148, g: 148, b: 255 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc9: {
        name: 'Game Boy Color 9',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 255, g: 255, b: 0 },
            { r: 255, g: 0, b: 0 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc10: {
        name: 'Game Boy Color 10',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 255, g: 255, b: 0 },
            { r: 123, g: 74, b: 0 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc11: {
        name: 'Game Boy Color 11',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 82, g: 255, b: 0 },
            { r: 255, g: 66, b: 0 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc12: {
        name: 'Game Boy Color 12',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 123, g: 255, b: 49 },
            { r: 0, g: 99, b: 197 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbc13: {
        name: 'Game Boy Color 13',
        colors: [
            { r: 0, g: 0, b: 0 },
            { r: 0, g: 132, b: 132 },
            { r: 255, g: 222, b: 0 },
            { r: 255, g: 255, b: 255 }
        ]
    },
    gb: {
        name: 'Game Boy DMG',
        colors: [
            { r: 165, g: 198, b: 48 },
            { r: 139, g: 172, b: 48 },
            { r: 48, g: 98, b: 48 },
            { r: 15, g: 56, b: 48 }
        ]
    },
    vb: {
        name: 'Virtual Boy',
        colors: [
            { r: 230, g: 10, b: 40 },
            { r: 136, g: 10, b: 40 },
            { r: 68, g: 10, b: 40 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    bw1: {
        name: 'Black and White 1',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 0, g: 0, b: 0 },
            { r: 0, g: 0, b: 0 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    bw2: {
        name: 'Black and White 2',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 255, g: 255, b: 255 },
            { r: 0, g: 0, b: 0 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    bw3: {
        name: 'Black and White 3',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 255, g: 255, b: 255 },
            { r: 255, g: 255, b: 255 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    sepia: {
        name: 'Sepia',
        colors: [
            { r: 245, g: 239, b: 188 },
            { r: 222, g: 195, b: 149 },
            { r: 178, g: 142, b: 110 },
            { r: 104, g: 60, b: 52 }
        ]
    },
    gbcm1: {
        name: 'GBCM 1',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 160, g: 160, b: 160 },
            { r: 80, g: 80, b: 80 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbcm2: {
        name: 'GBCM 2',
        colors: [
            { r: 155, g: 188, b: 15 },
            { r: 128, g: 159, b: 14 },
            { r: 48, g: 98, b: 48 },
            { r: 15, g: 56, b: 15 }
        ]
    },
    gbcm3: {
        name: 'GBCM 3',
        colors: [
            { r: 224, g: 248, b: 208 },
            { r: 136, g: 192, b: 112 },
            { r: 52, g: 104, b: 86 },
            { r: 8, g: 24, b: 32 }
        ]
    },
    gbcm4: {
        name: 'GBCM 4',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 103, g: 228, b: 33 },
            { r: 14, g: 95, b: 175 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    gbcm5: {
        name: 'GBCM 5',
        colors: [
            { r: 255, g: 239, b: 206 },
            { r: 222, g: 148, b: 75 },
            { r: 173, g: 41, b: 33 },
            { r: 49, g: 25, b: 82 }
        ]
    },
    b1: {
        name: 'Bonus 1',
        colors: [
            { r: 248, g: 227, b: 196 },
            { r: 204, g: 52, b: 149 },
            { r: 107, g: 31, b: 177 },
            { r: 11, g: 6, b: 48 }
        ]
    },
    b2: {
        name: 'Bonus 2',
        colors: [
            { r: 161, g: 239, b: 140 },
            { r: 63, g: 172, b: 149 },
            { r: 68, g: 97, b: 118 },
            { r: 44, g: 33, b: 55 }
        ]
    },
    b3: {
        name: 'Bonus 3',
        colors: [
            { r: 240, g: 240, b: 240 },
            { r: 143, g: 155, b: 246 },
            { r: 171, g: 70, b: 70 },
            { r: 22, g: 22, b: 22 }
        ]
    },
    b4: {
        name: 'Bonus 4',
        colors: [
            { r: 232, g: 214, b: 192 },
            { r: 146, g: 147, b: 141 },
            { r: 161, g: 40, b: 28 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    b5: {
        name: 'Bonus 5',
        colors: [
            { r: 254, g: 208, b: 24 },
            { r: 211, g: 86, b: 0 },
            { r: 94, g: 18, b: 16 },
            { r: 13, g: 4, b: 5 }
        ]
    },
    b6: {
        name: 'Bonus 6',
        colors: [
            { r: 247, g: 219, b: 126 },
            { r: 224, g: 110, b: 22 },
            { r: 25, g: 105, b: 44 },
            { r: 20, g: 43, b: 35 }
        ]
    },
    b7: {
        name: 'Bonus 7',
        colors: [
            { r: 202, g: 245, b: 50 },
            { r: 116, g: 175, b: 52 },
            { r: 92, g: 79, b: 163 },
            { r: 86, g: 29, b: 23 }
        ]
    },
    b8: {
        name: 'Bonus 8',
        colors: [
            { r: 254, g: 208, b: 24 },
            { r: 143, g: 155, b: 246 },
            { r: 68, g: 97, b: 118 },
            { r: 13, g: 4, b: 5 }
        ]
    },
    b9: {
        name: 'Bonus 9',
        colors: [
            { r: 224, g: 198, b: 148 },
            { r: 148, g: 206, b: 224 },
            { r: 148, g: 158, b: 224 },
            { r: 97, g: 85, b: 62 }
        ]
    },
    b10: {
        name: 'Bonus 10',
        colors: [
            { r: 247, g: 231, b: 255 },
            { r: 148, g: 242, b: 167 },
            { r: 168, g: 135, b: 222 },
            { r: 44, g: 71, b: 21 }
        ]
    },
    b11: {
        name: 'Super Game Boy 2H with pure white',
        colors: [
            { r: 255, g: 255, b: 255 },
            { r: 191, g: 184, b: 191 },
            { r: 112, g: 112, b: 112 },
            { r: 0, g: 0, b: 0 }
        ]
    }
};

export default palettes;
