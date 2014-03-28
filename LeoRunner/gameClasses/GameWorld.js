;(function(classes, sizes){
	classes.GameWorld = function () {
		if (canvas) {
			this.private_drawWorld();
		};
		this.obstacleCount = 0;
		this.obstacles = [];
		this.speed = 5;
		this.lastObstacleCreateTimespamp = 0;
		this.nextObstacleCreateInTime = 1000;
		this.obstacleCreateRangeTime = [700, 1700];
	}

	classes.GameWorld.prototype = {
		BOTTOM_LINE: sizes.height - 100,

		private_drawWorld: function () {
			canvas.draw({
				id: 'floor',
				figure: 'line',
				fromX: 0,
				fromY: this.BOTTOM_LINE,
				toX: sizes.width,
				toY: this.BOTTOM_LINE
			})
		},

		private_createObstacle: function () {
			var width = 50,
				height = 20;

			canvas.draw({
				id: 'obstacle' + this.obstacleCount,
				figure: 'square',
				x: sizes.width,
				y: this.BOTTOM_LINE - height,
				w: width,
				h: height
			})

			this.obstacles.push(canvas.get('obstacle' + this.obstacleCount));
			console.log('obstacle' + this.obstacleCount, 'created')
			this.obstacleCount += 1;
		},

		private_removeObstacle: function (id) {
			var obstacle = canvas.get(id),
				index = this.obstacles.indexOf(obstacle);

			this.obstacles.splice(index, 1);
			obstacle.remove();
			console.log(id, 'removed');
		},

		private_moveAllObstacle: function () {
			var obstacles = this.obstacles,
				self = this,
				leo = globalNS.Leo.LEO,
				leoPos = leo.position(),
				leoSize = leo.size(),
				leoObj = {
					x: leoPos.x,
					y: leoPos.y,
					width: leoSize.w,
					height: leoSize.h
				},
				obstaclePos,
				obstacleSize,
				obstacleObj;

			obstacles.forEach(function (obstacle) {
				if (obstacle) {
					posX = obstacle.position().x - self.speed;

					obstaclePos = obstacle.position();
					obstacleSize = obstacle.size();

					obstacleObj = {
						x: obstaclePos.x,
						y: obstaclePos.y,
						width: obstacleSize.w,
						height: obstacleSize.h
					}

					if (self.private_collision(leoObj, obstacleObj)) {
						//globalNS.Game.gameIsOver();
					}

					if (posX < (-1 * obstacle.size().w)) {
						self.private_removeObstacle(obstacle.getId());
					} else {
						obstacle.position(posX);
					}
				}
			});
		},

		private_getRandomArbitary: function  (range) {
    		return Math.random() * (range[1] - range[0]) + range[0];
		},


		private_collision: function (obj1, obj2) {
			  var XColl=false;
			  var YColl=false;

			  if ((obj1.x + obj1.width >= obj2.x) && (obj1.x <= obj2.x + obj2.width)) XColl = true;
			  if ((obj1.y + obj1.height >= obj2.y) && (obj1.y <= obj2.y + obj2.height)) YColl = true;

			  if (XColl&YColl){return true;}
			  return false;
		},

		private_moveDatWorld: function (timestamp) {
			if (globalNS.Game.isGameStarted()) {
				this.private_moveAllObstacle();
				if (timestamp - this.lastObstacleCreateTimespamp  >= this.nextObstacleCreateInTime) {
					this.private_createObstacle();
					this.lastObstacleCreateTimespamp = timestamp;
					this.nextObstacleCreateInTime = this.private_getRandomArbitary(this.obstacleCreateRangeTime)
				}
				requestAnimFrame(this.private_moveDatWorld.bind(this));
			}
		},

		start: function () {
			this.lastObstacleCreateTimespamp = 0;
			this.nextObstacleCreateInTime = 1000;
			this.obstacleCount = 0;
			this.obstacles = [];
			this.private_createObstacle();
			requestAnimFrame(this.private_moveDatWorld.bind(this))
		},

		getListOfObstacles: function () {
			return this.obstacles
		}
	}
})(classes,  sizes)