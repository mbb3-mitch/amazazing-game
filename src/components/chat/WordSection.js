import React from 'react';
import Word from './Word';

class WordSetion extends React.Component {
	render() {
		return (
			<section className="word-section">
				{this.props.words.length ? (
					this.props.words.map((word, i) => {
						return (
							<Word key={i} value={word.value} current={word.current} status={word.status} />
						)
					})
				) : <div className="waiting">⌛</div>}

			</section>
		);
	}
}

export default WordSetion;