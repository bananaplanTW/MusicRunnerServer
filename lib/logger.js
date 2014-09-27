var Log = require('log'),
	fs = require('fs'),
	errorLogfile = fs.createWriteStream('./logs/errors.log', {flags: 'a'}),
    errorLog = new Log('debug', errorLogfile);

exports.errorLog = errorLog;