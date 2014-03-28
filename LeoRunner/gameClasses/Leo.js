;(function(classes, sizes){
	classes.Leo = function () {
		this.private_assignEvents();

		this.width = 20;
		this.height = 25;

		this.speed = 3;

		this.LEO = this.private_drawLeo();

		this.JUMP_VALUE = 80;
		this.BOOST_VALUE = 50;

		this.LEO.currentJumpStatus = 0;

		this.private_run();
	}

	classes.Leo.prototype = {
		BOTTOM_LINE: sizes.height - 100,

		private_assignEvents: function () {
			var lastDownTarget,
				self = this;

		    document.addEventListener('mousedown', function(event) {
		        lastDownTarget = event.target;
		    }, false);

		    document.addEventListener('keydown', function(event) {
//		        if(lastDownTarget == canvas.node) {
		        	if (event.keyCode == 38 || event.keyCode == 32) {
		        		self.private_handleUpKey();
		        	}
//		        }
		    }, false);
		},

		private_drawLeo: function () {
			var LEO;
			canvas.draw({
				id: 'leo',
				figure: 'square',
				x: 50,
				y: this.BOTTOM_LINE - this.height,
				w: this.width,
				h: this.height
			});

			LEO = canvas.get('leo');
			LEO.currentPosition = this.BOTTOM_LINE - this.height;
			LEO.jumpLimit = this.BOTTOM_LINE - this.height;
			LEO.neededPosition = this.BOTTOM_LINE - this.height;
			LEO.normalPosition = this.BOTTOM_LINE - this.height;
			return LEO;
		},

		private_changePosition: function (y) {
			var leo = this.LEO;
			leo.currentPosition = y;
			leo.position(null, y);
		},


		private_run: function () {
			var pos = this.LEO.currentPosition,
				needPos = this.LEO.neededPosition;

			if (pos < needPos) {
				pos = pos + this.speed;
				if (pos > needPos) {
					pos = needPos;
				}
				this.private_changePosition(pos);
			} else if (pos > needPos) {
				pos = pos - this.speed;
				if (pos < needPos) {
					pos = needPos;
				}
				this.private_changePosition(pos);
			} else {
				this.private_changePosition(pos);
				this.private_limitReached(needPos);
			}

			requestAnimFrame(this.private_run.bind(this))
		},

		private_limitReached: function (limit) {
			if (limit === this.LEO.jumpLimit) {
				this.LEO.neededPosition = this.LEO.normalPosition;
			}
			if (limit === this.LEO.normalPosition) {
				this.LEO.currentJumpStatus = 0;
			}
		},

		private_jump: function () {

			this.LEO.jumpLimit = this.BOTTOM_LINE - this.JUMP_VALUE;
			this.LEO.neededPosition = this.LEO.jumpLimit;
			this.LEO.currentJumpStatus = 1;
		},

		private_handleUpKey: function () {
			// if (this.private_isLeoBoosting()) {
			// 	return;
			// } 
			if (this.private_isLeoJumping()) {
				// this.private_boost()
				return
			} else {
				this.private_jump()
			}
		},

		private_isLeoJumping: function () {
			return this.LEO.currentJumpStatus;
		}
	}
})(classes, sizes)