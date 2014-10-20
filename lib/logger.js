var Log = require('log'),
	fs = require('fs'),
	errorLogfile, errorLog;
var createLogsDir = function (callback) {
	fs.stat ('./logs', function (errors, stats) {
		console.log(stats);
	    if (typeof(stats) === 'undefined') { // logs doesn't exist
	        fs.mkdir('./logs', function (error, dirPath) {
	            if (error && error.code !== "EEXIST") {
	                callback (error, null);
	                return;
	            }
	            callback(null, {status: "succeed"});
	        });
	    } else {
	        callback(null, {status: "existed"});
	    }
	});
};

errorLogfile = fs.createWriteStream('./logs/errors.log', {flags: 'a'});
errorLog = new Log('debug', errorLogfile);

exports.createLogsDir = createLogsDir;
exports.errorLog = errorLog;