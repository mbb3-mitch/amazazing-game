import React from 'react';
import socketIOClient from 'socket.io-client';

class CanvasComponent extends React.Component {
	constructor(props) {
		super(props);
		this.socket = null;
		this.state = {
			username : localStorage.getItem('username') ? localStorage.getItem('username') : '',
			uid : localStorage.getItem('uid') ? localStorage.getItem('uid') : this.generateUID()
		}
	}

	componentDidMount() {
		this.updateCanvas();
	}

	updateCanvas() {
		const ctx = this.refs.canvas.getContext('2d');
		ctx.font = '30px Arial';
		this.socket = socketIOClient('ws://localhost:8989', {
			query : 'username=' + this.state.username + '&uid=' + this.state.uid
		});

		this.socket.on('newPosition', function(data) {
			console.log(data);
			ctx.clearRect(0, 0, 500, 500);
			data.forEach((datum)=>{
				ctx.fillStyle = datum.color;
				ctx.fillText(datum.display, datum.x, datum.y);
			});

		}.bind(this));
	}

	render() {
		return (
			<canvas id='ctx' ref="canvas" width={500} height={500}/>
		);
	}
}

export default CanvasComponent;