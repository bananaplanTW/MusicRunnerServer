var mysql = require('mysql'),
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'Sunflower123',
		database: 'musicrun'
	});


connection.connect(function (error) {
	if (error) {
		console.log(error);
		return;
	}
	console.log("db is connected");
	execute("SELECT * FROM account_info;", function (rows, error) {
		if (error) {
			console.log(error);
			return;
		}
		console.log(rows);
	});
});

var execute = function (querySting, callback) {
	connection.query(querySting, function(err, rows) {
		if (err) {
			callback(err, null);
			return;
		};
		callback(null, rows);
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
