import React from 'react';
import CanvasComponent from "./CanvasComponent";

class Game extends React.Component {

    constructor(props){
        super(props);
	    this.gameCanvas = React.createRef();
    }

	_handleKeyDown(event)  {
		alert();
	}


	componentWillMount() {
		document.addEventListener("keydown", this._handleKeyDown.bind(this));

	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this._handleKeyDown.bind(this));
	}

	render() {
        return (
            <div className="game-window col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <CanvasComponent/>
            </div>
        )
    }
}

export default Game;