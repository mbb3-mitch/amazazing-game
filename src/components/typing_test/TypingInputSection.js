import React from 'react';
import TypingTextBox from './TypingTextBox';
import CountDownTimer from './CountDownTimer';
import StopWatch from "./Stopwatch";

class TypingInputSection extends React.Component {
	render() {
		return (
			<section className="type-section">
				<TypingTextBox handleSubmitWord={this.props.handleSubmitWord} handleChange={this.props.handleChange} disabled={this.props.finished} inputField={this.props.inputField}/> {this.props.testDuration ?
				<CountDownTimer started={this.props.started} paused={this.props.paused} finished={this.props.finished} timeElapsed={this.props.timeElapsed} updateTimeElapsed={this.props.updateTimeElapsed} testDuration={this.props.testDuration} handleTimeUp={this.props.handleTimeUp}/> :
				<StopWatch started={this.props.started} paused={this.props.paused} finished={this.props.finished} timeElapsed={this.props.timeElapsed} updateTimeElapsed={this.props.updateTimeElapsed}/>
			}
				<button id="restart" className="type-btn" tabIndex="2" onClick={() => this.props.restartTest()}>
					<span id="restart-symbol">↻</span>
				</button>
			</section>
		);
	}
}

export default TypingInputSection;