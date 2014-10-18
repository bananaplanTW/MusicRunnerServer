var ModuleWeatherUnderground = require("../modules/ModuleWeatherUnderground");
var weatherUnderground = ModuleWeatherUnderground.getInstance();

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
