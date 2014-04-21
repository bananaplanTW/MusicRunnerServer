var api = require('../lib/call_api');
var fs = require('fs');
exports.get = function (callback) {
    try {
        var youBikeData = require('../.cache/youbike');
        callback(null, JSON.stringify(youBikeData));
    } catch (e) {
        var url = 'http://its.taipei.gov.tw/atis_index/data/youbike/youbike.json';
        var parseData = function (error, data) {
            if (error) {
                console.log(error);
                callback('no youbike data', null);
                return;
            }
            var result = JSON.parse(data);
            var youbike = fs.createWriteStream(__dirname + '/../.cache/youbike.json');
            youbike.write(JSON.stringify(result.retVal));
            youbike.close();
            callback(null, JSON.stringify(result.retVal));
        };
        api.getHttpResponse(url, parseData);
    }
};