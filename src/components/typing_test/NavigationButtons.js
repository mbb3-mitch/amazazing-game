import React from 'react';

class NavigationButtons extends React.Component {
	render() {
		return (
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
			</section>
		);
	}
}

export default NavigationButtons;