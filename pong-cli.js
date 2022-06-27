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

server1.listen(basePort);
server2.listen(basePort + 1);
