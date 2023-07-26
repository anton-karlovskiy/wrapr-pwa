
const config = require('../config.json');
const utils = require('../utils');
const filesDB = require('../models/file');
const { sendEmail } = require('../services/email-service');

const globalTempPath = {};
const globalVideoPath = {};

const calcXYPosition = (xParam, yParam, scale) => {
    let x = 0;
    let y = 0;
    if (xParam != '' && utils.isNumeric(xParam)) {
        x = Number(xParam) / scale;
    }
    if (yParam != '' && utils.isNumeric(yParam)) {
        y = Number(yParam) / scale;
    }
    if (x < 0) {
        x = 0;
    }
    if (y < 0) {
        y = 0;
    }

    return {x, y}
};

exports.renderStep1 = async (req, res) => {
    try {
        const userId = req.user._id;
        const templatePath = `${config.fileRootPath}${userId}/${config.templatePath}`;

        const background = req.body['background'];
        let backgroundPath;
        let backgroundColor;
        if (background == 1) {
            backgroundPath = `${config.fileRootPath}${req.body['background-path']}`;
        } else {
            backgroundColor = req.body['background-color'];
        }
        const bgWidth = req.body['bg-width'];
        const bgHeight = req.body['bg-height'];
        let headerFooterImages = [];
        if (utils.isSet(req.body['header-footer-images'])) {
            headerFooterImages = req.body['header-footer-images'];
        }

        let command = '';
        if (background == 1) {
            command = `convert -size ${bgWidth}x${bgHeight} xc:skyblue -draw "image over 0,0 ${bgWidth},${bgHeight} '${backgroundPath}'"`;
        } else {
            command = `convert -size ${bgWidth}x${bgHeight} xc:${backgroundColor}`;
        }

        headerFooterImages.forEach(async headerFooterImage => {
            const imagePath = `${config.fileRootPath}${headerFooterImage['image-path']}`;
            const imageWidth = headerFooterImage['image-width'];
            const imageHeight = headerFooterImage['image-height'];
            const { x: imageX, y: imageY } = calcXYPosition(headerFooterImage['image-x'], headerFooterImage['image-y'], 1);
            command += ` -draw "image over ${imageX},${imageY} ${imageWidth},${imageHeight} '${imagePath}'"`;
        });

        await utils.createFolder(templatePath);
        const resultPath = `${templatePath}template-${userId}-${utils.getCurrentDateTimeStr()}.png`;
        command += ' ' + resultPath;
        await utils.execute(command);
        // store path temporarily
        globalTempPath[userId] = {
            render1ResultPath: resultPath
        }; // TODO: double check simultaneous user case and it's error prone

        return res.status(200).json({
            'success': 1
        });
    } catch (error) {
        return res.status(500).json({
            'success': 0,
            'message': error
        });
    }
};

