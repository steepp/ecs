const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const game = require('./game')();
const hostname = '127.0.0.1';
const port = 3000;


//https://victorzhou.com/blog/build-an-io-game-part-1/
// https://expressjs.com/en/api.html#app.use
//http://expressjs.com/en/guide/using-middleware.html
// https://expressjs.com/en/starter/basic-routing.html
app.use(express.static('src/client/'));
//app.get('/', (req, res) => res.sendFile('src/client/index.js'));
/*
app.get('/', (req, res) => {
	res.send('<h1>Hello there.</h1>');
	console.log(req);
});
*/

io.on('connect', (socket) => {
	console.log(`Connected: ${socket.id}`);

	socket.on('start', (data, callback) => {
		game.addPlayer(socket, data);
		callback(game.prepareInitUpdate(socket));
	});

	socket.on('input', (data) => {
		game.addToInputSequence(socket, data);
	});

	socket.on('disconnect', () => {
		console.log('Disconnected: ' + socket.id);
		game.removePlayer(socket);
	});
});

httpServer.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
