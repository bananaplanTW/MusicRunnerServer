var ModelBase = require("./ModelBase"),
    urls = require("../data/opendataUrls"),
    util = require('util'),
    db   = require('./connectDB'),
    errorLog = require('../lib/logger').errorLog,
    echoNestKey = process.env.ECHONESTKEY;
var selectSongQuery = "SELECT * FROM music WHERE artist='%s' AND title='%s'";
var insertSongQuery = "INSERT INTO music (artist, title, tempo, genre, duration, energy, liveness, speechiness, acousticness, instrumentalness, loudness, valence, danceability) VALUES ('%s', '%s', %s, '%s', %s, %s, %s, %s, %s, %s, %s, %s, %s)";

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
		callback(null, row)
	});
};

var insertSongIntoDB = function (data, callback) {
	var queryString = util.format(insertSongQuery, data.artist, data.title, data.tempo, data.genre, data.duration, data.energy, data.liveness, data.speechiness, data.acousticness, data.instrumentalness, data.loudness, data.valence, data.danceability);
	db.execute(queryString, function(error, rows) {
		if(error) {
			callback(error, null);
			return;
		}
		callback(null, rows);
		return;
	});
};

var getTrackInfoFromEchoNest = function (artist, title, genre, callback) {
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
		var songData = JSON.parse(data);

		// insert song into db right after getting data back
		if (typeof(songData.response.songs[0]) !== 'undefined') {
			var songMetaData = songData.response.songs[0].audio_summary;
			songMetaData.artist = artist;
			songMetaData.title = title;
			songMetaData.genre = genre;
			insertSongIntoDB(songMetaData, function (error, rows) {
				if (error) {
					errorLog.error("[models/ModelTrackInfoEchoNest.js]: errors when inserting into music db");
					errorLog.error(error);
					return;
				}
				errorLog.info(rows);
			});
			callback(null, songMetaData);
		} else {
			callback(null, null);
		}
		return;
	});
};

ModelTrackInfoEchoNest.prototype.getTrackInfo = function(artist, title, genre, callback) {
	var self = this;
	getSongFromDB(artist, title, function (error, rows) {
		if (error){
			errorLog.error("[models/ModelTrackInfoEchoNest.js]: errors when getting song info from db");
            errorLog.error(error);

			// getting song info from echonest
			getTrackInfoFromEchoNest.call(self, artist, title, genre, function (error, data) {
				if (error) {
					callback(error, null);
					return;
				}
				callback(null, data);
			})
		} else {
			if (typeof(rows) === 'undefined') {
				// getting song info from echonest
				getTrackInfoFromEchoNest.call(self, artist, title, genre, function (error, data) {
					if (error) {
						callback(error, null);
						return;
					}
					callback(null, data);
				})
			} else {
				console.log("get song in db", rows);
				callback(null, rows);
			}
		}
	});
};

module.exports = ModelTrackInfoEchoNest;