exports.renderStep2 = async (req, res) => {
    try {
        const userId = req.user._id;
        const templatePath = `${config.fileRootPath}${userId}/${config.templatePath}`;
        const { render1ResultPath } = globalTempPath[userId]; // TODO: double check simultaneous user case and it's error prone
        let templateHeight = req.body['template-height'];
        let templateWidth = req.body['template-width'];
        let scale = 1;
        while (templateHeight > 1500 || templateWidth > 1500) {
            templateHeight = templateHeight / 2;
            templateWidth = templateWidth / 2;
            scale = scale * 2;
        }
        // TODO: why following logic
        templateWidth = Math.round(templateWidth);
        if (templateWidth % 2 != 0) {
            templateWidth = templateWidth - 1;
        }
        templateHeight = Math.round(templateHeight);
        if (templateHeight % 2 != 0) {
            templateHeight = templateHeight - 1;
        }

        const videoPath = config.fileRootPath + req.body['video-path'];
        const videoWidth = req.body['video-width'] / scale;
        const videoHeight = req.body['video-height'] / scale;
        const { x: videoX, y: videoY } = calcXYPosition(req.body['video-x'], req.body['video-y'], scale);

        let gifImagesNum = 0;
        let gifImages = [];
        if (utils.isSet(req.body['gif-images'])) {
            gifImages = req.body['gif-images'];
            gifImagesNum = gifImages.length;
        }
        
        let gifImagesInputOperator = '';
        let gifImagesScaleOperator = '';
        let gifImagesPositionOperator = '';
        const gifImagesPath = `${templatePath}gif-images-${utils.generateRandomId()}/`;
        await utils.createFolder(gifImagesPath);
        for (let gifImageIndex = 0; gifImageIndex < gifImages.length; gifImageIndex++) {
            const gifImage = gifImages[gifImageIndex];
            const imageNumber = gifImageIndex + 1;
            let imagePath = config.fileRootPath + gifImage['image-path'];
            const imageType = gifImage['image-type'];
            const imageHeight = gifImage['image-height'] / scale;
            const imageWidth = gifImage['image-width'] / scale;
            const { x: imageX, y: imageY } = calcXYPosition(gifImage['image-x'], gifImage['image-y'], scale);

            let loop;
            if (imageType == 'gif' || imageType == 'GIF') {
                const gifImagePath = `${gifImagesPath}${utils.generateRandomId()}.gif`;
                const command = `convert ${imagePath} -loop 0  -dispose Background ${gifImagePath}`;
                await utils.execute(command);
                loop = ' -ignore_loop 0 -i '; // TODO: not sure about operators
                imagePath = gifImagePath;
            } else {
                loop = ' -loop 1 -i '; // TODO: not sure about operators
            }

            gifImagesInputOperator += loop + imagePath;
            // 0:v is used for background and 1:v is used for video
            gifImagesScaleOperator += `[${imageNumber + 1}:v]scale=${Math.round(imageWidth)}:${Math.round(imageHeight)}[over${imageNumber + 2}];`;  // TODO: not sure about operators
            gifImagesPositionOperator += `[temp${imageNumber + 1}][over${imageNumber + 2}]overlay=x=${Math.round(imageX)}:y=${Math.round(imageY)}:shortest=1[temp${imageNumber + 2}];`;  // TODO: not sure about operators
        }
        
        let textsNum = 0;
        let texts = [];
        if (utils.isSet(req.body['texts'])) {
            texts = req.body['texts'];
            textsNum = texts.length;
        }
        
        // watermark
        const user = req.user;
        if (!user.role || !user.role.videoSubscriber) {
            const waterMarkData = utils.getWaterMarkData(config.waterMarkImagePath);
            if (waterMarkData !== null) {
                const waterMark = {
                    'text-src': waterMarkData,
                    'text-width': 150,
                    'text-height': 55,
                    'text-x': 0,
                    'text-y': 0,
                    'text-repeat': 'yes',
                    'text-animation': 0
                };
                texts.push(waterMark);
            }
            textsNum++;
        }

        let textsInputOperator = '';
        let textsScaleOperator = '';
        let textsPositionOperator = '';
        const textImagesPath = `${templatePath}texts-${utils.generateRandomId()}/`;
        await utils.createFolder(textImagesPath);
        for (let textIndex = 0; textIndex < texts.length; textIndex++) {
            const text = texts[textIndex];
            const textNumber = textIndex + 1;
            const textSrc = text['text-src'];
            const textHeight = text['text-height'] / scale;
            const textWidth = text['text-width'] / scale;
            const { x: textX, y: textY } = calcXYPosition(text['text-x'], text['text-y'], scale);
            const textImagePath = `${textImagesPath}${utils.generateRandomId()}.png`;
            await utils.base64ToImageFile(textSrc, textImagePath);
            textsInputOperator += ` -loop 1 -i ${textImagePath}`;
            // texts laid over gif images regardless of in what order you put elements on frontend
            textsScaleOperator += `[${gifImagesNum + textNumber + 1}:v]scale=${Math.round(textWidth)}:${Math.round(textHeight)}[over${gifImagesNum + textNumber + 2}];`;
            textsPositionOperator += `[temp${gifImagesNum + textNumber + 1}][over${gifImagesNum + textNumber + 2}]overlay=x=${Math.round(textX)}:y=${Math.round(textY)}:shortest=1[temp${gifImagesNum + textNumber + 2}];`;
        }

        const resultVideoName = `video-${userId}-${utils.getCurrentDateStr()}`;
        const resultPath = `${templatePath}${resultVideoName}${utils.getCurrentDateTimeStr()}.mp4`;
        // start rendering command
        let command;
        if (gifImagesNum > 0 && textsNum > 0) {
            command =
                '-loop 1 -i ' + render1ResultPath +
                ' -i ' + videoPath +
                gifImagesInputOperator +
                textsInputOperator +
                ' -c:a aac -strict -2' +
                ' -filter_complex ' +
                '"color=s=' + templateWidth + 'x' + templateHeight + ':c=black[base];' +
                '[0:v]scale=' + templateWidth + ':' + templateHeight + '[over1];' +
                '[1:v]scale=' + Math.round(videoWidth) + ':' + Math.round(videoHeight) + '[over2];' +
                gifImagesScaleOperator +
                textsScaleOperator +
                '[base][over1]overlay=x=0:y=0:shortest=1[temp1];' +
                '[temp1][over2]overlay=x=' + Math.round(videoX) + ':y=' + Math.round(videoY) + ':shortest=1[temp2];' +
                gifImagesPositionOperator +
                utils.subString(textsPositionOperator, 0, -8) + // TODO: -8 is hardcoded and error prone if the number of texts are greater than 9, 2 digits ([temp2]; - 8 letters)
                '" -y ' + resultPath;
            console.log('ray : video rendering(render step 2 case 1) command => ', command);
        } else if (gifImagesNum > 0 && textsNum == 0) {
            // TODO: -8 is hardcoded ([temp2]; - 8 letters)
            gifImagesPositionOperator = utils.subString(gifImagesPositionOperator, 0, -8);
            command = 
                '-loop 1 -i ' + render1ResultPath +
                ' -i ' + videoPath +
                gifImagesInputOperator +
                ' -c:a aac -strict -2' +
                ' -filter_complex ' +
                '"color=s=' + templateWidth + 'x' + templateHeight + ':c=black[base];' +
                '[0:v]scale=' + templateWidth + ':' + templateHeight + '[over1];' +
                '[1:v]scale=' + Math.round(videoWidth) + ':' + Math.round(videoHeight) + '[over2];' +
                gifImagesScaleOperator +
                '[base][over1]overlay=x=0:y=0:shortest=1[temp1];';

            if (gifImagesPositionOperator != '') {
                command += `[temp1][over2]overlay=x=${Math.round(videoX)}:y=${Math.round(videoY)}:shortest=1[temp2];`;
            } else {
                command += `[temp1][over2]overlay=x=${Math.round(videoX)}:y=${Math.round(videoY)}:shortest=1`;
            }
            command += `${gifImagesPositionOperator}" -y ${resultPath}`;
            console.log('ray : video rendering(render step 2 case 2) command => ', command);
        } else if (gifImagesNum == 0 && textsNum > 0) {
            command =
                '-loop 1 -i ' + render1ResultPath +
                ' -i ' + videoPath +
                textsInputOperator +
                ' -c:a aac -strict -2' +
                ' -filter_complex ' +
                '"color=s=' + templateWidth + 'x' + templateHeight + ':c=black[base];' +
                '[0:v]scale=' + templateWidth + ':' + templateHeight + '[over1];' +
                '[1:v]scale=' + Math.round(videoWidth) + ':' + Math.round(videoHeight) + '[over2];' +
                textsScaleOperator +
                '[base][over1]overlay=x=0:y=0:shortest=1[temp1];' +
                '[temp1][over2]overlay=x=' + Math.round(videoX) + ':y=' + Math.round(videoY) + ':shortest=1[temp2];' +
                utils.subString(textsPositionOperator, 0, -8) + 
                '" -y ' + resultPath;
            console.log('ray : video rendering(render step 2 case 3) command => ', command);
        } else {
            command =
                '-loop 1 -i ' + render1ResultPath +
                ' -i ' + videoPath +
                ' -c:a aac -strict -2' +
                ' -filter_complex ' +
                '"color=s=' + templateWidth + 'x' + templateHeight + ':c=black[base];' +
                '[0:v]scale=' + templateWidth + ':' + templateHeight + '[over1];' +
                '[1:v]scale=' + Math.round(videoWidth) + ':' + Math.round(videoHeight) + '[over2];' +
                '[base][over1]overlay=x=0:y=0:shortest=1[temp1];' +
                '[temp1][over2]overlay=x=' + Math.round(videoX) + ':y=' + Math.round(videoY) + ':shortest=1' +
                '" -y ' + resultPath;
            console.log('ray : video rendering(render step 2 case 4) command => ', command);
        }

        globalVideoPath[userId] = {
            render2Command: command,
            render2ResultPath: resultPath
        };

        return res.status(200).json({
            'success': 1
        });
    } catch (error) {
        return res.status(500).json({
            'success': 0,
            'message': error
        });
    }
};

