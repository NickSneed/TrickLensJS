import { describe, it, expect, vi, beforeEach } from 'vitest';
import chars from '../assets/character.js';

// Mocks
vi.mock('../assets/characters.js', () => ({
    default: vi.fn(() => {
        return chars;
    })
}));

// Import mocked modules and the function to test
import { getIsDeleted, getGender, getFrameId, getComment, getUsername, getImgData } from './saveparser.js';

describe('saveParser', () => {
    let saveData = [];

    beforeEach(() => {
        saveData = [];
    });

    it('getFrameId should return an id', () => {
        saveData[0x02f54 + 0x01000] = 0;
        const result = getFrameId(saveData, 1);
        expect(result).toEqual('1');
    });

    it('getGender should return female for 0x02', () => {
        saveData[0x02f0d] = 0x02;
        const result = getGender(saveData);
        expect(result).toEqual('female');
    });

    it('getGender should return male for 0x01', () => {
        saveData[0x02f0d] = 0x01;
        const result = getGender(saveData);
        expect(result).toEqual('male');
    });

    it('getIsDeleted should return true', () => {
        saveData[0x011d7 + 1] = 255;
        const result = getIsDeleted(saveData, 1);
        expect(result).toEqual(true);
    });

    it('getIsDeleted should return false', () => {
        saveData[0x011d7 + 1] = 254;
        const result = getIsDeleted(saveData, 1);
        expect(result).toEqual(false);
    });

    it('getComment should return a comment', () => {
        saveData[0x02f15 + 0x01000] = 0x56;
        saveData[0x02f15 + 0x01001] = 0x57;
        saveData[0x02f15 + 0x01002] = 0x58;
        const result = getComment(saveData, 1);
        expect(result).toEqual('ABC');
    });

    it('getComment should return null', () => {
        const result = getComment(saveData, 1);
        expect(result).toBeNull;
    });

    it('getUsername should return ABC', () => {
        saveData[0x02f04] = 0x56;
        saveData[0x02f05] = 0x57;
        saveData[0x02f06] = 0x58;
        const result = getUsername(saveData, 1);
        expect(result).toEqual('ABC');
    });

    it('Should return an empty string when character is undefined', () => {
        saveData[0x02f04] = 0x10;
        const result = getUsername(saveData, 1);
        expect(result).toEqual('');
    });

    it('getImgData should return accurate results', () => {
        saveData[0x02f04] = 0x10;

        const result = getImgData(saveData, 1);

        // Expect correct results format
        expect(result.width).toEqual(128);
        expect(result.height).toEqual(112);
        expect(result.photoData).toBeTypeOf('object');
    });
});
