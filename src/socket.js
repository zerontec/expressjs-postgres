const socketIo = require('socket.io');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = socketIo(http);





module.exports = io,app;