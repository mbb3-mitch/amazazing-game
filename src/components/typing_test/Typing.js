import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import WordSection from './WordSection';
import TypingTextBox from './TypingTextBox';
import CountDownTimer from './CountDownTimer';


const AVG_WORD_LENGTH = 6;
let wordList = [
	"the", "name", "of", "very", "to", "through", "and", "just", "a",
	"form", "in", "much", "is", "great", "it", "think", "you", "say",
	"that", "help", "he", "low", "was", "line", "for", "before", "on",
	"turn", "are", "cause", "with", "same", "as", "mean", "I", "differ",
	"his", "move", "they", "right", "be", "boy", "at", "old", "one",
	"too", "have", "does", "this", "tell", "from", "sentence", "or",
	"set", "had", "three", "by", "want", "hot", "air", "but", "well",
	"some", "also", "what", "play", "there", "small", "we", "end", "can",
	"put", "out", "home", "other", "read", "were", "hand", "all", "port",
	"your", "large", "when", "spell", "up", "add", "use", "even", "word",
	"land", "how", "here", "said", "must", "an", "big", "each", "high",
	"she", "such", "which", "follow", "do", "act", "their", "why", "time",
	"ask", "if", "men", "will", "change", "way", "went", "about", "light",
	"many", "kind", "then", "off", "them", "need", "would", "house",
	"write", "picture", "like", "try", "so", "us", "these", "again",
	"her", "animal", "long", "point", "make", "mother", "thing", "world",
	"see", "near", "him", "build", "two", "self", "has", "earth", "look",
	"father", "more", "head", "day", "stand", "could", "own", "go",
	"page", "come", "should", "did", "country", "my", "found", "sound",
	"answer", "no", "school", "most", "grow", "number", "study", "who",
	"still", "over", "learn", "know", "plant", "water", "cover", "than",
	"food", "call", "sun", "first", "four", "people", "thought", "may",
	"let", "down", "keep", "side", "eye", "been", "never", "now", "last",
	"find", "door", "any", "between", "new", "city", "work", "tree",
	"part", "cross", "take", "since", "get", "hard", "place", "start",
	"made", "might", "live", "story", "where", "saw", "after", "far",
	"back", "sea", "little", "draw", "only", "left", "round", "late",
	"man", "run", "year", "don't", "came", "while", "show", "press",
	"every", "close", "good", "night", "me", "real", "give", "life",
	"our", "few", "under", "stop", "open", "ten", "seem", "simple",
	"together", "several", "next", "vowel", "white", "toward", "children",
	"war", "begin", "lay", "got", "against", "walk", "pattern", "example",
	"slow", "ease", "center", "paper", "love", "often", "person",
	"always", "money", "music", "serve", "those", "appear", "both",
	"road", "mark", "map", "book", "science", "letter", "rule", "until",
	"govern", "mile", "pull", "river", "cold", "car", "notice", "feet",
	"voice", "care", "fall", "second", "power", "group", "town", "carry",
	"fine", "took", "certain", "rain", "fly", "eat", "unit", "room",
	"lead", "friend", "cry", "began", "dark", "idea", "machine", "fish",
	"note", "mountain", "wait", "north", "plan", "once", "figure", "base",
	"star", "hear", "box", "horse", "noun", "cut", "field", "sure",
	"rest", "watch", "correct", "color", "able", "face", "pound", "wood",
	"done", "main", "beauty", "enough", "drive", "plain", "stood", "girl",
	"contain", "usual", "front", "young", "teach", "ready", "week",
	"above", "final", "ever", "gave", "red", "green", "list", "oh",
	"though", "quick", "feel", "develop", "talk", "sleep", "bird", "warm",
	"soon", "free", "body", "minute", "dog", "strong", "family",
	"special", "direct", "mind", "pose", "behind", "leave", "clear",
	"song", "tail", "measure", "produce", "state", "fact", "product",
	"street", "black", "inch", "short", "lot", "numeral", "nothing",
	"class", "course", "wind", "stay", "question", "wheel", "happen",
	"full", "complete", "force", "ship", "blue", "area", "object", "half",
	"decide", "rock", "surface", "order", "deep", "fire", "moon", "south",
	"island", "problem", "foot", "piece", "yet", "told", "busy", "knew",
	"test", "pass", "record", "farm", "boat", "top", "common", "whole",
	"gold", "king", "possible", "size", "plane", "heard", "age", "best",
	"dry", "hour", "wonder", "better", "laugh", "true", "thousand",
	"during", "ago", "hundred", "ran", "am", "check", "remember", "game",
	"step", "shape", "early", "yes", "hold", "hot", "west", "miss",
	"ground", "brought", "interest", "heat", "reach", "snow", "fast",
	"bed", "five", "bring", "sing", "sit", "listen", "perhaps", "six",
	"fill", "table", "east", "travel", "weight", "less", "language",
	"morning", "among"];

class Typing extends React.Component {

	constructor(props) {
		super(props);
		let initialWords = wordList.map((word, index) => {
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
					<h3>ES6 Typing Test</h3>
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
			</div>
		)
	}
}

export default Typing;