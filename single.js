const Jimp = require("jimp");

const input = "input.png";
const output = "output.png";

const frameLib = require('./frame');

(async function () {
    let frame = await Jimp.read(input);

    frame = await frameLib.onFrame(frame);

    await frame.writeAsync(output);
})();
