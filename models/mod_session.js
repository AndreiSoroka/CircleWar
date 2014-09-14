'use strict';
/**
 ** Файл: ./models/mod_session.js
 ** Тип: Модель
 ** Описание: Сценарий отвечает за хранение, поиск, получение и создание сессии
 ** Объект: mvc['models']['session']
 **/
var mvc = require('../config/require.js');

var session = {
	'player1' : {
		userId : 1,
		socketId : '',
		sessionId : 'player1',
		room : null,
		personage : { // это статичные данные // временные хранятся в объекте socketa
			name : 'Василий',
			type : 0, // темный
      personageId : 0,
			parameters : {
				healthPoints : 100, // жизни
				manaPoints : 100, // мана
				manaControl : 30, // контроль маны
				speed : 10, // px/sec
        radius: 10, // радиус игрока
			}
		},
		status : 0
	},

	'player2' : {
		userId : 2,
		socketId : '',
    sessionId : 'player2',
		room : null,
		personage : {

			name : 'Мефодий',
			type : 1, // светлый
			parameters : {
				healthPoints : [100, 100], // жизни
				manaPoints : [100, 100], // мана
				manaControl : 30, // контроль маны
				speed : 10,
			}

		},
		status : 0
	},
	'player3' : {
		userId : 3,
		socketId : '',
    sessionId : 'player3',
		room : null,
		personage : {

			name : 'Кирил',
			type : 1, // светлый
			parameters : {
				healthPoints : [100, 100], // жизни
				manaPoints : [100, 100], // мана
				manaControl : 30, // контроль маны
				speed : 10,

			}
		},
		status : 0
	},
	'player4' : {
		userId : 4,
		socketId : '',
    sessionId : 'player4',
		room : null,
		personage : {

			name : 'Сергей',
			type : 1, // светлый
			parameters : {
				healthPoints : [100, 100], // жизни
				manaPoints : [100, 100], // мана
				manaControl : 30, // контроль маны
				speed : 10,

			}
		},
		status : 0
	},
	'player5' : {
		userId : 5,
		socketId : '',
    sessionId : 'player5',
		room : null,
		personage : {

			name : 'Иван Иванов',
			type : 1, // светлый
			parameters : {
				healthPoints : [100, 100], // жизни
				manaPoints : [100, 100], // мана
				manaControl : 30, // контроль маны
				speed : 10,

			}
		},
		status : 0
	},
	'player6' : {
		userId : 6,
		socketId : '',
    sessionId : 'player6',
		room : null,
		personage : {

			name : 'Викинг',
			type : 0, // темный
			parameters : {
				healthPoints : [100, 100], // жизни
				manaPoints : [100, 100], // мана
				manaControl : 30, // контроль маны
				speed : 10,

			}
		},
		status : 0
	},
	'player7' : {
		userId : 7,
		socketId : '',
    sessionId : 'player7',
		room : null,
		personage : {

			name : 'Заноза',
			type : 0, // темный
			parameters : {
				healthPoints : [100, 100], // жизни
				manaPoints : [100, 100], // мана
				manaControl : 30, // контроль маны
				speed : 10,

			}
		},
		status : 0
	},
	'player8' : {
		userId : 8,
		socketId : '',
    sessionId : 'player8',
		room : null,
		personage : {

			name : 'Анюта',
			type : 0, // темный
			parameters : {
				healthPoints : [100, 100], // жизни
				manaPoints : [100, 100], // мана
				manaControl : 30, // контроль маны
				speed : 10,
			}
		},
		status : 0
	},
	'player9' : {
		userId : 9,
		socketId : '',
    sessionId : 'player9',
		room : null,
		personage : {

			name : 'Таня',
			type : 0, // темный
			parameters : {
				healthPoints : [100, 100], // жизни
				manaPoints : [100, 100], // мана
				manaControl : 30, // контроль маны
				speed : 10,

			}
		},
		status : 0
	},

};

var control = {
	/** getSession(id)
	 **
	 ** Получение сессии по ее идентификатору
	 **/
	getData : function (id) {
		if (!session.hasOwnProperty(id)) {
			return false;
		}
		return session[id];

		if (this.callback)
			this.callback();
	}

}

exports.control = control;