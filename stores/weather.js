var ModuleWeather = require("../modules/weather");
var ModuleWeatherUnderground = require("../modules/ModuleWeatherUnderground");
var weatherModule = ModuleWeather.getInstance();
var weatherUnderground = ModuleWeatherUnderground.getInstance();
weatherModule.setData();
weatherModule.setObserver();

// ---- deprecated, use weather underground instead -------
exports.getDaily = function(cityCode, callback){
    var cityCode = cityCode || 0;
    var dailyWeather = weatherModule.getDailyWeather(cityCode);
    if (dailyWeather) {
        callback(null, JSON.stringify(dailyWeather));
    } else {
        callback({reason: "cannot get daily weather"}, null);
    }
};

exports.getWeekly = function(cityCode, callback){
    var cityCode = cityCode || 0;
    var weeklyWeather = weatherModule.getWeeklyWeather(cityCode);
    if (weeklyWeather) {
        callback(null, JSON.stringify(weeklyWeather));
    } else {
        callback({reason: "cannot get weekly weather"}, null);
    }
};

exports.get24Hours = function(cityCode, currentHour, callback){
    var cityCode = cityCode || 0;
    var currentHour = currentHour || (new Date()).getHours();
    var t24HoursWeather = weatherModule.get24HoursWeather(cityCode, currentHour);
    if (t24HoursWeather) {
        callback(null, JSON.stringify(t24HoursWeather));
    } else {
        callback({reason: "cannot get 24 hours weather"}, null);
    }
};
// ------------------------------------------------------

exports.getWeatherConditions = function (city, country, callback) {
    weatherUnderground.getWeatherConditions(city, country, function (error, data) {
        if (error) {
            callback({reason: "cannot get weather conditions"}, null);
            return;
        }
        callback(null, JSON.stringify(data));
    });
};

exports.getWeatherHourly = function (city, country, callback) {
    weatherUnderground.getWeatherHourly(city, country, function (error, data) {
        if (error) {
            callback({reason: "cannot get weather hourly"}, null);
            return;
        }
        callback(null, JSON.stringify(data))
    });
};

exports.getWeatherForecast5Day = function (city, country, callback) {
    weatherUnderground.getWeatherForecast5Day(city, country, function (error, data) {
        if (error) {
            callback({reason: "cannot get weather forecast 5 days"}, null);
            return;
        }
        callback(null, JSON.stringify(data))
    });
};
