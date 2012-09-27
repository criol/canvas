//
//
// canvasMe
//
//

var canvasMe;

(function (nodeName) {
	
function bind(func, context) {
  return function() { 
    return func.apply(context, arguments); 
  };
}

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
		this.del(opt.id);   ////////// not ready
		this.figures[opt.id] = opt;
		canvasMe.tools[opt.figure].call(this, opt);
		
	},
	
	del : function (id) {
		var a = 0;
		
		for (a in this.figures) {
			if (a === id){
				delete this.figures[a];
				this.refreshCanv();
			}
		}	
	},
	
	refreshCanv : function () {
		var a;
		this.ctx.clearRect(0, 0, this.node.width, this.node.height);
		for (a in this.figures) {
			this.draw(this.figures[a]);
		}
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
			stroke : function (opt, col) {
				opt.stroke = col;
				this.draw(opt);
			},
			radius : function (opt, radius) {
				opt.r = radius;
				this.draw(opt);
			},
			position : function (opt, x, y) {
				opt.x = x || opt.x;
				opt.y = y || opt.y;
				this.draw(opt);
			}
		}
		
		canvasMe.helpers.bind(this.figures[opt.id].methods, this, opt);
	}
};

canvasMe.helpers = {
	bind : function (obj, cont, opt) {
		var method;
		
		for (method in obj) {
			obj[method] = obj[method].bind(cont, opt)
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
a.get('red').stroke("#f03fae");
a.get('red').radius(10);
a.get('red').position(40, 50);
