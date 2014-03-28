;(function(classes){
	classes.Game = function () {

		this.gameStatus = 0;
		this.gameScore = 0;

	}

	classes.Game.prototype = {
		start: function () {
			this.gameStatus = 1;
			this.gameScore = 0;

			globalNS.GameWorld.start();
			//requestAnimFrame(this.private_isGameOver.bind(this))
		},

		stop: function () {
			this.gameStatus = 0;

		},

		isGameStarted: function () {
			return this.gameStatus;
		},

		private_isGameOver: function () {
		},

		gameIsOver: function () {
			this.gameStatus = 0;
			alert('gameOver');
		}
	}
})(classes)