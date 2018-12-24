import React from 'react';

class TypingTextBox extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.state = {
			inputField : props.inputField
		};
	}

	handleChange(event) {
		this.props.handleChange(event);
		this.setState({
			inputField : event.target.value
		});
	}
	handleKeyUp(event) {
		if (event.keyCode === 32 || event.keyCode === 13){
			this.props.handleSubmitWord(this.state.inputField.trim());
		}
	}

	render() {
		return (
			<div>
				<input className="typing-text-box" type="text" id="theInput" value={this.props.inputField} onChange={this.handleChange} onKeyUp={this.handleKeyUp} disabled={this.props.disabled} autoComplete="off"/>
			</div>
		);
	}
}

export default TypingTextBox;