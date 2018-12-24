import React from 'react';
import socketIOClient from 'socket.io-client';
import EnterChat from "./EnterChat";
import Menu from "./Menu";
import Messages from "./Messages";
import Users from "./Users";
import Game from "../game/Game";
import Typing from "../typing_test/Typing";

class Chat extends React.Component {

    constructor(props){
        super(props);
        this.socket = null;
        this.state = {
            username : localStorage.getItem('username') ? localStorage.getItem('username') : '',
            uid : localStorage.getItem('uid') ? localStorage.getItem('uid') : this.generateUID(),
            chat_ready : false,
            users : [],
            messages : [],
	        message : '',
        }
    }

    componentDidMount(){
        if(this.state.username.length) {
            this.initChat();
        }
    }

    generateUID(){
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 15; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        localStorage.setItem('uid', text);
        return text;
    }

    setUsername(username, e){
        this.setState({
            username : username
        }, () => {
            this.initChat();
        });
    }

    sendMessage(message, e){
        this.setState({
            messages : this.state.messages.concat([{
               username : localStorage.getItem('username'),
               uid : localStorage.getItem('uid'),
               message : message,
           }])
        });
        this.socket.emit('message', {
            username : localStorage.getItem('username'),
            uid : localStorage.getItem('uid'),
            message : message,
        });
        this.scrollToBottom();
    }

    scrollToBottom(){
        let messages = document.getElementsByClassName('messages')[0];
        messages.scrollTop = messages.scrollHeight - messages.clientHeight;
    }

    initChat(){
        localStorage.setItem('username', this.state.username);
        this.setState({
            chat_ready : true,
        });
        this.socket = socketIOClient('ws://localhost:8989', {
            query : 'username='+this.state.username+'&uid='+this.state.uid
        });
	    this.initializeSocketListeners();
    }

	initializeSocketListeners(){
		this.socket.on('updateUsersList', (users) =>{
			this.setState({
				users : users
			});
		});

		this.socket.on('message', (message) =>{
			this.setState({
				messages : this.state.messages.concat([message])
			});
			this.scrollToBottom();
		});
    }

    render() {
        return (
            <div className="chat">
                {this.state.chat_ready ? (
                    <React.Fragment>
	                    {this.props.mode === 'menu' && <Menu selectGameState={this.props.selectGameState}/>}
                        {this.props.mode === 'game' && <Game socket={this.socket}/>}
	                    {this.props.mode === 'typing' && <Typing gameState={this.props.gameState} selectGameState={this.props.selectGameState}/>}
                        <Users users={this.state.users}/>
                        <Messages
                            sendMessage={this.sendMessage.bind(this)}
                            messages={this.state.messages}
                        />
                    </React.Fragment>
                ) : (
                    <EnterChat
                        setUsername={this.setUsername.bind(this)}
                    />
                )}
            </div>
        )
    }
}

export default Chat;