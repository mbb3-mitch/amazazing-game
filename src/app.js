import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'font-awesome/css/font-awesome.css';
import './app.scss';
import Navbar from './components/Navbar';
import Chat from './components/chat/Chat';

class App extends React.Component{
	constructor() {
		super();
		this.state = {
			mode : 'typing'
		};
		this.toggleMode = this.toggleMode.bind(this);
	}

	toggleMode(mode) {
		this.setState({mode});
	}

    render(){
        return(
	        <React.Fragment> <Navbar mode={this.state.mode} toggleMode={this.toggleMode}/>
                <Chat mode={this.state.mode}/>
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);