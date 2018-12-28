import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import WordSection from './WordSection';
import TypingInputSection from "./TypingInputSection";
import Results from "./Results";
import NavigationButtons from "./NavigationButtons";

const AVG_WORD_LENGTH = 5;

class TypingTest extends React.Component {

	constructor(props) {
		super(props);
		this._setInitialState(this._mapWords(props.gameState.words));
		this.handleSubmitWord = this.handleSubmitWord.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleTimeUp = this.handleTimeUp.bind(this);
		this.updateTimeElapsed = this.updateTimeElapsed.bind(this);
		this.restartTest = this.restartTest.bind(this);
	}

	componentWillReceiveProps(props) {
		this._setInitialState(this._mapWords(props.gameState.words))
	}

	_mapWords(words) {
		return _.map(words, (word, index) => {
			return {
				value : word,
				current : index === 0,
				status : ''
			}
		});
	}

	_setInitialState(initialWords) {
		this.initialState = {
			words : initialWords,
			currentWordIndex : 0,
			correctWordCount : 0,
			incorrectWordCount : 0,
			totalWordCount : 0,
			charactersTyped : 0,
			correctCharactersTyped : 0,
			incorrectCharactersTyped : 0,
			testDuration : this.props.gameState.testDuration || 0,
			timeElapsed : 0,
			started : false,
			finished : false,
			paused : false,
			wpm : 0,
			accuracy : 0,
			inputField : ''
		};
		if (!this.state){
			this.state = this.initialState;
			return;
		}
		this.setState(this.initialState);
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

	updateTimeElapsed(timeElapsed) {
		this.setState({
			timeElapsed
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
		let accuracy = (this.state.correctWordCount / this.state.totalWordCount) || 1;
		let avgWordsTyped = this.state.correctCharactersTyped / AVG_WORD_LENGTH;
		let wordsPerSecond = avgWordsTyped / (this.state.timeElapsed || 1);
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

	componentDidUpdate() {
		this.focus();
	}

	componentDidMount() {
		this.focus();
	}

	focus() {
		$('.typing-text-box')[0].focus();
	}

	render() {
		return (
			<div className="game-window col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<header>
					<h3>{this.props.gameState.testName}</h3>
				</header>
				{!this.state.finished &&
				<WordSection id="word-section" words={this.state.words}/>
				} <TypingInputSection handleSubmitWord={this.handleSubmitWord}
				                      handleChange={this.handleChange}
				                      finished={this.state.finished}
				                      inputField={this.state.inputField}
				                      testDuration={this.state.testDuration}
				                      started={this.state.started}
				                      paused={this.state.paused}
				                      updateTimeElapsed={this.updateTimeElapsed}
				                      handleTimeUp={this.handleTimeUp}
				                      timeElapsed={this.state.timeElapsed}
				                      restartTest={this.restartTest}/>
				{this.state.started &&
				<Results wpm={this.state.wpm}
				         accuracy={this.state.accuracy}
				         totalWordCount={this.state.totalWordCount}
				         correctWordCount={this.state.correctWordCount}
				         incorrectWordCount={this.state.incorrectWordCount}
				         charactersTyped={this.state.charactersTyped}
				         incorrectCharactersTyped={this.state.incorrectCharactersTyped}/>
				} <NavigationButtons selectGameState={this.props.selectGameState} gameState={this.props.gameState}/>
			</div>
		)
	}
}

export default TypingTest;