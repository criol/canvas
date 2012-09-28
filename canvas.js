//
//
// canvasMe
//
//

var canvasMe;

(function (nodeName) {

/**
 * вернуть/создать объект canvasMe
 * 
 * @expose
 * @param {String} [nodeName] - имя узла
 */
canvasMe = function (nodeName) {
	if (nodeName in canvasMe.nodes) {
		return canvasMe.nodes[nodeName];
	} else {
		return new canvasMe.canva(nodeName);
	}
};

// объекты canvasMe
canvasMe.nodes = {}

/**
 * создать объект canvasMe
 * 
 * @constructor
 * @param {String} [nodeName] - имя узла
 */

canvasMe.canva = function (nodeName) {
	// все фигуры на данной канве
	this.figures = {}; 
	// все имя канвы
	this.name = nodeName.substr(1, nodeName.lenght);
	// узел канвы
	this.node = document.querySelector(nodeName);
	// 2d контекст
	this.ctx = this.node.getContext('2d');
	
	// сохраняем полученный объект в массив узлов(канвасов)
	canvasMe.nodes[nodeName] = this;
	
	return this;
};

/////////////////////////////////
//// Методы основных операций над узлом.
/////////////////////////////////

canvasMe.canva.prototype = {
	/**
	 * нарисовать фигуру
	 * 
	 * @expose
	 * @param {Object} [opt] - объект с параметрами (тип фигуры, позиция и тд)
	 * 
	 * @example
	 * canvasMe('#example').draw({
     *     figure : 'circle',
	 *     x : 10,
	 *     y : 10,
	 *     r : 5,
	 *     id : 'red'
	 * });

	 */
	draw: function (opt) {
		this.del(opt.id);   ////////// not ready
		this.figures[opt.id] = opt;
		canvasMe.tools[opt.figure].call(this, opt);
		
	},
	
	/**
	 * удалить фигуру
	 * 
	 * @expose
	 * @param {String} [id] - id фигуры
	 */
	del : function (id) {
		var a = 0;
		
		for (a in this.figures) {
			if (a === id){
				delete this.figures[a];
				this.refreshCanv();
			}
		}	
	},
	
	/**
	 * обновить канвас
	 * 
	 * @expose
	 */
	refreshCanv : function () {
		var a;
		this.ctx.clearRect(0, 0, this.node.width, this.node.height);
		for (a in this.figures) {
			this.draw(this.figures[a]);
		}
	},
	
	/**
	 * вернуть фигуру
	 * 
	 * @expose
	 * @param {String} [id] - id фигуры
	 */
	get: function (id) {
		var f = function(){},
			F;
		
		f.prototype = this.figures[id].methods;
		F = new f();
		
		return F;
	}
}

/////////////////////////////////
//// Инструменты для рисования
/////////////////////////////////

canvasMe.tools = {
	/**
	 * нарисовать круг
	 * 
	 * @expose
	 * @param {Object} [opt] - объект с параметрами (тип фигуры, позиция и тд)
	 */
	circle : function (opt) {
		var x = opt.x,
			y = opt.y,
			r = opt.r;
		
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, Math.PI*2, true);
		this.ctx.strokeStyle = opt.stroke || "#000000";
		this.ctx.stroke();
		this.ctx.closePath();
		
		// добавляем методы, присущие только кругу
		this.figures[opt.id].methods = {
			stroke : function (opt, col) {
				opt.stroke = col;
				this.draw(opt);
				return this.get(opt.id);
			},
			radius : function (opt, radius) {
				opt.r = radius;
				this.draw(opt);
				return this.get(opt.id);
			},
			position : function (opt, x, y) {
				opt.x = x || opt.x;
				opt.y = y || opt.y;
				this.draw(opt);
				return this.get(opt.id);
			}
		}
		
		// биндим контексты
		canvasMe.helpers.bind(this.figures[opt.id].methods, this, opt);
	}
};


/////////////////////////////////
//// Вспомогательные методы
/////////////////////////////////

canvasMe.helpers = {
	/**
	 * привязка методов в объекту
	 * 
	 * @expose
	 * @param {Object} [obj] - объект, чьи методы будут привязоны
	 * @param {Object} [cont] - объект. к кому будут привязаны методы (контект исполнения)
	 * @param {Object} [opt] - объект с параметрами (тип фигуры, позиция и тд)
	 */
	bind : function (obj, cont, opt) {
		var method;
		
		for (method in obj) {
			obj[method] = obj[method].bind(cont, opt)
		}
	}
}

}())


/////////////////////////////////
//// DEMO
/////////////////////////////////


var a = canvasMe('#example');
a.draw({
	figure : 'circle',
	x : 10,
	y : 10,
	r : 5,
	id : 'red'
});
a.draw({
	figure : 'circle',
	x : 10,
	y : 10,
	r : 5,
	id : 'green'
})
a.get('red').stroke("#f03fae").radius(10).position(40, 50);
a.get('green').radius(15).position(60, 40).stroke('#00ff00');
