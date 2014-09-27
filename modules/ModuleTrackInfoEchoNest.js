var ModelTrackInfoEchoNest = require("../models/ModelTrackInfoEchoNest");

var ModuleTrackInfoEchoNest = (function () {
    var instance;
    function getInstance () {
    	var modelTrackInfoEchoNest = new ModelTrackInfoEchoNest();
    	return {
    		getTrackInfo : function (artist, title, callback) {
    			modelTrackInfoEchoNest.getTrackInfo(artist, title, function (error, data) {
    				if (error) {
    					callback(error, null);
    					return;
    				}
    				var trackInfo = data.response.songs[0];
    				var result = {};
    				try {
	    				result.tempo = trackInfo.audio_summary.tempo;
	    			} catch (e) {
	    				result.tempo = -1;
	    			}
    				callback(null, result);
    				return
    			});
    		}
    	}
    }
    return {
    	getInstance : function () {
	    	if(typeof(instance) === "undefined") {
	    		instance = getInstance();
	    	}
	    	return instance;
	    }
    }
})();

module.exports = ModuleTrackInfoEchoNest;