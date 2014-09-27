var ModelBase = require("./ModelBase"),
    urls = require('../data/opendataUrls'),
    files = require('../data/fileFormats'),
    errorLog = require('../lib/logger').errorLog,
    util = require('util');
var uweatherkey = process.env.WEATHERUNKEY;

var ModelWeatherUnderground = function () {
    this.apiTypeConditions    = "conditions";
    this.apiTypeHourly        = "hourly";
    this.apiTypeForecast10day = "forecast10day";
};
util.inherits(ModelWeatherUnderground, ModelBase);

ModelWeatherUnderground.prototype.setExpireInHour = function (hours) {
    this.expiredInMilli = 1000 * 60 * 60 * hours; // i min
}

ModelWeatherUnderground.prototype.getWeatherConditions = function (city, country, callback) {
    var that = this;
    var filename = util.format(files.WeatherConditionsCache, country, city);
    var filepath = __dirname + filename;

    that.getWeatherData(city, country, that.apiTypeConditions, filepath, callback);
};

ModelWeatherUnderground.prototype.getWeatherHourly = function (city, country, callback) {
    var that = this;
    var filename = util.format(files.WeatherHourlyCache, country, city);
    var filepath = __dirname + filename;

    that.getWeatherData(city, country, that.apiTypeHourly, filepath, callback);
}

ModelWeatherUnderground.prototype.getWeatherForecast10Day = function (city, country, callback) {
    var that = this;
    var filename = util.format(files.WeatherForecast10DayCache, country, city);
    var filepath = __dirname + filename;

    that.getWeatherData(city, country, that.apiTypeForecast10day, filepath, callback);
}

ModelWeatherUnderground.prototype.getWeatherData = function (city, country, apiType, filepath, callback) {
    var that = this;
    that.readFile(filepath, function (error, data) {
        if (error) {
            var weatherApiUrl = util.format(urls.WeatherUndergroundApi, uweatherkey, apiType, country, city);
            that.HTTPGet(weatherApiUrl, function (error, data) {
                if (error) {
                    errorLog.error("[models/ModelWeatherUnderground.js]: with filepath=" + filepath);
                    errorLog.error(error);
                    callback(error, null);
                    return;
                }
                that.saveFile(filepath, data);
                callback(null, JSON.parse(data));
            });
        } else {
            callback(null, data);
        }
    });
}
module.exports = ModelWeatherUnderground;
