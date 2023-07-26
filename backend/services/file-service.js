
const StaticServer = require('static-server');

const config = require('../config.json');

const server = new StaticServer({
    rootPath: config.fileRootPath, // required, the root of the server file tree
    port: config.fileServerPort, // required, the port to listen
    name: 'my-http-server',   // optional, will set "X-Powered-by" HTTP header
    host: config.fileServerHost, // optional, defaults to any interface
    cors: '*',                // optional, defaults to undefined
});
 
server.start(function () {
    console.log('Server listening to', server.port);
});