exports.renderStep3 = async (req, res) => {
    const userId = req.user._id;
    const userEmail = req.user.email;
    const templatePath = `${config.fileRootPath}${userId}/${config.templatePath}`;
    let subtitlePath = '';
    try {
        const subtitle = req.body['subtitle'];
        if (subtitle == 1) {
            // TODO: subtitle-url is not supported yet
        } else {
            const subtitleContent = req.body['subtitle-content'];
            if (subtitleContent) {  
                const srtFileName = `srt-${userId}-${utils.getCurrentDateStr()}.srt`;
                subtitlePath = templatePath + srtFileName;
                await utils.writeFile(subtitlePath, subtitleContent, "utf8");
            }
        }

        res.status(200).json({
            'success': 1
        });
    } catch (error) {
        console.log('ray : video rendering(render step 3) error => ', error);
        res.status(500).json({
            'success': 0,
            'message': error
        });
    }

    try {
        const resultVideoName = utils.generateRandomId() + req.body['video-file-name'];
        
        const { render2Command, render2ResultPath } = globalVideoPath[userId];
        // option
        // await utils.ffmpegSpawn(render2Command);
        await utils.ffmpegExecute(render2Command);
        
        const createdVideoPath = `${config.fileRootPath}${userId}/${config.createdVideoPath}`;
        await utils.createFolder(createdVideoPath);

        const resultPath = createdVideoPath + resultVideoName;
        // TODO: later
        // const fontSize = req.body['font-size'];
        // const fontColor = req.body['font-color'];
        if (subtitlePath) {
            const command = `-i ${render2ResultPath} -vf subtitles=${subtitlePath} -c:a copy ${resultPath}`;
            console.log('ray : video rendering(render step 3 stage 1) command => ', command);
            // option
            // await utils.ffmpegSpawn(command);
            await utils.ffmpegExecute(command);
        } else {
            await utils.rename(render2ResultPath, resultPath);
        }

        try {
            // ray test touch <
            utils.removeFiles(templatePath);
            // ray test touch >
        } catch (error) {
            console.log('ray : video rendering(render step 3) removeFiles error => ', error);
        }

        // save to database
        const fileData = {};
        fileData._id = utils.generateRandomId();
        fileData.userId = userId;
        fileData.orgFileName = resultVideoName;
        fileData.fileName = resultVideoName;
        fileData.type = config.createdVideoPath.replace('/', '');
        fileData.mimeType = 'video/mp4';
        fileData.fullPath = `${userId}/${config.createdVideoPath}${fileData.fileName}`;
        fileData.url = fileData.fullPath;
        fileData.intrinsicWidth = 0;
        fileData.intrinsicHeight = 0;
        const file = await filesDB.saveFile(fileData);
        file.url = utils.getFileUrl(file);
        const subject = 'Video rendering finished!';
        const text = 
            'Your video is created, please visit My Videos page to check your video.\n\n'
            + 'The video link is ' + file.url;
        await sendEmail(userEmail, subject, text);
    } catch (error) {
        console.log('ray : video rendering(render step 3 stage 2) error => ', error);
        const subject = 'Video rendering failed!';
        const text = 
            'Sorry, your video is not created for some reason, please create your video again.\n\n'
            + 'For now please render one by one video, concurrently rendering is not much supported.\n\n'
            + ' Possible error is ' + error;
        await sendEmail(userEmail, subject, text);
    }
};
