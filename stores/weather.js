var parser = require('xml2js');
var parseString = parser.parseString;
var weatherLib = require('../lib/weather');
var api = require('../lib/call_api');
var weatherModel = require('../models/weather');
var WeatherCollector = weatherModel.WeatherCollector;

//var fs = require('fs');
//var ff = new fs.createWriteStream('hv.json');

exports.get36HoursWeather = function (cityCode, collector) {
    var url = 'http://opendata.cwb.gov.tw/opendata/MFC/F-C0032-001.xml';
    var parseData = function (error, data) {
        if (error) {
            collector.emit('error', error);
            return;
        }
        parseString(data, function (error, result) {
            //var builder = new parser.Builder();
            //var xml = builder.buildObject(result.fifowml.data[0]);
            var parsedWeather = weatherLib.parse36HoursCityWeather(result.fifowml.data[0].location[cityCode]);
            collector.isGetting36Hours = true;
            collector.emit('data', parsedWeather);
        });
    };
    api.getHttpResponse(url, parseData);
};

exports.getCityHV = function (cityCode, collector) {
    var url = 'http://opendata.cwb.gov.tw/opendata/DIV2/O-A0005-001.xml';
    var parseData = function (error, data) {
        if (error) {
            collector.emit('error', error);
            return;
        }
        parseString(data, function (error, result) {
            var HV = weatherLib.parseCityHV(result.cwbopendata.dataset[0].weatherElement[0].location, cityCode);
            collector.isGettingHV = true;
            collector.emit('data', HV);
        });
    };
    api.getHttpResponse(url, parseData);
}

exports.get = function(cityCode, callback){
    var cityCode = cityCode || 0;
    var weatherCollector = new WeatherCollector(callback);
    this.get36HoursWeather(cityCode, weatherCollector);
    this.getCityHV('466920', weatherCollector);
};