
const multer = require('multer');
const path = require('path');
const url  = require('url');
process.env.FFPROBE_PATH = '/usr/bin/ffprobe';
const ffprobe = require('ffprobe-client');
const imageSize = require('image-size');

const config = require('../config.json');
const filesDB = require('../models/file');
const utils = require('../utils');

const getFilePath = (userId, type, public) => {
    if (!public) {
        return config.fileRootPath + userId + '/' + type;
    }

    return config.fileRootPath + config.filePublicPath + type;
};

const getFileType = req => {
    const url_parts = url.parse(req.url, true);

    if (utils.isSet(url_parts.query.type)) {
        return url_parts.query.type;
    }

    return 'unknown'; 
};

const isPublic = req => {
    const url_parts = url.parse(req.url, true);

    if (utils.isSet(url_parts.query.public)) {
        return url_parts.query.public == 1;
    }

    return false;
};

const isAdmin = req => {
    return req.user.role.admin;
};

const convertFileName = name => {
    return Buffer.from(path.parse(name).name).toString('base64') + path.parse(name).ext;
};

const saveToDB = async function(files, id, type, public) {
    // save files to database
    let result = [];
    for (let i = 0; i < files.length; i++) {
        const fileData = {};
        fileData._id = utils.generateRandomId();
        fileData.userId = public ? '' : id;
        fileData.orgFileName = files[i].originalname;        
        fileData.fileName = files[i].filename;
        fileData.type = type;
        fileData.mimeType = files[i].mimetype;
        fileData.fullPath = (public ? config.filePublicPath : (id + '/')) + type + '/' + fileData.fileName;
        fileData.url = fileData.fullPath;
        if (utils.isVideoType(fileData.mimeType)) {
            // TODO: * url join utilty recommended
            const videoFile = getFilePath(id, type, public) + '/' + fileData.fileName;
            // TODO: github star numbers are not many, might be error prone
            const data = await ffprobe(videoFile);
            for (const stream of data.streams) {
                if (stream.width) {
                    fileData.intrinsicWidth = stream.width;
                }
                if (stream.height) {
                    fileData.intrinsicHeight = stream.height;
                }
            }
        } else if(utils.isImageType(fileData.mimeType)) {
            const imageFile = getFilePath(id, type, public) + '/' + fileData.fileName;
            const intrinsicSize = imageSize(imageFile);
            fileData.intrinsicWidth = intrinsicSize.width;
            fileData.intrinsicHeight = intrinsicSize.height;
        }

        const file = await filesDB.saveFile(fileData);
        file.url = utils.getFileUrl(file);
        result.push(file);
    }

    return result;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, getFilePath(req.user._id, getFileType(req), isPublic(req)));
    },
    filename: function (req, file, cb) {
        cb(null, convertFileName(Date.now() + '-' + file.originalname));
    }
});

const upload = multer({ storage: storage }).array('file');

exports.uploadFile = async function(req, res) {
    const type = getFileType(req); 
    const public = isPublic(req);
    console.log('ray : [file route uploadFile] type, public => ', type, public);

    // check privilege
    if (public && !isAdmin(req)) {
        return res.status(401).json({
            message : "Permission denied to upload public files."
        });
    }

    // creat a folder for upload
    const path = getFilePath(req.user._id, type, public);
    console.log('ray : [file route uploadFile] path => ', path);
    await utils.createFolder(path);
    
    // upload
    upload(req, res, async function (error) {
        if (error instanceof multer.MulterError) {
            console.log('ray : [file route uploadFile] error case 1 => ', error);
            return res.status(500).json(error);
        } else if (error) {
            console.log('ray : [file route uploadFile] error case 2 => ', error);
            return res.status(500).json(error);
        }

        try {
            const files = await saveToDB(req.files, req.user._id, type, public);
            return res.status(200).send(files);
        } catch (error) {
            console.log('ray : [file route upload] error => ', error);
            return res.status(500).send({
                message: 'Oops something went wrong!'
            });
        }
    });
}

// get all files
exports.getFiles = function(req, res) {
    const userId = isPublic(req) ? '' : req.user._id;
    filesDB.getFiles(userId, getFileType(req))
        .then(files => {
            return res.status(200).send(files);
        })
        .catch(error => {
            return res.status(500).json(error);
        })
}

// get the file by id
exports.getFile = function(req, res) {
    const userId = isPublic(req) ? '' : req.user._id;
    filesDB.getFile(userId, req.params.id)
        .then(file => {
            return res.status(200).send(file);
        })
        .catch(error => {
            return res.status(500).json(error);
        });
}

// delete the file by id
exports.deleteFile = async function(req, res) {
    const public = isPublic(req);
    const userId = public ? '' : req.user._id;

    // check privilege
    if (public && !isAdmin(req)) {
        return res.status(401).json({
            message : "Permission denied to delete public files."
        });
    }
    try {
        const file = await filesDB.getFile(userId, req.params.id);
        const filePath = file.fullPath;
        const message = await filesDB.deleteFile(userId, req.params.id);
        await utils.removeFile(config.fileRootPath + filePath);
        return res.status(200).send({
            ...message,
            fileId: req.params.id
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}