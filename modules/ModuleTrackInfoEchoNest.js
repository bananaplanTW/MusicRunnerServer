var ModelTrackInfoEchoNest = require("../models/ModelTrackInfoEchoNest");

var ModuleTrackInfoEchoNest = (function () {
    var instance;
    function getInstance () {
    	var modelTrackInfoEchoNest = new ModelTrackInfoEchoNest();
    	return {
    		getTrackInfo : function (artist, title, genre, callback) {
    			modelTrackInfoEchoNest.getTrackInfo(artist, title, genre, function (error, data) {
    				if (error) {
    					callback(error, null);
    					return;
    				}
    				var trackInfo = data;
    				var result = {};
    				try {
	    				result.bpm = trackInfo.tempo;
	    			} catch (e) {
	    				result.bpm = -1;
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