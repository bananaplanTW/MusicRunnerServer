var moduleTrackInfoEchoNest = require('../modules/ModuleTrackInfoEchoNest').getInstance(),
    errorLog = require('../lib/logger').errorLog;

exports.getTrackInfo = function (songList, callback) {
	var length = songList.length;
	songList.forEach(function (song) {
		moduleTrackInfoEchoNest.getTrackInfo(song.artist, song.title, function (error, data) {
			length--;
			if (error) {
				errorLog.error("[stores/TrackInfo.js][Error] cannot getting track info");
				errorLog.error(error);
				song.bpm = -2;
			} else {
				song.bpm = data.bpm;
			}

			if (length == 0) {
				callback(null, JSON.stringify(songList));
				return
			}
		});
	});
};
