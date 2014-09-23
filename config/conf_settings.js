'use strict';
var mode = 'openshift';
var conf = {
  'development': {
    version: 0.2,
    server: {
      port:3000
    },
    socket: {
      port:3001
    },
    path: ''
  },
  
  'openshift': {
    version: 0.2,
    server: {
      port:80
    },
    socket: {
      port:8080
    },
    path: ''
  }
}
exports.conf = conf[mode];
exports.mode = mode;
