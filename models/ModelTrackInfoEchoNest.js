var ModelBase = require("./ModelBase"),
    urls = require("../data/opendataUrls"),
    util = require('util'),
    errorLog = require('../lib/logger').errorLog,
    echoNestKey = "";

var ModelTrackInfoEchoNest = function () {

};
util.inherits(ModelTrackInfoEchoNest, ModelBase);

ModelTrackInfoEchoNest.prototype.getTrackInfo = function(artist, title, callback) {
	var echoNestUrl = util.format(urls.EchoNestTrackApi, echoNestKey, encodeURIComponent(artist), encodeURIComponent(title));
	this.HTTPGet(echoNestUrl, function (error, data) {
		if (error) {
			errorLog.error("[models/ModelTrackInfoEchoNest.js]: errors when calling EchoNest");
            errorLog.error(error);
            callback(error, null);
            return;
		}
		callback(null, JSON.parse(data));
		return;
	});
};

module.exports = ModelTrackInfoEchoNest;