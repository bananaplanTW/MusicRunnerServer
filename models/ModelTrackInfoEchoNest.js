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
	var queryString = util.format(insertSongQuery, data.artist, data.title, data.tempo || null, data.genre, data.duration || null, data.energy || null, data.liveness || null, data.speechiness || null, data.acousticness || null, data.instrumentalness || null, data.loudness || null, data.valence || null, data.danceability || null);
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
	var echoNestUrl = util.format(urls.EchoNestTrackApi, echoNestKey, artist, title);
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
		var songMetaData;
		// insert song into db right after getting data back
		if (typeof(songData.response.songs[0]) !== 'undefined') {
			songMetaData = songData.response.songs[0].audio_summary;
		} else {
			songMetaData = {};
			//callback(null, null);
		}

		songMetaData.artist = artist;
		songMetaData.title = title;
		songMetaData.genre = genre;
		insertSongIntoDB(songMetaData, function (error, rows) {
			if (error) {
				errorLog.error("[models/ModelTrackInfoEchoNest.js]: errors when inserting into music db");
				errorLog.error(error);
				callback(error, null);
				return;
			}
			errorLog.info(rows);
			var result = {
				tempo: songMetaData.tempo,
				id: rows.insertId
			};
			callback(null, result);
		});
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
				//console.log("get song in db", rows);
				callback(null, rows);
			}
		}
	});
};

module.exports = ModelTrackInfoEchoNest;
