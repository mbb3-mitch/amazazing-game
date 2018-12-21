let express = require('express');
let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let port = 8989;
const Game = require('./server/Game');

app.use('/assets', express.static(__dirname + '/dist'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/typing', (req, res) => {
	res.sendFile(__dirname + '/typing.html');
});

server.listen(port, () => {
  console.log('Running server on 127.0.0.1:' + port);
});

const game = new Game({io});
game.init();