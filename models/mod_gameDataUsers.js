'use strict';
/**
 ** Файл: ./models/mod_gameDataUsers.js
 ** Тип: Модель
 ** Описание: Сценарий отвечает за хранение, поиск, получение и создание пользователей а так же их координат в игре
 ** Объект: mvc['models']['gameDataUsers']
 **/
var mvc = require('../config/require.js');

var dataUsers = {};
/* пример:
dataUsers = {
'id-id-id': {
session: 'player1'
}
}
 * Создается в control.setData
 */

var control = {
	/** setData(id)
	 **
	 ** Создание объекта с идентификатором id
	 **/
	setData : function (id, info) {
		if (typeof id != 'String' &&
			typeof info != 'object' &&
			!info.hasOwnProperty('session')) {
			return false;
		}
		dataUsers[id] = {
			session : info.session
		}
		console.log('setData info:', info);
	},
	/** getData(id)
	 **
	 ** Получение объекта по ее идентификатору
	 **/
	getData : function (id) {
		if (!dataUsers.hasOwnProperty(id)) {
			return false;
		}

		if (this.callback)
			this.callback();

		return dataUsers[id];
	},
	/** getData(id)
	 **
	 ** Получение объекта сессии по идентификатору сокета
	 **/
	getDataSession : function (id) {
		if (!dataUsers.hasOwnProperty(id)) {
			return false;
		}

		var session = mvc['models']['session'].control.getData(dataUsers[id].session);

		if (this.callback)
			this.callback();

		return session;
	},
	/** removeData(id)
	 **
	 ** Удаление объекта с идентификатором id
	 **/
	removeData : function (id) {
		if (dataUsers.hasOwnProperty(id)) {
			delete dataUsers[id];
		}
	}

}

exports.control = control;