'use strict';
/**
 ** Файл: ./models/mod_gameActivities.js
 ** Тип: Модель
 ** Описание: Сценарий отвечает за активность игроков (перемещение, столкновения, использование способностей)
 ** Объект: mvc['models']['gameActivities']
 **/

var mvc = require('../config/require.js');

// temp
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var control = {
	/** Начало игры
	 **
	 **
	 ** Отдает всех первоначальные координаты всех пользователей
	 **/
	startGame : function (idRoom) {
		console.log('start game in room id: ' + idRoom);

		var gameRooms = mvc['models']['gameRooms'].control.getRooms();

		// комнаты не существует
		if (!gameRooms.hasOwnProperty(idRoom)) {
			console.log('fail, not find room');
			return;
		}
		var room = gameRooms[idRoom];
		var result = {};

		var map = mvc['models']['gameMaps'].control.startGame(room.mapId);

		// всем игрокам задаем первоначальные координаты
		for (var key in room.players) {
			var session = mvc['models']['session'].control.getData(room.players[key]);

			if (!session || session.socketId.length < 1) { // нету сессии или id сокета
				console.log('no socket id', session);
				return;
			}
			// стороная игрока
			var playSide = (session.personage.type) ? 'light' : 'dark';
			var data = mvc['models']['gameDataUsers'].control.getData(session.socketId);

			// большинство данных берется из сервера
			data['position'] = {};
			data['position']['x'] = getRandomInt(map.respawn[playSide][0], map.respawn[playSide][2]),
			data['position']['y'] = getRandomInt(map.respawn[playSide][1], map.respawn[playSide][3]),
			data['position']['angle'] = 0;
			data['position']['move'] = false;
			data['position']['speed'] = 50;
			data['position']['datetime'] =  + (new Date());

			data['character'] = {};
			data['character']['health'] = [100, 100]; // [в данный момент/максимальное]
			data['character']['mana'] = [100, 100]; // [в данный момент/максимальное]

			result[session.userId] = {
				x : data['position']['x'],
				y : data['position']['y'],
				speed : data['position']['y'],
				health : data['character']['health'],
				mana : data['character']['mana']
			}

		}

		if (this.callback)
			this.callback(result);
	},
	/** Конец игры
	 **
	 **
	 **/
	endGame : function () {},
	/** Передвижение персонажа
	 **
	 ** dataResponse: получает угол "angle" (360), и движение "move" (boolean)
	 ** session: получает ссылку на mvc['models']['session'] персонажа
	 **
	 **
	 **/
	moviePlayer : function (dataResponse, session) {

		var Math = mvc['modules']['math'];
		var data = mvc['models']['gameDataUsers'].control.getData(session.socketId);

		/* options:
		 * datetime - время последнего события
		 * time - разница времени между прошлым и нынешним событиями
		 * x - новая координата x (старая координата + проекция)
		 * y - новая координата y (старая координата + проекция)
		// * projection - проекция по x и y, объект {x:0, y:0}
		 * distance - пройденное расстояние
		 ****/
		var options = {};
		options['datetime'] =  + (new Date()); // настоящее время
		options['x'] = data.position.x;
		options['y'] = data.position.y;

		// объект двигался
		if (data.position.move) {
			options['time'] = options['datetime'] - data.position.datetime; // разница во времени
			options['distance'] = ~~(options['time'] * data.position.speed / 100) / 10; // пройденное расстояние
			// (начало вектора/дистанция)
			var res = mvc['models']['gameMaps'].control.moviePlayer(data.position, options['distance']);
			data.position.x = ~~res.coordinates.x;
			data.position.y = ~~res.coordinates.y;
			data.position.datetime = options['datetime'];
			data.position.angle = dataResponse.angle;
			data.position.move = dataResponse.move;
		}
		// объект не двигался
		else {
			data.position.datetime = options['datetime'];
			data.position.angle = dataResponse.angle;
			data.position.move = dataResponse.move;
		}
		if (this.callback)
			this.callback.call({
				x : data.position.x,
				y : data.position.y,
				speed : data.position.speed
			});
	}
}

var mathematics = {
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
exports.mathematics = mathematics;