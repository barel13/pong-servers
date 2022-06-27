const express = require('express');

const args = process.argv.slice(2);
const server1 = express();
const server2 = express();

const basePort = 3000;

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
            startServers(parseInt(arguments[1]));
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

function startServers(timeout) {
    const serverResponse = (req, __) => {
        const port = req.get("host").split(":")[1];
        pingPong(timeout, port);
    };

    server1.get('/', serverResponse);
    server2.get('/', serverResponse);
    server1.listen(basePort);
    server2.listen(basePort + 1);
}

function pingPong(timeout, port) {
console.log("Ping pong")
}

function pauseServers() {

}

function resumeServers() {

}

function stopServers() {

}
