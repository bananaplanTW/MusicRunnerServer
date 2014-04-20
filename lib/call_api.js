var http = require('http');
exports.getHttpResponse = function (url, callback) {
    var request = http.get(url, function (response) {
        var data = "";
        response.on('data', function (chunk) {
            data += chunk.toString();
        });
        response.on('end', function () {
            callback(null, data);
        });;
    });
    request.on('error', function (e) {
        console.log(e);
        callback(e, null);
    });
    request.end();
};