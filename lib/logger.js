var Log = require('log'),
	fs = require('fs'),
	errorLogfile,
    errorLog;
var createLogsDir = function (callback) {
	fs.stat ('./logs', function (errors, stats) {
		console.log(stats);
	    if (typeof(stats) === 'undefined') { // logs doesn't exist
	        fs.mkdir('./logs', function (error, dirPath) {
	            if (error && error.code !== "EEXIST") {
	                callback (error, null);
	                return;
	            }
	            callback(null, "succeed");
	        });
	    } else {
	        callback(null, "already existed");
	    }
	});
};

var getErrorLog = function () {
	if (errorLog) {
		return errorLog;
	}
	createLogsDir(function (error, stats) {
		if (error && stats == null) {
			console.error("[lib/logger.js]: cannot create errorlogs file");
			throw error;
			return
		}
		errorLogfile = fs.createWriteStream('./logs/errors.log', {flags: 'a'});
    	errorLog = new Log('debug', errorLogfile);
    	return errorLog;
	});
};
getErrorLog();

exports.createLogsDir = createLogsDir;
exports.errorLog = getErrorLog;