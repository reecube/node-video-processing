/**
 * @typedef {object} Bitmap
 * @property {number[]} data
 */

/**
 * @typedef {object} Pixel
 * @property {number} red 0 - 255
 * @property {number} green 0 - 255
 * @property {number} blue 0 - 255
 * @property {number} alpha 0 - 255
 */

/**
 * @param {Bitmap} bitmap
 * @param {number} idx
 * @returns {Pixel}
 */
const getPixel = function (bitmap, idx) {
    return {
        red: bitmap.data[idx],
        green: bitmap.data[idx + 1],
        blue: bitmap.data[idx + 2],
        alpha: bitmap.data[idx + 3],
    };
};

/**
 * @param {Bitmap} bitmap
 * @param {number} idx
 * @param {Pixel} pixel
 */
const setPixel = function (bitmap, idx, pixel) {
    bitmap.data[idx] = pixel.red;
    bitmap.data[idx + 1] = pixel.green;
    bitmap.data[idx + 2] = pixel.blue;
    bitmap.data[idx + 3] = pixel.alpha;
};

/**
 * @param {Jimp} frame
 * @returns {Promise<Jimp>}
 */
const onFrame = async function (frame) {

    const threshold = 240;

    const contrast = 40;

    // Manual manipulation
    frame.scan(0, 0, frame.bitmap.width, frame.bitmap.height, function (x, y, idx) {

        const pixel = getPixel(this.bitmap, idx);

        // Ignore pixel with transparency
        if (pixel.alpha < 255) return;

        const total = pixel.red + pixel.green + pixel.blue;
        const avg = total / 3;

        pixel.red = avg;
        pixel.green = avg;
        pixel.blue = avg;

        const grayContrast = Math.round(avg / contrast) * contrast;

        pixel.red = grayContrast;
        pixel.green = grayContrast;
        pixel.blue = grayContrast;

        // pixel.red = Math.round(pixel.red / contrast) * contrast;
        // pixel.green = Math.round(pixel.green / contrast) * contrast;
        // pixel.blue = Math.round(pixel.blue / contrast) * contrast;

        // if (pixel.red < threshold && pixel.green < threshold && pixel.blue < threshold) {
        //     return;
        // }
        //
        // pixel.alpha = 0;

        setPixel(this.bitmap, idx, pixel);
    });

    return frame;
}

module.exports = {getPixel, setPixel, onFrame};
