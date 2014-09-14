'use strict';
/**
 ** Файл: ./models/mod_gameRooms.js
 ** Тип: Модель
 ** Описание: Сценарий отвечает за хранение и обновление игровых комнат
 ** Объект: mvc['models']['gameRooms']
 **/
var mvc = require('../config/require.js');

var gameRooms = {};

var control = {
	/** addRoom(id)
	 **
	 ** Создание комнаты (в объекте var gameRooms)
	 **/
	addRoom : function (id, name, map) {
		gameRooms[id] = {
			status : 0, // статус комнаты 0 - набирает игроков/1 - в режиме игры
			name : name, // название комнаты
			numPlayers : { // количество игроков
				dark : 0,
				light : 0
			},
			players : [], // хранятся id сессии
      mapId: map, // id карты
			typeRoom : 0, // тип комнаты
			maxPlayers : 4 // максимальное кол-во игроков
		}
	},
	/** getRooms()
	 **
	 ** Отдает ссылку на объект с комнатами (var gameRooms)
	 **/
	getRooms : function () {
		return gameRooms;
	},
	/** listRooms()
	 **
	 ** Отдает объекты комнат.
	 ** Контроль информации.
	 **/
	listRooms : function () {
		var rooms = {};
		for (var key in gameRooms) {
			rooms[key] = {
				status : gameRooms[key].status,
				name : gameRooms[key].name,
				numPlayers : {
					dark : gameRooms[key].numPlayers.dark,
					light : gameRooms[key].numPlayers.light
				},
				typeRoom : gameRooms[key].typeRoom,
				maxPlayers : gameRooms[key].maxPlayers
			}
		}

		return rooms;
	},
	/** joinRoom(idRoom, idPlayer)
	 **
	 ** idRoom: индитификатор комнаты
	 ** session: сессия пользователя
	 **
	 ** Вступить в комнату idRoom пользователю с session
	 **/
	joinRoom : function (idRoom, session) {
		// комната не существует
		if (!gameRooms.hasOwnProperty(idRoom)) { // комната не существует
			console.log('>> models >> gameRooms >> joinRoom >> user (id: ' + session.sessionId + '); not found room(id: ' + idRoom + ')');
			return;
		}
		// пользователь существует и он не состоит в какой-либо игровой комнате
		if (!session || session.room) {
			console.log('>> models >> gameRooms >> joinRoom >> user (id: ' + session.sessionId + ') not found OR user already join room(id: ' + idRoom + ')');
			return;
		}
		// комната набрана
		if (gameRooms[idRoom].players >= gameRooms[idRoom].maxPlayers
			 || (session.personage.type == 0 && gameRooms[idRoom].numPlayers.dark >= gameRooms[idRoom].maxPlayers / 2)
			 || (session.personage.type == 1 && gameRooms[idRoom].numPlayers.light >= gameRooms[idRoom].maxPlayers / 2)) {
			return;
		}

		// добавление в комнату
		session.room = idRoom;
		gameRooms[idRoom].players.push(session.sessionId);
		// статус: в комнате
		session.status = 1;
		// равновесие сторон в комнате
		if (session.personage.type == 1) {
			gameRooms[idRoom].numPlayers.light++;
		} else {
			gameRooms[idRoom].numPlayers.dark++;
		}
		// Список игроков в комнате и информация о игроках
		var result = {};
		for (var key in gameRooms[idRoom].players) {
			var idPlayer = gameRooms[idRoom].players[key];
			var sessionUser = mvc['models']['session'].control.getData(idPlayer);
			result[sessionUser.userId] = {
				name : sessionUser.personage.name,
				type : sessionUser.personage.type,
				status : sessionUser.status
			};
		}

		if (this.callback)
			this.callback(result);
	},
	/** leaveRoom(idPlayer)
	 **
	 **/
	leaveRoom : function (session) {
		// если человек не находится в комнате
		if (!session || !session.room) {
			return;
		}

		/* Присваиваю комнату во временную переменную idRoom для того,
		чтобы ее очистить в сессии.*/
		var idRoom = session.room;
		session.room = null;
		// статус свободного игрока
		session.status = 0;

		// если комнаты не существует
		if (!gameRooms.hasOwnProperty(idRoom)) {
			return;
		}

		// равновесие сторон в комнате
		if (session.personage.type == 1) {
			gameRooms[idRoom].numPlayers.light--;
		} else {
			gameRooms[idRoom].numPlayers.dark--;
		}

		// удаление человека из списка комнаты
		gameRooms[idRoom].players.splice(gameRooms[idRoom].players.indexOf(session.sessionId), 1);
		if (this.callback)
			this.callback(idRoom);
	},
	/** removeRoom(idPlayer)
	 **
	 **/
	removeRoom : function () {},
	/** startGame(idRoom)
	 **
	 ** Начало игры, проверям все ли игроки готовы
	 ** Вызывается каждый раз, когда люди подтверждают готовность
	 **/
	startGame : function (idRoom) {
		if (!gameRooms.hasOwnProperty(idRoom)) {
			return; // комнаты больше не существует
		}

		if (gameRooms[idRoom].players.length < 2) {
			return; // мало человек для начала игры
		}

		// ищем всех пользоветелей которые готовы играть
		var usersReady = 0;
		for (var key in gameRooms[idRoom].players) {
			var user = mvc['models']['session'].control.getData(gameRooms[idRoom].players[key]);
			if (user.status == 2) {
				// готов к игре
				usersReady++;
			}
		}

		if (usersReady != gameRooms[idRoom].players.length) {
			return; // не все готовы играть
		}
		gameRooms[idRoom].status = 1;

		if (this.callback)
			this.callback(gameRooms[idRoom].mapId);
	},

}

exports.control = control;

// // //
control.addRoom('testRoom', 'тестовая комната', 'test');