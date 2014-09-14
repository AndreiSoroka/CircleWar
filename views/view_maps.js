'use strict';
/**
 ** Файл: ./views/view_maps.js
 ** Тип: Представление
 ** Описание: Сценарий хранит игровые карты
 **/

var view_maps = {
	'test' : {
		width : 700,
		height : 700,
		respawn : {
			dark : [100, 100, 200, 200], // x1,y1,x2,y2
			light : [100, 300, 200, 400]
		},
		objects : {
			// перечесление стен
			walls : {
				'left-1' : {
					imaginary : {
						x : 150, //first
						y : 50,
						width : 100, // last
						height : 100,
					},
					coordinates : [{x : 155, y : 55}, {x : 190, y : 145}, {x : 245, y : 65}, {x : 155, y : 55}]

				},
				'left-2' : {
					imaginary : {
						x : 350, //first
						y : 50,
						width : 100, // last
						height : 100,
					},
					coordinates : [{x : 376, y : 134}, {x : 359, y : 107}, {x : 381, y : 66}, {x : 429, y : 66}, {x : 434, y : 109}, {x : 376, y : 134}]

				},
        'left-3' : {
					imaginary : {
						x : 292, //first
						y : 264,
						width : 180, // last
						height : 220,
					},
					coordinates : [{x: 354, y: 429}, {x: 309, y: 341}, {x: 350, y: 276}, {x: 466, y: 464}, {x: 354, y: 429}]

				},
        'left-4' : {
					imaginary : {
						x : 390, //first
						y : 187,
						width : 100, // last
						height : 150,
					},
					coordinates : [{x: 407, y: 284}, {x: 429, y: 333}, {x: 484, y: 233},  {x: 444, y: 191}, {x: 407, y: 284}]

				}

			} // walls
		} // objects

	}

}
try {
	exports.view_maps = view_maps;
} catch (e) {}