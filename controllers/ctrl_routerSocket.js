'use strict';
/**
 ** Файл: ./controllers/ctrl_routerSocket.js
 ** Тип: Контроллер
 ** Описание: Сценарий задействует нужные функции и отвечает клиенту (Socket.io)
 **/
var mvc = require('../config/require.js');

var socket = {
	/** Авторизация сокета
	 **
	 ** Происходит при соединении клиента к серверу (handshake)
	 ** Отдает ответы
	 **   1 - успешное подключение
	 **   2 - сессия не найдена
	 **   3 - запущена вторая копия
	 **
	 **/
	authorization : function (data) {
    if (!data.hasOwnProperty('cookie'))
      return;
		var session;
		// если сессия существует
		if (session = mvc['models']['session'].control.getData(data.cookie)) {
			// если объект сокета существует
			if (session.socketId.length > 0 && mvc['models']['gameDataUsers'].control.getData(session.socketId)) {
				this.emit('authorization', {
					response : 3
				});
			}
			// объект сокета не существует
			else {
				session.socketId = this.id; // сообщаем сессии новый socket id
				mvc['models']['gameDataUsers'].control.setData(this.id, {
					session : data.cookie
				}); // создаем новый объект сокета
				this.emit('authorization', {
					response : 1,
          userId : session.userId
				});
			}
		}
		// сессия не существует
		else {
			this.emit('authorization', {
				response : 2
			});
		}
	},
	/** Разъединение сокета
	 **
	 ** Происходит при перезагрузке страницы или ее закрытии со стороны клиента
	 **
	 **/
	disconnect : function () {
		/* порядок обязателен */

		socket.rooms.call(this, { // покинуть комнату
			type : 'leave'
		})
		mvc['models']['gameDataUsers'].control.removeData(this.id); // удалить из объектов пользователей
		// models.session.control.getData(data.cookie);
	},
	/** Комнаты
	 **
	 ** data
	 ** ['get list'] - получение всех комнат
	 ** ['join', id] - вступление в комнату с id...
	 ** ['leave'] - покинуть комнату
	 ** ['ready', flag] - готов играть (flag: boolean)
	 **
	 **/
	rooms : function (data) {
		var session;
		// пришла data.type && пользователь существует (неявное занесении информации в session)
		if (data == undefined || !data.hasOwnProperty('type') || !(session = mvc['models']['gameDataUsers'].control.getDataSession(this.id))) {
			return;
		}

		var self = this;

		switch (data.type) {
		case 'get list':
			this.emit('rooms', {
				type : 'get list',
				rooms : mvc['models']['gameRooms'].control.listRooms()
			});
			break;
		case 'join':
			mvc['models']['gameRooms'].control.joinRoom.call({
				callback : function (result) {
					if (!result)
						return;
					self.join(data.idRoom); // добавляем в комнату

					self.emit('rooms', { // список всех игроков отправляем для self
						type : 'list',
						players : result
					});

					self.in(data.idRoom).emit('rooms', { // сообщаем о пользователе комнате
						type : 'join',
						player : result[session.userId],
						userId : session.userId
					});

				}
			}, data.idRoom, session);
			break;
		case 'leave':
			mvc['models']['gameRooms'].control.leaveRoom.call({
				callback : function (idRoom) {
					if (!idRoom)
						return;
					self.leave(idRoom);
          
					self.in(idRoom).emit('rooms', { // сообщаем о выходе из комнаты
						type : 'leave',
						userId : session.userId
					});
				}
			}, session);
			break;
		case 'ready':
			if (!session.room || session.status < 1 || session.status > 2) { // если не состоит в комнате или находится уже в игре
				console.log('>> controllers >> routerSocket >> ready >> user (socket id: ' + this.id + ', session id: ' + session.userId + ') not found room (' + session.room + ') or status say not room (' + session.status + ')');
				break;
			}

			if (!!data.flag) {
				session.status = 2; // готов к игре
			} else {
				session.status = 1; // не готов к игре
			}
			self.in(session.room).emit('rooms', { // отправляем всем игрокам в комнате готовность
				type : 'ready',
				flag : !!data.flag,
				userId : session.userId
			});

			// комната собрана и готова играть
			mvc['models']['gameRooms'].control.startGame.call({
				callback : function (mapId) {
					// расставляем людей по позициям
					mvc['models']['gameActivities'].control.startGame.call({
						callback : function (players) {
							// сообщаем о начале игры
							mvc['modules']['socket'].in(session.room).emit('rooms', {
								type : 'start',
								players : players,
								mapId : mapId
							});
						}
					}, session.room); // активность end
				}
			}, session.room); // комната end

			break;
		} // switch
	}, // rooms
	/** активность игроков
	 **
	 ** data
	 ** ['get list'] - получение всех комнат
	 ** ['join', id] - вступление в комнату с id...
	 ** ['leave'] - покинуть комнату
	 ** ['ready', flag] - готов играть (flag: boolean)
	 **
	 **/
	activities : function (data) {
		var session;
		// пришла data.type && пользователь существует (неявное занесении информации в session)
		if (data == undefined || !data.hasOwnProperty('type') || !(session = mvc['models']['gameDataUsers'].control.getDataSession(this.id))) {
			return;
		}

		var self = this;

		switch (data.type) {
		case 'move':
			if (!data.hasOwnProperty('angle') || !data.hasOwnProperty('move')) {
				break;
			}
			data.angle = parseInt(data.angle);
			data.move = !!data.move;

			//
			mvc['models']['gameActivities'].control.moviePlayer.call({
				callback : function () {

					mvc['modules']['socket'].in(session.room).emit('activities', { // сообщаем о передвижении
						type : 'move',
						userId : session.userId,
						angle : data.angle,
						move : data.move,
						x : this.x,
						y : this.y,
						speed : this.speed
					});

				}
			}, data, session);

			break;
		}
	} // activities
}

exports.socket = socket;