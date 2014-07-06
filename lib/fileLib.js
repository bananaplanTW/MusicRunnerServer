var fs = require("fs");

var readJSON = function (filename, callback) {
	fs.exists(filename, function (exists) {
		if (exists) {
			fs.stat(filename, function (error, stats) {
		        fs.open(filename, 'r', function (error, fd) {
		            var buffer = new Buffer(stats.size);
		            fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
		                var data = buffer.toString("utf8", 0, buffer.length);
		                var json = JSON.parse(data);
		                fs.close(fd);
		                callback(null, json);
		            })
		        });
		    });
		} else {
			callback({reason:"file doesn't exist"}, null);
		}
	})
}

exports.readJSON = readJSON;
