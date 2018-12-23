import React from 'react';
import classNames from 'classnames';


class Word extends React.Component{
	render(){
		const classes = classNames({
			word : true,
			'word--current' : this.props.current,
			'word--incorrect' : this.props.status === 'incorrect',
			'word--correct' : this.props.status === 'correct',
		});

		return (
			<span className={classes}>
				{this.props.value}
			</span>
		);
	}
}

export default Word;