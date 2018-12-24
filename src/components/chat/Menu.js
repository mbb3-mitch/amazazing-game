import React from 'react';
import axios from "axios/index";

class Menu extends React.Component {
	typingTest(testID){
		this.props.selectGameState('typing',testID);
	}

	render() {
		return (
			<div className="game-window col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div className="typing-test-link" onClick={()=>this.typingTest('500_words')}>500 words</div>
				<div className="typing-test-link" onClick={()=>this.typingTest('20_words')}>20 words</div>
				<div className="typing-test-link" onClick={() => this.typingTest('dvorak_1')}>Lesson 1: Introducing U and H: Home row, Index fingers</div>
				<div className="typing-test-link" onClick={() => this.typingTest('dvorak_2')}>Lesson 2: Introducing E and T: Home row, Second fingers</div>
			</div>
		)
	}
}

export default Menu;