/**
 * @typedef {object} Bitmap
 * @property {number[]} data
 */

/**
 * @typedef {object} Pixel
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 * @property {number} alpha
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

    // Manual manipulation
    frame.scan(0, 0, frame.bitmap.width, frame.bitmap.height, function (x, y, idx) {

        const pixel = getPixel(this.bitmap, idx);

        console.log(pixel);

        pixel.red = pixel.green;
        pixel.green = pixel.blue;
        pixel.blue = pixel.red;
        pixel.alpha = Math.random() * 255;

        setPixel(this.bitmap, idx, pixel);
    });

    return frame;
}

module.exports = {getPixel, setPixel, onFrame};
