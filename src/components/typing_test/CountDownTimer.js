import React from 'react';

class CountDownTimer extends React.Component {
	constructor(props) {
		super(props);
		this.tick = this.tick.bind(this);
		this.state = {
			timeElapsed : 0
		}
	}

	tick() {
		if (this.props.finished){
			clearInterval(this.interval);
			return;
		}
		if (this.props.started){
			let timeElapsed = this.state.timeElapsed  + 1;
			this.props.updateTimeElapsed(timeElapsed);
			this.setState({timeElapsed}, () => {
				if (this.state.timeElapsed >= this.props.testDuration) {
					clearInterval(this.interval);
					this.props.handleTimeUp();
				}
			});
		}
	}

	componentDidMount() {
		this.interval = setInterval(this.tick, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	secondsRemaining(){
		return this.props.testDuration - this.state.timeElapsed;
	}

	render() {
		let minute = Math.floor(this.secondsRemaining() / 60);
		let seconds = this.secondsRemaining() % 60;
		let time = `${minute}:${seconds > 9 ? seconds : '0' + seconds}`;
		return (
			<div className="type-btn timer">{time}</div>
		);
	}
}

export default CountDownTimer;