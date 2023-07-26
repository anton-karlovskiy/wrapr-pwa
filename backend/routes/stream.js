
const fs = require('fs');
// TODO: not used
const path = require('path');

const fileDB = require('../models/file');
const config = require('../config.json');

exports.streamVideo = function(req, res) {
    const videoId = req.params.id;
    fileDB.getFileById(videoId)
        .then(file => {
            // TODO : every user can access to this link
            // if (file.userId != req.user._id) {
            //     return res.status(401).json({
            //         'success' : 0,
            //         'message' : 'Permission denied to access this file.',
            //     });
            // }

            const path = config.fileRootPath + file.fullPath;
            const stat = fs.statSync(path);
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize-1;

                const chunksize = (end-start) + 1;
                const file = fs.createReadStream(path, {start, end});
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4'
                };

                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(200, head);
                fs.createReadStream(path).pipe(res);
            }
        })
        .catch(err => {
            console.log('mars: stream error', err);
            return res.status(500).json(err);
        });
}