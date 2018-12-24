import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import WordSection from './WordSection';
import TypingTextBox from './TypingTextBox';
import CountDownTimer from './CountDownTimer';


const AVG_WORD_LENGTH = 6;
class Typing extends React.Component {

	constructor(props) {
		super(props);
		let initialWords = _.map(props.gameState.words, (word, index) => {
			return {
				value : word,
				current : index === 0,
				status : ''
			}
		});
		this.initialState = {
			words : initialWords,
			currentWordIndex : 0,
			correctWordCount : 0,
			incorrectWordCount : 0,
			totalWordCount : 0,
			charactersTyped : 0,
			correctCharactersTyped : 0,
			incorrectCharactersTyped : 0,
			testDuration : 60,
			timeRemaining : 60,
			started : false,
			finished : false,
			wpm : 0,
			accuracy : 0,
			inputField : ''
		};

		this.state = this.initialState;
		this.handleSubmitWord = this.handleSubmitWord.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleTimeUp = this.handleTimeUp.bind(this);
		this.updateTimeRemaining = this.updateTimeRemaining.bind(this);
	}

	handleSubmitWord(data) {
		this.checkWord(data)
	}

	handleChange(event) {
		let updateState = {
			inputField : event.target.value
		};
		if (!/\s/.test(event.nativeEvent.data) && !_.isNull(event.nativeEvent.data)) {
			updateState.charactersTyped = this.state.charactersTyped + 1;
		}
		if (_.isNull(event.nativeEvent.data)) {
			updateState.incorrectCharactersTyped = this.state.incorrectCharactersTyped + 1;
		}
		if (!this.state.started) {
			updateState.started = true;
		}
		this.setState(updateState);
	}

	handleTimeUp() {
		this.finishTest();
	}

	updateTimeRemaining(timeRemaining) {
		this.setState({
			timeRemaining
		});
	}

	checkWord(typedWord) {
		let words = [].concat(this.state.words);
		let index = this.state.currentWordIndex;
		let currentWord = words[index];
		let status = typedWord === currentWord.value ? 'correct' : 'incorrect';
		let correctCharactersTyped = status === 'correct' ? typedWord.length : 0;
		let incorrectCharactersTyped = status === 'incorrect' ? typedWord.length : 0;
		words[index] = {
			value : currentWord.value,
			status,
			current : false
		};

		let nextWord = words[++index];
		if (!nextWord) {
			this.setState((state) => ({
				correctWordCount : status === 'correct' ? state.correctWordCount + 1 : state.correctWordCount,
				incorrectWordCount : status === 'incorrect' ? state.incorrectWordCount + 1 : state.incorrectWordCount,
				totalWordCount : state.totalWordCount + 1,
				correctCharactersTyped : state.correctCharactersTyped + correctCharactersTyped
			}));
			this.finishTest();
			return;
		}
		words[index] = {
			value : nextWord.value,
			status : '',
			current : true
		};
		let wordsIndex = this.clearLine(words, index);
		this.setState((state) => ({
			words : wordsIndex.words,
			currentWordIndex : wordsIndex.index,
			correctWordCount : status === 'correct' ? state.correctWordCount + 1 : state.correctWordCount,
			incorrectWordCount : status === 'incorrect' ? state.incorrectWordCount + 1 : state.incorrectWordCount,
			totalWordCount : state.totalWordCount + 1,
			correctCharactersTyped : state.correctCharactersTyped + correctCharactersTyped,
			incorrectCharactersTyped : state.incorrectCharactersTyped + incorrectCharactersTyped,
			inputField : ''
		}), ()=>{
			this.calculateWPM();
		});
	}

	clearLine(words, index) {
		let current = $(".word--current")[0];
		let next = current.nextSibling;

		if (current.offsetTop < next.offsetTop) {
			while (words[0].status) {
				words.shift();
				index--;
			}
		}
		return {words, index};
	}

	calculateWPM() {
		let accuracy = (this.state.correctCharactersTyped / this.state.charactersTyped) || 1;
		let avgWordsTyped = this.state.correctCharactersTyped / AVG_WORD_LENGTH;
		let timeElapsed = (this.state.testDuration - this.state.timeRemaining) || 1;
		let wordsPerSecond = avgWordsTyped / timeElapsed;
		let wpm = Math.ceil(wordsPerSecond * 60);
		if (wpm < 0) {
			wpm = 0;
		}
		this.setState({
			wpm,
			accuracy,
		});
	}

	finishTest() {
		this.calculateWPM();
		this.setState({
			inputField : '',
			finished : true
		});
	}

	restartTest() {
		this.setState(this.initialState);
	}

	render() {
		return (
			<div className="game-window col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<header>
					<h3>{this.props.gameState.testName}</h3>
				</header>
				{!this.state.finished &&
				<WordSection id="word-section" words={this.state.words}/>
				}
				<section className="type-section">
					<TypingTextBox handleSubmitWord={this.handleSubmitWord} handleChange={this.handleChange} disabled={this.state.finished} inputField={this.state.inputField}/> {this.state.started && !this.state.finished ?
					<CountDownTimer secondsRemaining={this.state.testDuration} handleTimeUp={this.handleTimeUp} updateTimeRemaining={this.updateTimeRemaining}/> :
					<div className="type-btn timer">1:00</div>
				}
					<button id="restart" className="type-btn" tabIndex="2" onClick={ () =>this.restartTest()}>
						<span id="restart-symbol">↻</span>
					</button>
				</section>
				{this.state.started &&
				<ul id="results">
					<li>WPM: <span className="wpm-value">{this.state.wpm}</span></li>
					<li>Accuracy: <span className="wpm-value">{Math.ceil(this.state.accuracy * 100)}%</span></li>
					<li id="results-stats">
						Total Words: <span>{this.state.totalWordCount}</span> | Correct Words: <span>{this.state.correctWordCount}</span> | Incorrect Words: <span>{this.state.incorrectWordCount}</span> | Characters Typed: <span>{this.state.charactersTyped}<span className='word--incorrect'>({this.state.incorrectCharactersTyped})</span></span>
					</li>
				</ul>
				}
				{(this.props.gameState.previousTest || this.props.gameState.nextTest) &&
				<section className="type-section">
					<button className="nav-btn" onClick={()=>this.props.selectGameState('menu')}>
						<span>Back</span>
					</button>
					{this.props.gameState.previousTest &&
						<button className="nav-btn" onClick={()=>this.props.selectGameState('typing', this.props.gameState.previousTest)}>
							<span>Previous Test</span>
						</button>
					}
					{this.props.gameState.nextTest &&
					<button className="nav-btn" onClick={()=>this.props.selectGameState('typing', this.props.gameState.nextTest)}>
						<span>Next Test</span>
					</button>
					}
				</section>}
			</div>
		)
	}
}

export default Typing;