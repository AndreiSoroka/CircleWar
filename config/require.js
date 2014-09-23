'use strict';
var files = {
	// модули
	modules : {
		io : require('socket.io'),
    socket : null, // экземпляр сервера io, app.js
		express : require('express')(),
		math : require('math')
	},
	// настройки
	confing : {
		settings : require('./conf_settings.js'),
		routerServer : require('./conf_routerServer.js'),
		routerSocket : require('./conf_routerSocket.js')
	},
  // контроллер
  controllers: {
    routerServer: require('../controllers/ctrl_routerServer.js'),
    routerSocket: require('../controllers/ctrl_routerSocket.js'),
  },
	// модели
	models : {
		session : require('../models/mod_session.js'), // хранение сессий
		gameDataUsers : require('../models/mod_gameDataUsers.js'), // хранение информации о пользователях по ключу сокета
		gameRooms : require('../models/mod_gameRooms.js'), // игровые комнаты (которые объединяют сокеты)
		gameActivities : require('../models/mod_gameActivities.js'), // игровая активность
		gameMaps : require('../models/mod_gameMaps.js') // игровая карта
	}
};
exports.modules = files.modules;
exports.confing = files.confing;
exports.controllers = files.controllers;
exports.models = files.models;