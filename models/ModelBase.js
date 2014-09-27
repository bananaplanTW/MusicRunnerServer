var fileLib = require("../lib/fileLib"),
    api = require('../lib/callApi'),
    errorLog = require('../lib/logger').errorLog,
    fs = require('fs');

var ModelBase = function () {
    this.expiredInMilli = -1;
}

ModelBase.prototype.readFile = function(filepath, callback) {
    var that = this;
    fileLib.readJSON(filepath, function (error, data, stats) {
        if (error) {
            errorLog.error("[models/ModelBase.js] " + error.reason);
            callback(error, null);
            return;
        }
        var current = new Date()
        var last = new Date(stats.mtime);
        if(that.expiredInMilli > 0 && (current.getTime() - last.getTime()) > that.expiredInMilli) {
            errorLog.debug("[models/ModelBase.js]: info expired, should be updated, filepath: " + filepath);
            callback({reason:"data expired"}, null);
            return;
        }

        callback(null, data);
    });
};

ModelBase.prototype.saveFile = function (filepath, data) {
    var file = fs.createWriteStream(filepath);
    file.write(data);
    file.end();
}

ModelBase.prototype.HTTPGet = function (url, callback) {
    api.getHttpResponse(url, callback);
}

module.exports = ModelBase;