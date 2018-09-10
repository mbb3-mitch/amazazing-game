import React from 'react';
import CanvasComponent from "./CanvasComponent";

class Game extends React.Component {

    constructor(props){
        super(props);
	    this.socket = props.socket;
	    this.gameCanvas = React.createRef();
    }

	_handleKeyDown(event)  {
		if (event.keyCode === 87) // w
			this.socket.emit('keyPress',{inputId:'up',state:true});
		else if(event.keyCode === 68)    //d
			this.socket.emit('keyPress',{inputId:'right',state:true});
		else if(event.keyCode === 83)   //s
			this.socket.emit('keyPress',{inputId:'down',state:true});
		else if(event.keyCode === 65) //a
			this.socket.emit('keyPress',{inputId:'left',state:true});
	}

	_handleKeyUp(event)  {
		if (event.keyCode === 87) // w
			this.socket.emit('keyPress',{inputId:'up',state:false});
		else if(event.keyCode === 68)    //d
			this.socket.emit('keyPress',{inputId:'right',state:false});
		else if(event.keyCode === 83)   //s
			this.socket.emit('keyPress',{inputId:'down',state:false});
		else if(event.keyCode === 65) //a
			this.socket.emit('keyPress',{inputId:'left',state:false});
	}

	componentWillMount() {
		document.addEventListener("keydown", this._handleKeyDown.bind(this));
		document.addEventListener("keyup", this._handleKeyUp.bind(this));
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this._handleKeyDown.bind(this));
		document.removeEventListener("keyup", this._handleKeyUp.bind(this));
	}

	render() {
        return (
            <div className="game-window col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <CanvasComponent socket={this.socket}/>
            </div>
        )
    }
}

export default Game;