import React from 'react';
import axios from 'axios';
import _ from 'underscore';
import Slider from "react-slick";
import Button from '@material-ui/core/Button';


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
			return <div className="scrollmenu__element" key={index}>
				<span className="scrollmenu__text">{typingTest.testID}</span>
				<Button variant="contained" color="primary" onClick={() => this.typingTest(typingTest.path)}>
					Select
				</Button>
			</div>;
		});
		const settings = {
			centerPadding : '60px',
			slidesToShow : 5,
			slidesToScroll : 5,
			responsive : [
				{
					breakpoint : 768,
					settings : {
						arrows : false,
						centerPadding : '40px',
						slidesToShow : 5,
						slidesToScroll : 5,
					}
				},
				{
					breakpoint : 480,
					settings : {
						arrows : false,
						centerPadding : '40px',
						slidesToShow : 3,
						slidesToScroll : 3

					}
				}
			]
		};



		return (

			<div className="game-window col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<Slider {...settings}>
					{testList}
				</Slider>
			</div>
		)
	}
}

export default Menu;