//
//
// canvasMe
//
//

var canvasMe;

(function () {

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

        // все собранные геттеры для фигур
        this.createdGetters = {};

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
        draw: function (opt, drawWithoutDelete) {
            // удаляем фигуру с таким id
            if (!drawWithoutDelete) {
                this.del(opt.id);
            }

            // добавляем новую
            this.figures[opt.id] = opt;

            //отрисовываем ее
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
                    this.refreshCanv(true);
                }
            }
        },

        /**
         * обновить канвас
         *
         * @expose
         */
        refreshCanv : function (drawWithoutDelete) {
            var a;
            // очищаем канвас
            this.ctx.clearRect(0, 0, this.node.width, this.node.height);

            //рисуем все фигуры
            for (a in this.figures) {
                this.draw(this.figures[a], drawWithoutDelete);
            }
        },

        /**
         * вернуть фигуру
         *
         * @expose
         * @param {String} [id] - id фигуры
         */
        get: function (id) {
            if (this.createdGetters[id]) {
                return this.createdGetters[id];
            }
            if (!this.figures[id]) {
                return null;
            }
            var f = function(){},
                F;

            f.prototype = this.figures[id].methods;
            F = new f();

            this.createdGetters[id] = F;
            return F;
        },

        /**
         * задать размеры
         *
         * @expose
         * @param {Int} [width] - ширина канвы
         * @param {Int} [height] - высота канвы
         */
        setSize: function (width, height) {
            this.node.width = width;
            this.node.height = height;
        }
    };

/////////////////////////////////
//// Инструменты для рисования
/////////////////////////////////

    canvasMe.tools = {
        /**
         * нарисовать линию
         *
         * @expose
         * @param {Object} [opt] - объект с параметрами (тип фигуры, позиция и тд)
         */
        line : function (opt) {
            var fromX = opt.fromX,
                fromY = opt.fromY,
                toX = opt.toX,
                toY = opt.toY;

            this.ctx.beginPath();
            this.ctx.moveTo(fromX, fromY);
            this.ctx.lineTo(toX, toY);
            this.ctx.strokeStyle = opt.stroke || "#000000";
            this.ctx.stroke();
            this.ctx.closePath();
            this.figures[opt.id].methods = {
                stroke : function (opt, col) {
                    if (!col) {
                        return opt.stroke;
                    }
                    opt.stroke = col;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                position : function (opt, fromX, fromY, toX, toY) {
                    if (!fromX && !fromY && !toX && !toY) {
                        return {
                            fromX: opt.fromX,
                            fromY: opt.fromY,
                            toX: opt.toX,
                            toY: opt.toY
                        }
                    }

                    opt.fromX = fromX || opt.fromX;
                    opt.fromY = fromY || opt.fromY;
                    opt.toX = toX || opt.toX;
                    opt.toY = toY || opt.toY;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                remove : canvasMe.commonTools.remove,
                getId: canvasMe.commonTools.getId
            };
        },

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
                    if (!col) {
                        return opt.stroke;
                    }
                    opt.stroke = col;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                radius : function (opt, radius) {
                    if (!radius) {
                        return opt.r;
                    }
                    opt.r = radius;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                position : function (opt, x, y) {
                    if (!x && !y) {
                        return {
                            x: opt.x,
                            y: opt.y
                        }
                    }
                    opt.x = x || opt.x;
                    opt.y = y || opt.y;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                remove : canvasMe.commonTools.remove,
                getId: canvasMe.commonTools.getId
            };

            // биндим контексты
            canvasMe.helpers.bind(this.figures[opt.id].methods, this, opt);
        },
        /**
         * нарисовать прямоугольник
         *
         * @expose
         * @param {Object} [opt] - объект с параметрами (тип фигуры, позиция и тд)
         */
        square : function (opt) {
            var x = opt.x,
                y = opt.y,
                w = opt.w,
                h = opt.h;

            this.ctx.beginPath();
            this.ctx.rect(x, y, w, h);
            this.ctx.fillStyle = opt.fill || "#000000";
            this.ctx.fill();
            this.ctx.lineWidth = opt.lineWidth || "#000000";
            this.ctx.strokeStyle = opt.stroke || "#000000";
            this.ctx.stroke();
            this.ctx.beginPath();

            // добавляем методы, присущие только кругу
            this.figures[opt.id].methods = {
                stroke : function (opt, col) {
                    if (!col) {
                        return opt.stroke;
                    }
                    opt.stroke = col;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                fill : function (opt, col) {
                    if (!col) {
                        return opt.fill;
                    }
                    opt.fill = col;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                size : function (opt, w, h) {
                    if (!w && !h) {
                        return {
                            w: opt.w,
                            h: opt.h
                        }
                    }
                    opt.w = w;
                    opt.h = h;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                position : function (opt, x, y) {
                    if (!x && !y && typeof(x) != 'number' && typeof(y) != 'number') {
                        return {
                            x: opt.x,
                            y: opt.y
                        }
                    }

                    if (!x && typeof(x) != 'number') {
                        opt.x = opt.x
                    } else {
                        opt.x = x;
                    }

                    opt.y = y || opt.y;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                remove : canvasMe.commonTools.remove,
                getId: canvasMe.commonTools.getId
            };

            // биндим контексты
            canvasMe.helpers.bind(this.figures[opt.id].methods, this, opt);

        },
        /**
         * нарисовать картинку
         *
         * @expose
         * @param {Object} [opt] - объект с параметрами (тип фигуры, позиция и тд)
         */
        image : function (opt) {
            var x = opt.x,
                y = opt.y,
                w = opt.w,
                h = opt.h,
                img = opt.img;

            this.ctx.drawImage(img, x, y, w, h);

            // добавляем методы, присущие только кругу
            this.figures[opt.id].methods = {
                size : function (opt, w, h) {
                    if (!w && !h) {
                        return {
                            w: opt.w,
                            h: opt.h
                        }
                    }
                    opt.w = w;
                    opt.h = h;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                position : function (opt, x, y) {
                    if (!x && !y) {
                        return {
                            x: opt.x,
                            y: opt.y
                        }
                    }
                    opt.x = x || opt.x;
                    opt.y = y || opt.y;
                    this.draw(opt);
                    return this.get(opt.id);
                },
                remove : canvasMe.commonTools.remove,
                getId: canvasMe.commonTools.getId
            }

        }
    };

    canvasMe.commonTools = {
        remove: function (opt) {
            this.del(opt.id)
        },
        getId: function (opt) {
            return opt.id
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


// var a = canvasMe('#example');
// a.draw({
// 	figure : 'circle',
// 	x : 10,
// 	y : 10,
// 	r : 5,
// 	id : 'red'
// });
// a.draw({
// 	figure : 'circle',
// 	x : 10,
// 	y : 10,
// 	r : 5,
// 	id : 'green'
// })
// a.get('red').stroke("#f03fae").radius(10).position(40, 50);
// a.get('green').radius(15).position(60, 40).stroke('#00ff00');
