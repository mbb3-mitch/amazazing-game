import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'font-awesome/css/font-awesome.css';
import './app.scss';
import Navbar from './components/Navbar';
import Chat from './components/chat/Chat';
import axios from "axios/index";

class App extends React.Component{
	constructor() {
		super();
		this.state = {
			mode : 'menu',
			gameState : null
		};
		this.selectMode = this.selectMode.bind(this);
		this.selectGameState = this.selectGameState.bind(this);

	}

	selectMode(mode) {
		this.setState({mode});
	}

	selectGameState(mode, testID) {
		if (mode === 'typing') {
			axios.get(`/typing-test/${testID}`)
				.then(function(response) {
					this.setState({
						mode,
						gameState : response.data
					});
				}.bind(this))
				.catch(function(error) {
					console.log(error);
				});
		} else	if (mode === 'game'){
			this.setState({
				mode,
				gameState : null
			});
        } else {
			this.setState({
				mode: 'menu',
				gameState : null
			});
        }

	}

	render() {
        return(
	        <React.Fragment> <Navbar mode={this.state.mode} selectGameState={this.selectGameState}/>
		        <Chat mode={this.state.mode} gameState={this.state.gameState} selectGameState={this.selectGameState}/>
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);