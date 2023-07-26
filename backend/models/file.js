
const mongoose = require('mongoose');
const utils = require('../utils');

// create a Mongoose schema
const FileSchema = new mongoose.Schema({
    _id: { 
        type: String
    },

    userId: { 
        type: String
    },

    orgFileName: { 
        type: String,
        required: true
    },

    fileName: { 
        type: String,
        required: true
    },

    type: { 
        type: String,
        required: true
    },

    mimeType: { 
        type: String,
        required: true
    },

    fullPath: { 
        type: String,
        required: true
    },

    url: { 
        type: String,
        required: true
    },

    intrinsicWidth: { 
        type: Number,
        required: true
    },

    intrinsicHeight: { 
        type: Number,
        required: true
    }
});

// register the schema
const File = mongoose.model('file', FileSchema);
exports.File = File;

// get files by user id
exports.getFiles = function(userId, type) {
    return new Promise(function(resolve, reject) {
        File.find({
            userId: userId,
            type: type
        },
        function(error, files) {
            if (error) {
                console.log("ray : ray : [file model getFiles] ", error);
                reject(error);
            }
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    files[i].url = utils.getFileUrl(files[i]);
                }
            }
            resolve(files);
        })
    })
}

// get the file by id
exports.getFile = function(userId, fileId) {
    return new Promise(function(resolve, reject) {
        File.findOne({
            _id: fileId,
            userId: userId
        },
        function(error, file) {
            if (error) {
                console.log('ray : [file model getFile] error => ', error);
                reject(error);
            }
            if (file) {
                file.url = utils.getFileUrl(file);
            }
            resolve(file);
        });
    })
}

exports.getFileById = function(fileId) {
    return new Promise(function(resolve, reject) {
        File.findById(fileId)
            .then(file => {
                if (file === null) {
                    reject({message : 'file not found'});
                } else {
                    file.url = utils.getFileUrl(file);
                    resolve(file);
                }
            })
            .catch(error => {
                if (error) {
                    console.log("ray : ray : [file model getFileById] ", error);
                    reject(error);
                }
            });
    });
}

// delete the file by id
exports.deleteFile = function(userId, fileId) {
    return new Promise(function(resolve, reject) {
        File.deleteOne({
            _id: fileId,
            userId: userId
        },
        function(error, file) {
            if (error) {
                console.log("ray : ray : [file model deleteFile] ", error);
                reject(error);
            }
            resolve({"success" : 1});
        })
    });
}

// save a file to db
exports.saveFile = function(fileData) {
    return new Promise(function(resolve, reject) {
        const file = new File(fileData);
        file.save((error, file) => {
            if (error) {
                console.log("ray : ray : [file model saveFile] ", error);
                reject(error);
            }
            resolve(file);
        });
    });
}
