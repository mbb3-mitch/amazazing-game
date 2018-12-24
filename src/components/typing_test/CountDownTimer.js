import React from 'react';

class CountDownTimer extends React.Component {
	constructor(props) {
		super(props);
		this.tick = this.tick.bind(this);
		this.state = {
			secondsRemaining : props.secondsRemaining
		}
	}

	tick() {
		let secondsRemaining = this.state.secondsRemaining - 1;
		this.props.updateTimeRemaining(secondsRemaining);
		this.setState((state) => ({secondsRemaining}), () => {
			if (this.state.secondsRemaining <= 0) {
				clearInterval(this.interval);
				this.props.handleTimeUp();
			}
		});
	}

	componentDidMount() {
		this.setState({secondsRemaining : this.props.secondsRemaining});
		this.interval = setInterval(this.tick, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		let minute = Math.floor(this.state.secondsRemaining / 60);
		let seconds = this.state.secondsRemaining % 60;
		let time = `${minute}:${seconds > 9 ? seconds : '0' + seconds}`;
		return (
			<div className="type-btn timer">{time}</div>
		);
	}
}

export default CountDownTimer;