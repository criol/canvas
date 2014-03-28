;(function(cm){
	window.canvas = cm('.game');

	canvas.setSize(sizes.width, sizes.height);

	var Game = globalNS.Game = new classes.Game();
	var World = globalNS.GameWorld = new classes.GameWorld();
	var Leo = globalNS.Leo = new classes.Leo();

	Game.start();
})(canvasMe)