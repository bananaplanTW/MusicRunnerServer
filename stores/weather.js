var parser = require('xml2js');
var parseString = parser.parseString;
var weatherLib = require('../lib/weather');
var api = require('../lib/call_api');
var weatherMappingData = require('../data/weather.json');
var weatherModel = require('../models/weather');
var WeatherCollector = weatherModel.WeatherCollector;
var cityMapping = weatherMappingData.cityMapping;

//var fs = require('fs');
//var ff = new fs.createWriteStream('UV.json');

exports.get36HoursWeather = function (city, collector) {
    var url = 'http://opendata.cwb.gov.tw/opendata/MFC/F-C0032-001.xml';
    var parseData = function (error, data) {
        if (error) {
            //[TODO] error should be handled
            collector.isGetting36Hours = true;
            collector.emit('error', error);
            return;
        }
        parseString(data, function (error, result) {
            //var builder = new parser.Builder();
            //var xml = builder.buildObject(result.fifowml.data[0]);
            var parsedWeather = weatherLib.parse36HoursCityWeather(result.fifowml.data[0].location[city]);
            collector.isGetting36Hours = true;
            collector.emit('data', parsedWeather);
        });
    };
    api.getHttpResponse(url, parseData);
};

exports.getCityUV = function (city, collector) {
    var url = 'http://opendata.cwb.gov.tw/opendata/DIV2/O-A0005-001.xml';
    var parseData = function (error, data) {
        if (error) {
            //[TODO] error should be handled
            collector.isGettingUV = true;
            collector.emit('error', error);
            return;
        }
        parseString(data, function (error, result) {
            var UV = weatherLib.parseCityUV(result.cwbopendata.dataset[0].weatherElement[0].location, city);
            collector.isGettingUV = true;
            collector.emit('data', UV);
        });
    };
    api.getHttpResponse(url, parseData);
}

exports.getWeekWeather = function (city, collector, callback) {
    var url = 'http://opendata.cwb.gov.tw/opendata/MFC/F-C0032-005.xml';
    var parseData = function (error, data) {
        if (error) {
            //[TODO] error should be handled
            collector.isGettingWeekWeather = true;
            collector.emit('error', error);
            return;
        }
        parseString(data, function (error, result) {
            var weekWeather = weatherLib.parseWeekWeather(result.fifowml.data[0].location[city]['weather-elements'][0]);
            collector.isGettingWeekWeather = true;
            collector.emit('data', weekWeather);
        });
    };
    api.getHttpResponse(url, parseData);
}

exports.get = function(cityCode, callback){
    var cityCode = cityCode || 0;
    var weatherCollector = new WeatherCollector(callback);
    this.get36HoursWeather(cityCode, weatherCollector);
    this.getCityUV(cityMapping[cityCode].uv, weatherCollector);
};

exports.getWeek = function(cityCode, callback){
    var cityCode = cityCode || 0;
    var weatherCollector = new WeatherCollector(callback);
    this.getWeekWeather(cityCode, weatherCollector, callback);
};