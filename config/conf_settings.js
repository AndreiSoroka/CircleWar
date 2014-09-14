'use strict';
var mode = 'development';
var conf = {
  'development': {
    version: 0.1,
    server: {
      port:3000
    },
    socket: {
      port:3001
    },
    db: {
      ip:'127.0.0.1',
      login:'root',
      password: '',
      database: 'logicgame'    
    }
  },
  
  'v6': {
    version: 0.1,
    server: {
      port:3000
    },
    socket: {
      port:3001
    },
    db: {
      ip:'192.168.245.231',
      login:'root',
      password: '',
      database: 'logicgame'    
    }
  }
}
exports.conf = conf[mode];
exports.mode = mode;
