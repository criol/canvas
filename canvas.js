//
//
// canvasMe
//
//

var canvasMe;

(function (nodeName) {
	
canvasMe = function (nodeName) {
	if (nodeName in canvasMe.nodes) {
		return canvasMe.nodes[nodeName];
	} else {
		return new canvasMe.canva(nodeName);
	}
};

// объекты canvasMe
canvasMe.nodes = {}

canvasMe.canva = function (nodeName) {
	this.figures = {}; // все фигуры на данной канве
	this.name = nodeName.substr(1, nodeName.lenght);
	this.node = document.querySelector(nodeName);
	this.ctx = this.node.getContext('2d');
	
	canvasMe.nodes[nodeName] = this;
	
	return this;
} 

canvasMe.canva.prototype = {
	draw: function (opt) {
			//this.del(opt.id);   ////////// not ready
			this.figures[opt.id] = opt;
			canvasMe.tools[opt.figure].call(this, opt);
		
	},
	get: function (id) {
		var f = function(){},
			F;
		
		f.prototype = this.figures[id].methods;
		F = new f();
		
		return F;
	}
}



canvasMe.tools = {
	circle : function (opt) {
		var x = opt.x,
			y = opt.y,
			r = opt.r;
		
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, Math.PI*2, true);
		this.ctx.strokeStyle = opt.stroke || "#000000";
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.figures[opt.id].methods = {
			color : function (col)	{
				console.log(this);
			}
		}
	}
}

}())

var a = canvasMe('#example');
a.draw({
	figure : 'circle',
	x : 10,
	y : 10,
	r : 5,
	id : 'red'
});
a.get('red').color();
