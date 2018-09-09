import React from 'react';
import CanvasComponent from "./CanvasComponent";

class Game extends React.Component {

    constructor(props){
        super(props);
	    this.gameCanvas = React.createRef();
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