
const fs = require('fs');
const childProcess = require('child_process');
const { ObjectID } = require('bson');
const base64Img = require('base64-img');
const util = require("util");
const spawn = require('child-process-promise').spawn;

const config = require('../config.json');

exports.createFolder = async targetDir => {
    const promisedMkDir = util.promisify(fs.mkdir);
    try {
        await promisedMkDir(targetDir, { recursive: true });
    } catch (error) {
        console.log('ray : utils createFolder error => ', error);
    }
};

exports.dirname = path => {
    return path.replace(/\\/g, '/')
      .replace(/\/[^/]*\/?$/, '');
};

exports.base64ToImageFile = async (base64_string, output_file) => {
    const data = base64_string.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(data, 'base64');
    const promisedWriteFile = util.promisify(fs.writeFile);
    await promisedWriteFile(output_file, buffer);
};

exports.writeFile = async (path, data, option) => {
    const promisedWriteFile = util.promisify(fs.writeFile);
    await promisedWriteFile(path, data, option);
};

exports.isNumeric = n => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

exports.isSet = object => {
    return typeof object !== 'undefined';
};

exports.isVideoType = type => {
    if (!exports.isSet(type)) {
        return false;
    }
    
    return type.indexOf('video') === 0;
};

exports.isImageType = type => {
    if (!exports.isSet(type)) {
        return false;
    }
    
    return type.indexOf('image') === 0;
};

exports.getCurrentDateTimeStr = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = '' + (date.getMonth() + 1);
    const day = '' + date.getDate();
    let time = '' + date.getHours();
    time += '' + date.getMinutes();
    time += '' + date.getSeconds();
    time += '_' + date.getMilliseconds();
    
    return [year, month, day, time].join('-');
};

exports.getCurrentDateStr = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = '' + (date.getMonth() + 1);
    const day = '' + date.getDate();
    
    return [year, month, day].join('-');
};

exports.execute = async command => {
    const promisedExec = util.promisify(childProcess.exec);
    const { stdout, stderr } = await promisedExec(command);
    console.log('ray : utils execute stdout, stderr => ', stdout, stderr);
};

exports.ffmpegExecute = async command => {
    const promisedExec = util.promisify(childProcess.exec);
    const { stdout, stderr } = await promisedExec(`ffmpeg ${command}`, {maxBuffer: 1024 * config.maxBuffer});
    console.log('ray : utils execute stdout, stderr => ', stdout, stderr);
}

exports.ffmpegSpawn = async command => {
    const processed = command.replace('"', '');
    const args = processed.split(' ');
    const promise = await spawn('ffmpeg', [...args]);
    const childProcess = promise.childProcess;
    console.log('[spawn] **************************************************************** childProcess.pid: ', childProcess.pid);
    childProcess.stdout.on('data', function (data) {
        console.log('[spawn] **************************************************************** stdout: ', data.toString());
    });
    childProcess.stderr.on('data', function (data) {
        console.log('[spawn] **************************************************************** stderr: ', data.toString());
    });
};

exports.removeFile = async path => {
    const promisedUnlink = util.promisify(fs.unlink);
    await promisedUnlink(path);
};

exports.rename = async (oldPath, newPath) => {
    const promisedRename = util.promisify(fs.rename);
    await promisedRename(oldPath, newPath);
};

exports.removeFiles = async directory => {
    const promisedReadDir = util.promisify(fs.readdir);
    const promisedStat = util.promisify(fs.stat);
    const promisedUnlink = util.promisify(fs.unlink);
    const promisedRmDir = util.promisify(fs.rmdir);
    const files = await promisedReadDir(directory);
    for (const file of files) {
        const filePath = `${directory}/${file}`;
        const stats = await promisedStat(filePath);
        if (stats.isFile()) {
            await promisedUnlink(filePath);
        } else {
            await exports.removeFiles(filePath);
        }
    }
    await promisedRmDir(directory);
};

exports.getMainServerURL = () => {
    // ray test touch <
    // TODO: * hardcoded & error prone -> one string is better without breakpoints e.g. https://localhost:3001
    // TODO: https for PWA
    return 'http://' + config.fileServerHost + ':' + config.mainServerPort + '/';
    // ray test touch >
};

exports.getFileServerURL = () => {
    // ray test touch <
    // TODO: * hardcoded & error prone -> one string is better without breakpoints e.g. https://localhost:3001
    // TODO: https for PWA
    return 'http://' + config.fileServerHost + ':' + config.fileServerPort + '/';
    // ray test touch >
};

exports.subString = (str, start, end) => {
    if (end >= 0) {
        return str.substr(start, end);
    }

    return str.substr(start, str.length + end);
};

exports.generateRandomId = () => {
    return new ObjectID().toString();
};

exports.getFileUrl = file => {
    video = exports.isVideoType(file.mimeType);
    if (video) {
        return exports.getMainServerURL() + 'api/stream/' + file._id;
    }

    return exports.getFileServerURL() + file.fullPath;
};

exports.getWaterMarkData = path => {
    try {
        const data = base64Img.base64Sync(path);
        return data;
    } catch(error) {
        console.log('ray : [utils getWaterMarkData] error => ', error);
        return null;
    }    
};

exports.getUserPayload = user => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        stripe: user.stripe
    }
};