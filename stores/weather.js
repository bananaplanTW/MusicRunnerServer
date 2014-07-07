var ModuleWeather = require("../modules/weather");
var weatherModule = ModuleWeather.getInstance();
weatherModule.setData();
weatherModule.setObserver();

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
