const utils = require('./utils/utils');
class Player {
	/**
	 *  Player of the game
	 * @param config.x
	 * @param config.y
	 * @param config.display
	 * @param config.color
	 */
    constructor(config) {
	   Object.assign(this, config)
    }
}

module.exports = Player;