#!/usr/bin/env node

/* Required imports */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const yargs = require("yargs");
const chalk = require( "chalk" );
const fs = require('fs');
const path = require("path");

/* App configuration and initialization */
const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use(morgan('combined'));

// Auto declarative routing 
const router = express.Router();

function nocache(module) {fs.watchFile(path.resolve(module), () => {delete require.cache[require.resolve(module)]})}

// CLI Startup params
const options = yargs
    .usage("Usage: -e <endpoint>")
    .option("e", { alias: "endpoint", describe: "Base endpoint to mock response from", type: "string", demandOption: true })
    .option("p", { alias: "port", describe: "Port to run the backend mocker on", type: "number" })
    .option("f", { alias: "folder", describe: "Custom folder to get the endpoints from", type: "string" })
    .option("u", { alias: "frontendURL", describe: "Custom base URL to enable CORS to", type: "string" })
    .argv;

nocache(`${ process.cwd() }/${options.folder || '.backend-mocks'}/index.js`);
let mocks = require(`${ process.cwd() }/${options.folder || '.backend-mocks'}`).mocks;

mocks.forEach(mock => {
    router[mock.method.toLowerCase()](mock.url, async (req, res) => {
        res.status(mock.status).json(mock.response);
    });
});

app.use(cors({ origin: `${options.frontendURL || 'http://localhost:3000'}` }));

const init = () => {
    if (server.address() === null){
        server.listen(options.port || 6005)
    }
    
    console.log("\x1b[34m")
    console.log(`                                                      
     _____            _                _    _____            _             
    | __  | ___  ___ | |_  ___  ___  _| |  |     | ___  ___ | |_  ___  ___ 
    | __ -|| .'||  _|| '_|| -_||   || . |  | | | || . ||  _|| '_|| -_||  _|
    |_____||__,||___||_,_||___||_|_||___|  |_|_|_||___||___||_,_||___||_|  
    `);

    console.log("\x1b[37m");
    console.log(`
  Listening on port: ${chalk.green(options.port || 6005)}
  CORS Enabled on: ${chalk.green(options.frontendURL || 'http://localhost:3000')}
  Base endpoint: ${chalk.green(`/${options.endpoint}`)}
  Mocks folder: ${chalk.green(`${options.folder || '.backend-mocks'}`)}
  API Mocks detected: ${chalk.green(mocks.length)} \n`
    );

    console.log("\x1b[36m");

    fs.watchFile(
        `${ process.cwd() }/${options.folder || '.backend-mocks'}/index.js`,
        () => {
            delete mocks;
            mocks = require(`${ process.cwd() }/${options.folder || '.backend-mocks'}`).mocks;

            mocks.forEach(mock => {
                router[mock.method.toLowerCase()](mock.url, async (req, res) => {
                    res.status(mock.status).json(mock.response);
                });
            });

            app.use(`/${options.endpoint}`, router);

            console.log(chalk.green("Reloading..."));

            server.close(init);
        }
    );
}

let server;

try{
    if (options.endpoint) {
        app.use(`/${options.endpoint}`, router);
        server = app.listen(options.port || 6005, init);
    }
} catch (e) {
    console.log(e);
    console.log("\x1b[31m");
    console.log("No mocks folder found! Please ensure that you have the mocks folder at the same level of command execution");
}