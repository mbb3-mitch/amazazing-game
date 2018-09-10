const Player = require('./Player');
const Socket = require('./Socket');
const User = require('./User');
const utils = require('./utils/utils');

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
		    this.createPlayer(socket, user);

		    socket.on('message', (data) => {
			    console.log(data);
			    socket.broadcast.emit('message', {
				    username : data.username,
				    message : data.message,
				    uid : data.uid
			    });
		    });


		    this.run();

		    socket.on('disconnect', () => {
			    this.removeSocket(socket.id);
			    delete this.SOCKET_LIST[socket.id];
			    delete this.PLAYER_LIST[socket.id];
			    this.io.emit('updateUsersList', this.getUsers());
		    });
	    });
    }

    run(){
	    setInterval(()=>{
		    let pack = [];
		    Object.keys(this.PLAYER_LIST).forEach((key)=>{
			    let player = this.PLAYER_LIST[key];
			    player.x++;
			    player.y++;
			    pack.push({
				    x : player.x++,
				    y : player.y++,
				    display : player.display,
				    color : player.color
			    });
		    });
		    Object.keys(this.SOCKET_LIST).forEach((key)=> {
			    this.SOCKET_LIST[key].emit('newPosition', pack);
		    });
	    }, 1000);

    }

	getUsers(){
		return Object.keys(this.users).map((key) =>{
			return this.users[key].username
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
            x : 250,
            y : 250,
            maxSpeed: 10,
            pressingUp: false,
            pressingRight: false,
            pressingDown: false,
            pressingLeft: false,
        };
		this.PLAYER_LIST[socket.id] = new Player(playerConfig);
	}

	removeSocket(socket_id){
		let uid = '';
		Object.keys(this.users).map((key)=> {
			let sockets = this.users[key].sockets;
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
			// Remove user by key
			let clone_users = Object.assign({}, this.users);
			delete clone_users[uid];
			this.users = clone_users;
		}
	};
}

module.exports = Game;