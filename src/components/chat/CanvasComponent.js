import React from 'react';
import socketIOClient from 'socket.io-client';

class CanvasComponent extends React.Component {
	constructor(props) {
		super(props);
		this.socket = props.socket;
	}

	componentDidMount() {
		this.initializeCanvas();
		this.initializeSocketListeners();
	}

	initializeCanvas() {
		this.ctx = this.refs.canvas.getContext('2d');
		this.ctx.font = '30px Arial';
	}

	initializeSocketListeners(){
		this.socket.on('newPosition', (data) =>{
			this.ctx.clearRect(0, 0, 500, 500);
			data.forEach((datum)=>{
				this.ctx.fillStyle = datum.color;
				this.ctx.fillText(datum.display, datum.x, datum.y);
			});
		});
	}

	render() {
		return (
			<canvas id='ctx' ref="canvas" width={500} height={500}/>
		);
	}
}

export default CanvasComponent;