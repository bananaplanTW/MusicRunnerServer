var parser = require('xml2js');
var parseString = parser.parseString;
var weatherLib = require('../lib/weather');
var api = require('../lib/call_api');
var weatherMappingData = require('../data/weather.json');
var weatherModel = require('../models/weather');
var WeatherCollector = weatherModel.WeatherCollector;
var cityMapping = weatherMappingData.cityMapping;
var urls = require("../data/opendataUrls")

var fs = require('fs');
//var ff = new fs.createWriteStream('UV.json');

exports.get36HoursWeather = function (city, collector) {
    try {
        var weather36hours = require('../.cache/weather36hours');
        var parsedWeather = weatherLib.parse36HoursCityWeather(weather36hours[city]);
        collector.isGetting36Hours = true;
        collector.emit('data', parsedWeather);
    } catch (e) {
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

                var weather36hours = fs.createWriteStream(__dirname + '/../.cache/weather36hours.json');
                weather36hours.write(JSON.stringify(result.fifowml.data[0].location));
                weather36hours.close();
            });
        };
        api.getHttpResponse(urls.t36hrs, parseData);
    }
};

exports.getCityUV = function (city, collector) {
    try {
        var uvJSON = require('../.cache/uv');
        var UV = weatherLib.parseCityUV(uvJSON, city);
        collector.isGettingUV = true;
        collector.emit('data', UV);
    } catch (e) {
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

                var uv = fs.createWriteStream(__dirname + '/../.cache/uv.json');
                uv.write(JSON.stringify(result.cwbopendata.dataset[0].weatherElement[0].location));
                uv.close();
            });
        };
        api.getHttpResponse(urls.uv, parseData);
    }  
};

exports.getNext24HoursWeather = function (city, currentHour, collector) {
    try {
        var weather36hours = require('../.cache/weather36hours');
        var next24Hours = weatherLib.parseNext24HoursWeather(currentHour, weather36hours[city]);
        collector.isGetting24Hours = true;
        collector.emit('data', next24Hours);
    } catch (e) {
        var parseData = function (error, data) {
            if (error) {
                //[TODO] error should be handled
                collector.isGetting24Hours = true;
                collector.emit('error', error);
                return;
            }
            parseString(data, function (error, result) {
                var next24Hours = weatherLib.parseNext24HoursWeather(currentHour, result.fifowml.data[0].location[city]);
                collector.isGetting24Hours = true;
                collector.emit('data', next24Hours);

                var weather36hours = fs.createWriteStream(__dirname + '/../.cache/weather36hours.json');
                weather36hours.write(JSON.stringify(result.fifowml.data[0].location));
                weather36hours.close();
            });
        };
        api.getHttpResponse(urls.t36hrs, parseData);
    }
};

exports.getWeekWeather = function (city, collector) {
    try {
        var weekWeatherJSON = require('../.cache/weekWeather');
        var weekWeather = weatherLib.parseWeekWeather(weekWeatherJSON[city]['weather-elements'][0]);
        collector.isGettingWeekWeather = true;
        collector.emit('data', weekWeather);
    } catch (e) {
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

                var weekWeatherJSON = fs.createWriteStream(__dirname + '/../.cache/weekWeather.json');
                weekWeatherJSON.write(JSON.stringify(result.fifowml.data[0].location));
                weekWeatherJSON.close();
            });
        };
        api.getHttpResponse(urls.weekly, parseData);
    }
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
    this.getWeekWeather(cityCode, weatherCollector);
};

exports.get24Hours = function(cityCode, currentHour, callback){
    var cityCode = cityCode || 0;
    var currentHour = currentHour || (new Date()).getHours();
    var weatherCollector = new WeatherCollector(callback);
    this.getNext24HoursWeather(cityCode, currentHour, weatherCollector);
};
