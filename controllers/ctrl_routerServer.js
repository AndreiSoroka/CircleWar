'use strict';
/**
 **
 **
 **/

var mvc = require('../config/require.js');

var server = {
	onIndex : function (req, res) {
    res.sendfile(mvc['confing']['settings'].path+'/public/index.html');
	},
  
	onTest : function (req, res) {
		res.sendfile(mvc['confing']['settings'].path+'/public/test.html');
	},

	onMaps : function (req, res) {
    res.sendfile(mvc['confing']['settings'].path+'/views/view_maps.js');
	},
  
	onStaticFiles : function (req, res) {
		res.sendfile(mvc['confing']['settings'].path+'/public'+req._parsedUrl.pathname);
	}

}

exports.server = server;