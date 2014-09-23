'use strict';
/**
 ** Файл: ./app.js
 ** Тип: Приложение
 ** Описание: Сценарий запускает сервер
 **/
var mvc = require('./config/require.js');
var log = require('./logs/log.js');
mvc['confing']['settings'].path = __dirname;

function init() {
	// Информация о приложении
	log.say('app.js > Application mode <' + mvc['confing']['settings'].mode + '> version <' + mvc['confing']['settings'].conf.version + '>');
	log.say('app.js > Server listening on port ' + mvc['confing']['settings'].conf.server.port);
	log.say('app.js > Socket.io listening on port ' + mvc['confing']['settings'].conf.socket.port);

	// Сервер Express
	var server = mvc['modules']['express'].listen(mvc['confing']['settings'].conf.server.port, function () {
			mvc['confing']['routerServer'].server();
		});

	// Сервер Socket.io
	var socket = mvc.modules.io.listen(server);
	// var socket = mvc.modules.io.listen(mvc['confing']['settings'].conf.socket.port);
	mvc['modules']['socket'] = socket;
	socket.eio.transports = ['websocket'];
	socket.engine.transports = ['websocket'];

	socket.sockets.on("connection", mvc['confing']['routerSocket'].socket);

}
init();