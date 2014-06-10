var mysql = require('mysql'),
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: ''
	});


connection.connect(function (error) {
	if (error) {
		console.log(error);
		return;
	}
	console.log("db is connected");
});

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