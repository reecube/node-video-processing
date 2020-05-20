// https://www.pexels.com/video/a-health-worker-wearing-protective-suits-for-protection-4205975/

const Jimp = require("jimp");
const fs = require("fs-extra");
const util = require("util");
const cliProgress = require('cli-progress');

const exec = util.promisify(require("child_process").exec);

const videoEncoder = "h264";
const input = "input.mp4";
const output = "output.mp4";

const pathTemp = 'temp';
const pathTempFramesRaw = `${pathTemp}/raw`;
const pathTempFramesEdited = `${pathTemp}/edited`;

const frameLib = require('./frame');

(async function () {
    console.log("Initializing temporary files");

    await fs.remove(pathTemp);

    await fs.mkdirs(pathTempFramesRaw);
    await fs.mkdirs(pathTempFramesEdited);

    console.log("Decoding");

    await exec(`ffmpeg -i ${input} ${pathTempFramesRaw}/%d.png`);

    console.log("Rendering");

    const framePaths = fs.readdirSync(pathTempFramesRaw);

    let count = 0;

    const barLoading = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    barLoading.start(framePaths.length, count);

    for (const frameFile of framePaths) {
        const framePath = `${pathTempFramesRaw}/${frameFile}`;

        let frame = await Jimp.read(framePath);

        frame = await frameLib.onFrame(frame);

        await frame.writeAsync(framePath.replace(pathTempFramesRaw, pathTempFramesEdited));

        barLoading.update(count++);
    }

    barLoading.stop();

    console.log("Encoding");

    const pathTempNoAudio = `${pathTemp}/no-audio.mp4`;

    await exec(`ffmpeg -start_number 1 -i ${pathTempFramesEdited}/%d.png -vcodec ${videoEncoder} -filter:v "setpts=0.5*PTS" ${pathTempNoAudio}`);

    fs.moveSync(pathTempNoAudio, output);

    console.log("Adding audio");
    let offsetTime = moment().month(0).date(0).hours(0).minutes(0).seconds(0).milliseconds(0);

    for (const input of inputs) {

        await exec(`ffmpeg -itsoffset ${offsetTime.format("HH:mm:ss.SSS")} -i ${pathTempNoAudio} -i ${input} -c copy -map 0:v:0 -map 1:a:0 ${output}`);

        const offset = /(\d+):(\d+):(\d+)\.(\d+)/.exec((await exec(`ffprobe -i ${input} -show_entries format=duration -v quiet -of csv="p=0" -sexagesimal`)).stdout.trim());

        offsetTime.add(offset[1], "hours");
        offsetTime.add(offset[2], "minutes");
        offsetTime.add(offset[3], "seconds");
        // offsetTime.add(offset[4], "milliseconds");
    }

    console.log("Cleaning up");

    await fs.remove(pathTemp);
})();
