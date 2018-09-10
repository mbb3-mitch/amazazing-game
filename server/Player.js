const utils = require('./utils/utils');
class Player {
	/**
	 *  Player of the game
	 * @param config.x
	 * @param config.y
	 * @param config.display
	 * @param config.color
	 * @param config.pressingUp
	 * @param config.pressingRight
	 * @param config.pressingDown
	 * @param config.pressingLeft
	 * @param config.maxSpeed
	 */
    constructor(config) {
	   Object.assign(this, config)
    }

	updatePosition() {
		if (this.pressingUp) {
			this.y += this.maxSpeed;
		}
		if (this.pressingRight) {
			this.x += this.maxSpeed;
		}
		if (this.pressingDown) {
			this.y -= this.maxSpeed;
		}
		if (this.pressingLeft) {
			this.x -= this.maxSpeed;
		}
	}
}

module.exports = Player;