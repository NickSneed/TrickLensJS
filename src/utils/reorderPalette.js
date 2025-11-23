/**
 * Reorders a palette based on a given effect.
 * @param {string[]} mainPalette The palette to reorder.
 * @param {string} effect The effect to apply ('i', 'invert', 'pa', 'pb', 'pc', 'pd').
 * @param {string} paletteKey The original key of the palette.
 * @returns {{orderedPalette: string[], newKey: string}} An object containing the reordered palette and the new key.
 */
const reorderPalette = (mainPalette, effect, paletteKey) => {
    // If the palette is empty, we can't reorder it, but we should still update the key.
    if (!mainPalette || mainPalette.length === 0) {
        const newKey = effect && ['i', 'invert', 'pa', 'pb', 'pc', 'pd'].includes(effect) ? `${paletteKey}${effect === 'invert' ? 'i' : effect}` : paletteKey;
        return { orderedPalette: [], newKey };
    }

    let palOrder;
    let newKey = paletteKey;

    switch (effect) {
        case 'i':
        case 'invert':
            palOrder = [3, 2, 1, 0];
            newKey = `${paletteKey}i`;
            break;
        case 'pa':
            palOrder = [3, 1, 2, 0];
            newKey = `${paletteKey}pa`;
            break;
        case 'pb':
            palOrder = [0, 2, 1, 3];
            newKey = `${paletteKey}pb`;
            break;
        case 'pc':
            palOrder = [0, 3, 2, 1];
            newKey = `${paletteKey}pc`;
            break;
        case 'pd':
            palOrder = [2, 1, 0, 3];
            newKey = `${paletteKey}pd`;
            break;
        default:
            palOrder = [0, 1, 2, 3];
    }

    const orderedPalette = palOrder.map((i) => mainPalette[i]).filter((color) => color !== undefined);

    return { orderedPalette, newKey };
};

export default reorderPalette;
