
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const passport = require('passport');
const cors = require("cors");
const helmet = require("helmet");
const v8 = require('v8');

const totalHeapSize = v8.getHeapStatistics().total_available_size;
const totalHeapSizeInGB = (totalHeapSize / 1024 / 1024 / 1024).toFixed(2);
console.log(`Total heap size (bytes) ${totalHeapSize}, (GB ~${totalHeapSizeInGB})`); 

const db_tools = require('./tools/db-tools');
const staticServer = require('./services/file-service');
const config = require('./config.json');

const app = express();
db_tools.DBConnectMongoose()
    .then(() => {
        const routes = require('./routes');

        app.use(passport.initialize());
        require('./passport')(passport);

        // (optional) only made for logging and
        // bodyParser, parses the request body to be a readable json format
        app.use(bodyParser.json({
            verify: (req, res, buf) => {
                // TODO: use dotenv and git igonore for standard and security
                if (req.originalUrl.startsWith(config.stripe.webhookEndpoint)) {
                    req.rawBody = buf.toString();
                }
            }
        }));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(logger("dev"));

        // TODO: hardcoded & blocked for now
        // const whitelist = ["http://localhost:3000"];
        const whitelist = ["*"];
        app.disable("x-powered-by");
        app.options(whitelist, cors());
        app.use(helmet());
        app.use(
          cors({
            credentials: true,
            origin(origin, callback) {
              callback(null, true);
            }
          })
        );

        routes.assignRoutes(app);
        app.listen(config.mainServerPort);
        console.log(`Server listening on port ${config.mainServerPort}`);
    })
    .catch(err => {
        console.log('Error: ' + err);
    });