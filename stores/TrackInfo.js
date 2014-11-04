var moduleTrackInfoEchoNest = require('../modules/ModuleTrackInfoEchoNest').getInstance(),
    errorLog = require('../lib/logger').errorLog;

moduleTrackInfoEchoNest.getTrackInfo("Maroon 5", "Maps", function (error, data) {
                        if (error) {
                                errorLog.error("[stores/TrackInfo.js][Error] cannot getting track info");
                                errorLog.error(error);

                                console.log("[stores/TrackInfo.js][Error] cannot getting track info");
                                console.log(error);
                                console.log(data);
                        } else {
                        }
console.log(data);
                });

exports.getTrackInfo = function (songList, callback) {
	var length = songList.length;
	/*songList.forEach(function (song) {
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
	});*/

console.log(songList);
	function getTrackInfo (index) {
console.log("get track");
console.log(songList[index]);
		var song = songList[index];
		moduleTrackInfoEchoNest.getTrackInfo(song.artist, song.title, function (error, data) {
			length--;
			if (error) {
				errorLog.error("[stores/TrackInfo.js][Error] cannot getting track info");
				errorLog.error(error);

				console.log("[stores/TrackInfo.js][Error] cannot getting track info");
				console.log(error);
				console.log(data);
				song.bpm = -2;
			} else {
				song.bpm = data.bpm;
			}
console.log(song);
			if (length == 0) {
				callback(null, JSON.stringify(songList));
				return
			}
		});

		index ++;
		if (index < songList.length) {
			setTimeout(function() {
					getTrackInfo(index)
				}, 100);
		} else {
			//callback(null, JSON.stringify(songList));
			//return;
		}
	}
	if (songList.length > 0) {
		getTrackInfo(0);
	} else {
		callback(null, JSON.stringify(songList));
	}
	


};
