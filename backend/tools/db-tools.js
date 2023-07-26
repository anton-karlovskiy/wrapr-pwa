
const mongoose = require('mongoose');

const config = require('../config.json');

let db;

exports.DBConnectMongoose = function() {
    return new Promise(function(resolve, reject) {
        mongoose.Promise = global.Promise;

        if (db) {
            return resolve(db);
        }

        // database connect
        mongoose.connect(`mongodb://${config.dbConfig.host}:${config.dbConfig.port}/${config.dbConfig.name}`, { useNewUrlParser: true })
            .then(() => {
                db = mongoose.connection
                console.log('mongo connection created');
                resolve(db);
            })
            .catch(err => {
                console.log('error creating db connection: ' + err);
                reject(err);
            });
    });
};