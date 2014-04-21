var api = require('../lib/call_api');
exports.get = function (callback) {
    var url = 'http://its.taipei.gov.tw/atis_index/data/youbike/youbike.json';
    var parseData = function (error, data) {
        if (error) {
            callback(error, null);
            return;
        }
        var result = JSON.parse(data);
        console.log(result);
        callback(null, JSON.stringify(result.retVal));
        //res.write(JSON.stringify(result.retVal));
        //res.end();
    };
    api.getHttpResponse(url, parseData);
/*
    var data;
    var request = http.get('http://its.taipei.gov.tw/atis_index/data/youbike/youbike.json', function (response) {
        var data_json = "";
        response.on('data', function (chunk) {
            data_json += chunk.toString();
        });
        response.on('end', function () {
            res.writeHead(200, {
                'Content-Type': 'text/json'
            });
            data = JSON.parse(data_json);
            res.write(JSON.stringify(data.retVal));
            res.end();
        });
    });
    request.on('error', function (e) {
        console.log(e);
    });
    request.end();*/
};