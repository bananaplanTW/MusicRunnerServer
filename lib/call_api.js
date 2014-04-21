var http = require('http');
exports.getHttpResponse = function (url, callback) {
    var request = http.get(url, function (response) {
        var data = "";
        response.on('data', function (chunk) {
            data += chunk.toString();
        });
        response.on('end', function () {
            if (response.statusCode === 200) {
                callback(null, data);
            } else {
                callback('not found', null);
            }
        });;
    });
    request.on('error', function (e) {
        console.log(e);
        callback(e, null);
    });
    request.end();
};