import React from 'react';
import $ from 'jquery';
import WordSection from './WordSection';
import TypingTextBox from './TypingTextBox';
import CountDownTimer from './CountDownTimer';

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
// Word Colors
let colorCurrentWord =" #dddddd";
let colorCorrectWord = "#93C572";
let colorIncorrectWord = "#e50000";

// Word Count and other data.
let wordData = {
	seconds: 60,
	correct: 0,
	incorrect: 0,
	total: 0,
	typed: 0
};

class Typing extends React.Component {

	constructor(props) {
		super(props);
		this.initialWords = wordList.map((word, index) => {
			return {
				value : word,
				current : index === 0,
				status : ''
			}
		});
		this.state = {
			words : this.initialWords,
			currentWordIndex : 0,
			correctWordCount : 0,
			incorrectWordCount : 0,
			totalWordCount : 0,
			charactersTyped : 0,
			seconds : 10,
			started : false,
			finished : false,
			wpm : 0,
			accuracy : 0
		};
		this.handleSubmitWord = this.handleSubmitWord.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleTimeUp = this.handleTimeUp.bind(this);
	}

	handleSubmitWord(data) {
		this.checkWord(data)
	}

	handleChange() {
		let updateState = {
			charactersTyped : this.state.charactersTyped + 1
		};
		if (!this.state.started) {
			updateState.started = true;
		}
		this.setState(updateState);
	}

	handleTimeUp() {
		this.calculateWPM();
	}

	checkWord(typedWord) {
		let charactersTyped = typedWord.length;
		let words = [].concat(this.state.words);
		let index = this.state.currentWordIndex;
		let currentWord = words[index];
		let status = typedWord === currentWord.value ? 'correct' : 'incorrect';
		let updatedCurrentWord = {
			value : currentWord.value,
			status,
			current : false
		};
		words[index] = updatedCurrentWord;


		let nextWord = words[++index];
		let updatedNextWord = {
			value : nextWord.value,
			status : '',
			current : true
		};
		words[index] = updatedNextWord;
		let wordsIndex = this.clearLine(words, index);
		this.setState((state) => ({
			words : wordsIndex.words,
			currentWordIndex : wordsIndex.index,
			correctWordCount : status === 'correct' ? state.correctWordCount + 1 : state.correctWordCount,
			incorrectWordCount : status === 'incorrect' ? state.incorrectWordCount + 1 : state.incorrectWordCount,
			totalWordCount : state.totalWordCount + 1,
			charactersTyped : state.charactersTyped + charactersTyped
		}));
	}

	clearLine(words, index) {
		// remove past words once you get to the next line
		let current = $(".word--current")[0]; // second line (first word)
		let next = current.nextSibling; // first line (last word)


		// <span>'s on the next line have a greater offsetTop value
		// than those on the top line.
		// Remove words until the first word on the second line
		// is the fistChild of word-section.
		if (current.offsetTop < next.offsetTop) {
			while (words[0].status) {
				words.shift();
				index--;
			}
		}
		return {words, index};
	}


	componentDidMount(){

	}

//////////////////////////////////////////
// Initial implementation notes:
// next word on <space>, if empty, then set value=""
// after <space> if value == word--current, mark as correct-word
// else, mark as incorrect-word
// if value.length != word--current[:value.length], mark as incorrect-word
// else, mark as word--current
//////////////////////////////////////////


	submitWord(word) {
		// update word--current and
		// keep track of correct & incorrect words
		let current = $(".word--current")[0];

		if (this.checkWord(word)) {
			current.classList.remove("word--current");
			current.classList.add("correct-word-c");
			wordData.correct += 1;
		} else {
			current.classList.remove("word--current", "incorrect-word-bg");
			current.classList.add("incorrect-word-c");
			wordData.incorrect += 1;
		}
		// update wordData
		wordData.total = wordData.correct + wordData.incorrect;

		// make the next word the new word--current.
		current.nextSibling.classList.add("word--current");
	}

	calculateWPM() {
		let wpm = Math.ceil(((this.state.correctWordCount) - (this.state.incorrectWordCount) )/ (this.state.seconds / 60));
		let accuracy = Math.ceil((this.state.correctWordCount / this.state.totalWordCount) * 100) || 0;
		if (wpm < 0) {
			wpm = 0;
		}
		this.setState({
			wpm,
			accuracy,
			finished : true
		});
	}

	typingTest(e) {
		// Char:        Key Code:
		// <space>      32
		// <backspace>  8
		// <shift>      16
		// [A-Z]        65-90
		// [' "]        222

		// Get key code of current key pressed.
		e = e || window.event;
		let kcode = e.keyCode;
		let word = $("#typebox")[0];

		// check if empty (starts with space)
		if (word.value.match(/^\s/g)) {
			word.value = "";
		} else {
			// Only score when timer is on.
			if (this.isTimer(wordData.seconds)) {
				this.checkWord(word);    // checks for typing errors while you type
				// <space> submits words
				if (kcode == 32) {
					this.submitWord(word);  // keep track of correct / incorrect words
					this.clearLine();  // get rid of old words
					$("#typebox")[0].value = ""; // clear typebox after each word
				}
				wordData.typed += 1; // count each valid character typed
			}else {
				// Display typing test results.
				this.calculateWPM(wordData);
			}
		}
	}

	restartTest() {
		this.setState({
			words : this.initialWords,
			currentWordIndex : 0,
			correctWordCount : 0,
			incorrectWordCount : 0,
			totalWordCount : 0,
			charactersTyped : 0,
			seconds : 10,
			started : false,
			finished : false,
			wpm : 0,
			accuracy : 0
		})
	}

	render() {
		return (
			<div className="game-window col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<header>
					<h3>ES6 Typing Test</h3>
				</header>
				<WordSection id="word-section" words={this.state.words}/>
				<section className="type-section">
					<TypingTextBox handleSubmitWord={this.handleSubmitWord} handleChange={this.handleChange} disabled={this.state.finished}/> {this.state.started ?
					<CountDownTimer secondsRemaining={this.state.seconds} handleTimeUp={this.handleTimeUp}/> :
					<div className="type-btn timer">1:00</div>
				}
					<button id="restart" className="type-btn" tabIndex="2" onClick={ () =>this.restartTest()}>
						<span id="restart-symbol">↻</span>
					</button>
				</section>
				{this.state.finished &&
				<ul id="results">
					<li>WPM: <span className="wpm-value">{this.state.wpm}</span></li>
					<li>Accuracy: <span className="wpm-value">{this.state.accuracy}%</span></li>
					<li id="results-stats">
						Total Words: <span>{this.state.totalWordCount}</span> | Correct Words: <span>{this.state.correctWordCount}</span> | Incorrect Words: <span>{this.state.incorrectWordCount}</span> | Characters Typed: <span>{this.state.charactersTyped}</span>
					</li>
				</ul>
				}
			</div>
		)
	}
}

export default Typing;