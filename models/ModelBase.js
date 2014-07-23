var fileLib = require("../lib/fileLib"),
	api = require('../lib/callApi'),
	fs = require('fs');

var ModelBase = function () {

}

ModelBase.prototype.readFile = function(filepath, callback) {
	fileLib.readJSON(filepath, function (error, data) {
        if (error) {
            console.error("[models/ModelWeatherUnderground.js][error]: " + error.reason);
            callback(error, null);
            return;
        }
        callback(null, data);
    });
};

ModelBase.prototype.saveFile = function (filename, data) {
	var file = fs.createWriteStream(__dirname + filename);
    file.write(data);
    file.end();
}

ModelBase.prototype.HTTPGet = function (url, callback) {
	api.getHttpResponse(url, callback);
}

module.exports = ModelBase;