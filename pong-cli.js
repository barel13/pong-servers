const express = require('express');
const axios = require('axios');
const fs = require('fs');

const args = process.argv.slice(2);
const server1 = express();
const server2 = express();

const basePort = 3000;
const configFile = './config.json';

let shouldPing = true;
let options = {
    running: true,
    destroy: false
};
let lastRuntime = true;

if (args.length === 0) {
    console.log("You didn't enter any command, can't run the server. Have a nice day.");
} else {
    parseCommand(args);
}

/**
 * Parse the options from the command line.
 * @param arguments the arguments passed from the command line.
 */
function parseCommand(arguments) {
    const command = arguments[0].toLowerCase();
    switch (command) {
        case 'start':
            if (arguments.length > 1) {
                startServers(parseInt(arguments[1]));
            } else {
                console.log("Please enter the timeout between the messages.");
            }
            break;
        case 'pause':
            pauseServers();
            break;
        case 'resume':
            resumeServers();
            break;
        case 'stop':
            stopServers();
            break;
        default:
            console.log(`Unrecognized command ${command}, please enter a valid command`);
            break;
    }
}

/**
 * Starts the servers after GET request.
 * @param timeout the timeout between each message in milliseconds.
 */
function startServers(timeout) {
    // write initial configurations.
    options = {
        running: true,
        destroy: false
    };
    fs.writeFile(configFile, JSON.stringify(options), (err) => {
        if (err) {
            console.log(`There was an error ${err.message}`);
        }
    });


    const serverResponse = (req, __) => {
        let data = fs.readFileSync(configFile),
            myObj;
        myObj = JSON.parse(data);

        if (myObj.destroy) {
            process.exit(0)
            return;
        }
        if (!myObj.running) return;

        const port = req.get("host").split(":")[1];
        pingPong(timeout, port);
    };

    server1.get('/', serverResponse);
    server2.get('/', serverResponse);
    server1.listen(basePort);
    server2.listen(basePort + 1);
}

/**
 * print ping/pong and notifies the second server after the specified amount of time.
 * @param timeout the timeout between each message in milliseconds.
 * @param port the port of the sending server.
 */
function pingPong(timeout, port) {
    if (new Date().getTime() < lastRuntime + timeout) return;

    console.log(shouldPing ? "Ping" : "Pong");
    lastRuntime = new Date().getTime();
    const pingPort = 2 * basePort + 1 - port; // (sum of the ports) => 2 * basePort + 1.
    // switch between 2 numbers a and b => (a + b) - n where n is either a or b.

    // noinspection JSIgnoredPromiseFromCall
    setTimeout(() => axios.get(`http://localhost:${pingPort}`), timeout);
    shouldPing = !shouldPing;
}

/**
 * Pause messages between the servers.
 */
function pauseServers() {
    options.running = false;
    fs.writeFile(configFile, JSON.stringify(options), (err) => {
        if (err) {
            console.log("couldn't save the data");
            console.log(err.message);
        }
    });
}

/**
 * Resume the messages between the servers.
 */
function resumeServers() {
    options.running = true;
    fs.writeFile(configFile, JSON.stringify(options), (err) => {
        if (err) {
            console.log("couldn't save the data");
            console.log(err.message);
            return;
        }
        axios.get(`http://localhost:${basePort}`);
    });
}

/**
 * Stop the servers.
 */
function stopServers() {
    options.destroy = true;
    fs.writeFile(configFile, JSON.stringify(options), (err) => {
        if (err) {
            console.log("couldn't save the data");
            console.log(err.message);
        }
    });
}
