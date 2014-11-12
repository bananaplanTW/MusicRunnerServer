var ModelBase = require("./ModelBase"),
    urls = require("../data/opendataUrls"),
    util = require('util'),
    db   = require('connectDB'),
    errorLog = require('../lib/logger').errorLog,
    echoNestKey = process.env.ECHONESTKEY;
var selectSongQuery = "SELECT * FROM music WHERE artist=%s AND title=%s";
var insertSongQuery = "INSERT INTO music " + \
					   "(artist, title, tempo, genre, duration, energy, liveness, speechiness, acousticness, instrumentalness, loudness, valence, danceability) VALUES " + \
					   "('%s', '%s', %s, '%s', %s, %s, %s, %s, %s, %s, %s, %s, %s)";

var ModelTrackInfoEchoNest = function () {

};
util.inherits(ModelTrackInfoEchoNest, ModelBase);

var getSongFromDB = function (artist, title, callback) {
	var quertString = util.format(selectSongQuery, artist, title);
	db.execute(quertString, function (error, rows) {
		if (error) {
			callback(error, null);
			return;
		}
		var row = rows[0];
		console.log(rows);
		callback(null, row)
	});
};

var insertSongIntoDB = function (data, callback) {
	var queryString = util.format(insertSongQuery, data.artist, data.title, data.tempo, data.genre, data.duration, data.energy, data.liveness, data.speechiness, data.acousticness, data.instrumentalness, data.loudness, data.valence, data.danceability);
	db.execute(queryString, function(error, rows) {
		if(error) {
			console.log(error);
			callback(error, null);
			return;
		}
		console.log(rows);
		callback(null, rows);
		return;
	});
};

ModelTrackInfoEchoNest.prototype.getTrackInfo = function(artist, title, callback) {
	var echoNestUrl = util.format(urls.EchoNestTrackApi, echoNestKey, encodeURIComponent(artist), encodeURIComponent(title));
	this.HTTPGet(echoNestUrl, function (error, data) {
		if (error) {
			errorLog.error("[models/ModelTrackInfoEchoNest.js]: errors when calling EchoNest");
			errorLog.error("echoNestUrl = " + echoNestUrl);
            errorLog.error(error);
            errorLog.error(data);
            callback(error, null);
            return;
		}
		var songMetaData = JSON.parse(data).response.songs[0].audio_summary;
		songMetaData.artist = artist;
		songMetaData.title = title;
		console.log(songMetaData);

		callback(null, JSON.parse(data));
		return;
	});
};

module.exports = ModelTrackInfoEchoNest;
