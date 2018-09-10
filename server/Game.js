const Player = require('./Player');
const Socket = require('./Socket');
const User = require('./User');
const utils = require('./utils/utils');
const _ = require('underscore');

class Game {
    constructor(config) {
	    this.users = {};
	    this.SOCKET_LIST = {};
	    this.PLAYER_LIST = {};
        this.io = config.io;
    }

    init(){
	    this.io.on('connection', (socket) => {
		    let query = socket.request._query;
		    let user = {
			    username : query.username,
			    uid : query.uid,
			    socket_id : socket.id
		    };

		    if(this.users[user.uid] !== undefined){
			    this.createSocket(user);
			    socket.emit('updateUsersList', this.getUsers());
		    }
		    else{
			    this.createUser(user);
			    this.io.emit('updateUsersList', this.getUsers());
		    }

		    this.SOCKET_LIST[socket.id] = socket;
		    let player = this.createPlayer(socket, user);
		    this.initializeSocketListeners(socket, player);


		    this.run();
	    });
    }

    run(){
	    setInterval(()=>{
		    let pack = [];
		    _.each(this.PLAYER_LIST, (player)=>{
			    player.updatePosition();
			    pack.push({
				    x : player.x,
				    y : player.y,
				    display : player.display,
				    color : player.color
			    });
		    });
		    _.each(this.SOCKET_LIST, (socket) => {
			    socket.emit('newPosition', pack);
		    });
	    }, 1000/25);

    }

	initializeSocketListeners(socket, player) {
		socket.on('message', (data) => {
			console.log(data);
			socket.broadcast.emit('message', {
				username : data.username,
				message : data.message,
				uid : data.uid
			});
		});

		socket.on('keyPress', function(data) {
			if (data.inputId === 'up') {
				player.pressingUp = data.state;
			} else if (data.inputId === 'right') {
				player.pressingRight = data.state;
			} else if (data.inputId === 'down') {
				player.pressingDown = data.state;
			} else if (data.inputId === 'left') {
				player.pressingLeft = data.state;
			}
		});

		socket.on('disconnect', () => {
			this.removeSocket(socket.id);
			delete this.SOCKET_LIST[socket.id];
			delete this.PLAYER_LIST[socket.id];
			this.io.emit('updateUsersList', this.getUsers());
		});
	}

	getUsers(){
		return _.map(this.users, (user)=>{
			return user.username;
		});
	}

	createSocket(user){
		let cur_user = this.users[user.uid],
			updated_user = {
				[user.uid] : Object.assign(cur_user, {sockets : [...cur_user.sockets, user.socket_id]})
			};
		this.users = Object.assign(this.users, updated_user);
	}

	createUser(user){
		this.users = Object.assign({
			[user.uid] : {
				username : user.username,
				uid : user.uid,
				sockets : [user.socket_id]
			}
		}, this.users);
	}

	createPlayer(socket, user){
        let playerConfig = {
            id : socket.id,
            display : user.username.substr(0, 3),
            color : utils.getRandomColor(),
            x : 0,
            y : 0,
            maxSpeed: 10,
            pressingUp: false,
            pressingRight: false,
            pressingDown: false,
            pressingLeft: false,
        };
        let player = new Player(playerConfig);
		this.PLAYER_LIST[socket.id] = player;
		return player;
	}

	removeSocket(socket_id){
		let uid = '';
		_.each(this.users, (user, key)=> {
			let sockets = user.sockets;
			if (sockets.indexOf(socket_id) !== -1) {
				uid = key;
			}
		});
		let user = this.users[uid];
		if (user.sockets.length > 1) {
			// Remove socket only
			let index = user.sockets.indexOf(socket_id);
			let updated_user = {
				[uid] : Object.assign(user, {
					sockets : user.sockets.slice(0, index).concat(user.sockets.slice(index + 1))
				})
			};
			this.users = Object.assign(this.users, updated_user);
		} else {
			delete this.users[uid];
		}
	};
}

module.exports = Game;