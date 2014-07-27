var ModelWeather = require("../models/weather").ModelWeather;
var ModelWeatherUnderground = require("../models/ModelWeatherUnderground");

var ModuleWeather = (function () {
    var instance;

    function getInstance () {
        var weather = new ModelWeather();
        return {
            setObserver: function () {
                weather.setObserver();
            },
            setData: function () {
                weather.setData();
            },
            getDailyWeather: function (cityCode) {
                var code = cityCode || 0;
                return weather.getDailyWeather(code);
            },
            getWeeklyWeather: function (cityCode) {
                var code = cityCode || 0;
                return weather.getWeeklyWeather(code);
            },
            get24HoursWeather: function (cityCode, currentHour) {
                var code = cityCode || 0;
                var hour = currentHour || (new Date()).getHours();
                return weather.get24HoursWeather(code, hour);
            }
        };
    }

    return {
        getInstance: function () {
            if (typeof(instance) === "undefined") {
                instance = getInstance();
            }
            return instance;
        }
    }
})();

module.exports = ModuleWeather;