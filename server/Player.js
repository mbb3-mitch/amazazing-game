const utils = require('./utils/utils');
const Constants = require('./constants');
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
		this.id = config.id;
		this.display = config.display;
		this.color = utils.getRandomColor();
		this.x = 250 || config.x;
		this.y = 250 || config.y;
		this.maxSpeed = 10 || config.maxSpeed;
		this.pressingUp = false;
		this.pressingRight = false;
		this.pressingDown = false;
		this.pressingLeft = false;
    }

	updatePosition() {
		if (this.pressingUp) {
			this.y = this.y + this.maxSpeed > Constants.GAME_HEIGHT ? 0 : this.y + this.maxSpeed;
		}
		if (this.pressingRight) {
			this.x = this.x + this.maxSpeed > Constants.GAME_WIDTH ? 0 : this.x + this.maxSpeed;
		}
		if (this.pressingDown) {
			this.y = this.y + this.maxSpeed < 0 ? Constants.GAME_HEIGHT : this.y - this.maxSpeed;
		}
		if (this.pressingLeft) {
			this.x = this.x + this.maxSpeed < 0 ? Constants.GAME_HEIGHT : this.x - this.maxSpeed;
		}
	}
}

module.exports = Player;