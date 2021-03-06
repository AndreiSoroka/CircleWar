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
	mvc['modules']['express'].get('/', mvc['controllers']['routerServer'].server.onIndex);  // главная страница
  mvc['modules']['express'].get(/^\/(css|js|fonts)\//, mvc['controllers']['routerServer'].server.onStaticFiles); //
	mvc['modules']['express'].get('/views/view_maps.js', mvc['controllers']['routerServer'].server.onMaps); // Список ировых карт
}

exports.server = server;