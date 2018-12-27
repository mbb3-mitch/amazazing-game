import React from 'react';
import axios from 'axios';
import _ from 'underscore';

class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			typingTests : []
		}
	}


	typingTest(testID){
		this.props.selectGameState('typing',testID);
	}

	componentDidMount() {
		axios.get(`/loadTests`)
			.then(function(response) {
				this.setState({
					typingTests : response.data.typingTests
				});
			}.bind(this))
			.catch(function(error) {
				console.log(error);
			});
	}

	render() {
		let testList = _.map(this.state.typingTests, (typingTest, index) => {
			return <div className="typing-test-link" key={index} onClick={() => this.typingTest(typingTest.path)}>{typingTest.testID}</div>;
		});

		return (
			<div className="game-window col-xs-12 col-sm-12 col-md-12 col-lg-12">
				{testList}
			</div>
		)
	}
}

export default Menu;