const express = require('express');
const server1 = express();
const server2 = express();

const basePort = 3000;

server1.listen(basePort);
server2.listen(basePort + 1);
