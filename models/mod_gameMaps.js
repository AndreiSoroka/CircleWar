'use strict';
/**
 ** Файл: ./models/mod_gameMaps.js
 ** Тип: Модель
 ** Описание: Сценарий обрабатывает игровые карты и коллизии на них
 ** Объект: mvc['models']['gameMaps']
 **/

var mvc = require('../config/require.js');
var maps = require('../views/view_maps.js').view_maps;

/**
 **
 ** playerType: 0 - темные, 1 - светлые
 **/
var control = {
	//
	startGame : function (mapId) {
		// если карты не существует
		if (!mapId || !maps.hasOwnProperty(mapId)) {
			console.log('>>> models >>> mod_map >>> start game >>> not found map id: ' + mapId);
			return;
		}

		var result = {
			respawn : {
				dark : maps[mapId].respawn.dark,
				light : maps[mapId].respawn.light
			}
		};

		return result;

	},
	/** moviePlayer - перемещение объекта по карте
	 ** A: {x:0, y:0, angle:0, move:false, speed:50, datetime} - координаты начала вектора, угол, движение, скорость, время
	 **** ссылка на сущесвующий объект
	 ** distance - пройденная дистанция
	 **
	 **/
	moviePlayer : function (A, distance) {

		var radius = 5; // радиус персонажа

		// конечные координаты вектора
		var B = mathematics.projectionVector(distance, A.angle);
		B.x += A.x;
		B.y += A.y;

		// информация ближайшей стены
		var resultMin = {
			distance : null,
			coordinates : null,
			line : null
		}
		// стены
		var walls = maps['test'].objects.walls;

		/*
		 * широкая фаза, список возможных соприкасаемых объектов
		 */
		var arrayWallCollision = ['left-1', 'left-2', 'left-3', 'left-4'];

		/*
		 * узкая фаза, коллизии
		 */

		// проходим по всем отфильтрованным объектам
		for (var obj in arrayWallCollision) {
			// прошлая точка - это первая точка линии
			var lastPoint = null;
			// проходим все точки у объектов (перебираем линии)
			for (var point in walls[arrayWallCollision[obj]].coordinates) {
				if (lastPoint == null) {
					lastPoint = point;
					continue;
				}
				// координаты линии
				var lA = walls[arrayWallCollision[obj]].coordinates[lastPoint];
				var lB = walls[arrayWallCollision[obj]].coordinates[point];
				// координаты соприкосновения
				var cllsn = mathematics.collision(A, B, lA, lB);

				if (cllsn) {
					var tempDistance = mathematics.distancePoints(A, cllsn);
					// сохраняем ближайшие координаты
					if (resultMin.distance == null || resultMin.distance > tempDistance) {
						resultMin.distance = tempDistance; // дистанция
						resultMin.coordinates = cllsn; // линия пересечения
						resultMin.line = { // координаты линии
							A : lA,
							B : lB
						}
					}
				}
				lastPoint = point;
			}

		}

		// у объекта возможны коллизии
		if (resultMin.line) {
			// угол между вектором и линией
			var cosA = mathematics.angleVector(A, resultMin.coordinates, resultMin.line.A, resultMin.line.B);
			resultMin.distance -= mathematics.newDistance(cosA, radius);
			if (resultMin.distance < distance) { // коллизия произошла
				var projection = mathematics.projectionVector(resultMin.distance, A.angle);
				resultMin.coordinates.x = A.x + projection.x;
				resultMin.coordinates.y = A.y + projection.y;
			} else { // коллизия не произошла
      	resultMin = {
          distance : distance,
          coordinates : {
            x : B.x,
            y : B.y
          }
        }
      }
		}
		// у объекта не могло быть коллизий
		else {
			resultMin = {
				distance : distance,
				coordinates : {
					x : B.x,
					y : B.y
				}
			}
		}
    
		return resultMin;
	}

}

var mathematics = {
	/**
	 ** расстояние между двумя точками
	 ** Вводим:
	 ** A {x:0,y:0} - начало вектора
	 ** B {x:0,y:0} - окончание вектора
	 **
	 ** Получаем:
	 ** D - длина вектора
	 **/
	distancePoints : function (A, B) {
		var Math = mvc['modules']['math'];
		return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));
	},
	/**
	 **
	 **/
	collision : function (a1, a2, b1, b2) {
		var d = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y); // скаляр
		if (d != 0) {
			var u0 = mathematics.halfplane(a1, b1, b2) / d;
			var u1 = mathematics.halfplane(a2, a1, b1) / d;
			if (u0 >= 0 && (u1 * u1 <= u1)) {
				return {
					x : a1.x + u0 * (a2.x - a1.x),
					y : a1.y + u0 * (a2.y - a1.y)
				}
			}
		}
		return false;
	},

	halfplane : function (p, a1, a2) {
		return (p.x - a1.x) * (p.y - a2.y) - (p.y - a1.y) * (p.x - a2.x);
	},
	/** angleVector
	 **
	 ** Возвращает косинус угла между векторами
	 ** http://ru.onlinemschool.com/math/library/vector/angl/
	 **/
	angleVector : function (A, B, LineA, LineB) {
		var Math = mvc['modules']['math'];
		// нулевые вектора
		var a = {
			x : B.x - A.x,
			y : B.y - A.y
		};
		var b = {
			x : LineB.x - LineA.x,
			y : LineB.y - LineA.y
		};
		// скалярное произведение векторов
		var scalar = a.x * b.x + a.y * b.y;
		var cosA = null;

		// if (scalar > 0) {
		cosA = scalar / (Math.sqrt(a.x * a.x + a.y * a.y) * Math.sqrt(b.x * b.x + b.y * b.y))
			// }
			return cosA;
	},
	/** convertSinCos - переводит из синуса угра в косинус угла и на оборот.
	 **
	 **
	 **
	 **/
	convertSinCos : function (a) {
		return Math.sqrt(1 - a * a);
	},

	newDistance : function (angle, radius) {
		return radius / mathematics.convertSinCos(angle);
	},
	/**
	 ** Проекция вектора по x и y
	 ** Вводим:
	 ** D - длина вектора
	 ** angle - угол
	 **
	 ** Получаем:
	 ** объект {x:0,y:0} - окончание вектора
	 **/
	projectionVector : function (D, angle) {
		var Math = mvc['modules']['math'];
		var angleRadian = angle * Math.PI / 180; // угол, радианы
		var B = {};
		B.x = (angle != 90 && angle != 270) ? (~~(Math.cos(angleRadian) * D)) : 0;
		B.y = (angle != 0 && angle != 180) ? -1 * (~~(Math.sin(angleRadian) * D)) : 0;
		return B;
	}

}

exports.control = control;