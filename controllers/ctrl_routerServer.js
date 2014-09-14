'use strict';
/**
 **
 **
 **/

var fs = require('fs');

var server = {
	onIndex : function (req, res) { // я хз как на экспресе счичтать файл, потом сам перепишешь
		fs.readFile('./public/index.html', function (err, logData) {
			if (err)
				throw err;
			var text = logData.toString();
			res.send(text);
		});
	},
	onTest : function (req, res) {
		res.send('<a href="/hello">Hello Test</a>');
	},

	onHello : function (req, res) {
		res.send('<a href="/test">Hello World</a>');
	},
	onMaps : function (req, res) {
		fs.readFile('./views/view_maps.js', function (err, logData) {
			if (err)
				throw err;
			var text = logData.toString();
			res.send(text);
		});
	}

}

exports.server = server;