var mysql = require('mysql'),
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'musictrack',
		password: 'mtrack',
		database: 'MusicTrack'
	});

try {
	//connection.connect();
} catch (e) {
	console.error('erorr on connecting to db');
}

var execute = function (querySting, callback) {
	connection.query(querySting, function(err, rows) {
		if (err) {
			callback(err, null);
			return;
		};
		callback(rows, null);
	});
};

var end = function (callback) {
	try {
		connection.end();
		callback();
	} catch (e) {
		callback('error on ending the db');
	}

}

module.exports = {
	execute: execute,
	end: end
};