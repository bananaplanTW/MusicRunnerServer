var ModelBase = require("./ModelBase"),
    urls = require('../data/opendataUrls'),
    util = require('util');

var ModelWeatherUnderground = function () {

};
util.inherits(ModelWeatherUnderground, ModelBase);

ModelWeatherUnderground.prototype.getDailyWeather = function (city, country) {
    var that = this;
    var filename = util.format(urls.WeatherDailyCacne, country, city);

    console.log(filename);
    that.readFile(filename, function (error, data) {
        if (error) {
            console.log(error.reason);
            var weatherApiUrl = util.format(urls.WeatherUnderground, "", country, city);
            console.log(weatherApiUrl);
            that.HTTPGet(weatherApiUrl, function (error, data) {
                if (error) {
                    console.log(error);
                    return;
                }
                that.saveFile(filename, data);
                console.log(data);
            });
        } else {
            console.log(data);
        }
    });
};

ModelWeatherUnderground.prototype.get24HoursWeather = function (city, country) {

}

ModelWeatherUnderground.prototype.getWeeklyWeather = function (city, country) {

}

var yahooweather = new ModelWeatherUnderground();
yahooweather.getDailyWeather("taipei", "tw");