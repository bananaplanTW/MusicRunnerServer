var fs = require('fs'),
    timer = require('timer').timer,
    api = require('../lib/callApi'),
    parser = require('xml2js'),
    parseString = parser.parseString,
    urls = require('../data/opendataUrls');
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var FIVE_MINUTES = 5 * MINUTE;
var ONE_HOUR = 60 * MINUTE;

process.on('message', function (message) {
    if (message === 'ready') {
        initialize();
        console.log('[background/checkingUpdate.js]: server starts to update youbike status in every 5 minutes');
        timer.auto(FIVE_MINUTES, function(){
            api.getHttpResponse(urls.youbike, youbikeParseData);
        });
        console.log('[background/checkingUpdate.js]: server starts to update weather status in every hour');
        timer.auto(ONE_HOUR, function(){
            api.getHttpResponse(urls.t36hrs, t36hrsParseData);
        });
        console.log('[background/checkingUpdate.js]: server starts to update UV status in every 6 hours');
        timer.auto(6 * ONE_HOUR, function(){
            api.getHttpResponse(urls.uv, uvParseData);
        });
        console.log('[background/checkingUpdate.js]: server starts to update weekly weather status in every hour');
        timer.auto(ONE_HOUR, function(){
            api.getHttpResponse(urls.weekly, weeklyParseData);
        });
    }
});


function initialize () {
    console.log("[background/checkingUpdate.js]: update data while server is restart");
    api.getHttpResponse(urls.youbike, youbikeParseData);
    api.getHttpResponse(urls.t36hrs, t36hrsParseData);
    api.getHttpResponse(urls.uv, uvParseData);
    api.getHttpResponse(urls.weekly, weeklyParseData);
}

var youbikeParseData = function (error, data) {
    if (error) {
        console.log(error);
        return;
    }
    var result = JSON.parse(data);
    var youbike = fs.createWriteStream(__dirname + '/../.cache/youbike.json');
    youbike.write(JSON.stringify(result.retVal));
    youbike.end();
    console.log("[background/checkingUpdate.js]: server updated youbike data");
};

var t36hrsParseData = function (error, data) {
    if (error) {
        console.log(error);
        return;
    }
    parseString(data, function (error, result) {
        var weather36hours = fs.createWriteStream(__dirname + '/../.cache/weather36hours.json');
        weather36hours.write(JSON.stringify(result.fifowml.data[0].location));
        weather36hours.end();
        console.log('[background/checkingUpdate.js]: server updated weather36hour data');
    });
};

var uvParseData = function (error, data) {
    if (error) {
        console.log(error);
        return;
    }
    parseString(data, function (error, result) {
        var uv = fs.createWriteStream(__dirname + '/../.cache/uv.json');
        uv.write(JSON.stringify(result.cwbopendata.dataset[0].weatherElement[0].location));
        uv.end();
        console.log('[background/checkingUpdate.js]: server updated UV data');
    });
};

var weeklyParseData = function (error, data) {
    if (error) {
        console.log(error);
        return;
    }
    parseString(data, function (error, result) {
        var weekWeather = fs.createWriteStream(__dirname + '/../.cache/weekWeather.json');
        weekWeather.write(JSON.stringify(result.fifowml.data[0].location));
        weekWeather.end();
        console.log('[background/checkingUpdate.js]: server updated weekWeather data');
    });
};