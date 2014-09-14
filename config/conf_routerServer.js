'use strict';
/**
 ** Файл: ./config/routerServer.js
 ** Тип: Конфигурация
 ** Описание: Сценарий перенаправляет все запросы пользователей на контроллер (Server, express)
 **/
var mvc = require('../config/require.js');

/**
 **
 **
 **/
var server = function () {
  // хрень
	mvc['modules']['express'].get('/', mvc['controllers']['routerServer'].server.onIndex); //
	mvc['modules']['express'].get('/test', mvc['controllers']['routerServer'].server.onTest); //
	mvc['modules']['express'].get('/hello', mvc['controllers']['routerServer'].server.onHello); //

	mvc['modules']['express'].get('/views/view_maps.js', mvc['controllers']['routerServer'].server.onMaps); // Список ировых карт
}

exports.server = server;