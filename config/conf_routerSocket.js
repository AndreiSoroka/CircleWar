'use strict';
/** 
 ** Файл: ./config/conf_routerSocket.js
 ** Тип: Конфигурация
 ** Описание: Сценарий перенаправляет все запросы пользователей на контроллер (Socket.io)
 **/
var mvc = require('../config/require.js');

/**
 **
 **
 **/
var socket = function (client) {
	client.on("authorization", mvc['controllers']['routerSocket'].socket.authorization);
	client.on("disconnect", mvc['controllers']['routerSocket'].socket.disconnect);
	client.on("rooms", mvc['controllers']['routerSocket'].socket.rooms);
	client.on("activities", mvc['controllers']['routerSocket'].socket.activities);
}

exports.socket = socket;