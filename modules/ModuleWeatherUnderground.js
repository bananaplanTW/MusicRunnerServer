var ModelWeatherUnderground = require("../models/ModelWeatherUnderground");

var ModuleWeatherUnderground = (function () {
    var instance;

    function getInstance () {
        var weather = new ModelWeatherUnderground();
        weather.setExpireInHour(1);
        return {
            getWeatherConditions: function (city, country, callback) {
                weather.getWeatherConditions(city, country, function (error, data) {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    var returnData = {};
                    var curObser = data.current_observation;
                    returnData.city = curObser.display_location.city;
                    returnData.temp_f = curObser.temp_f;
                    returnData.temp_c = curObser.temp_c;
                    returnData.feelslike_f = curObser.feelslike_f;
                    returnData.feelslike_c = curObser.feelslike_c;
                    returnData.relative_humidity = curObser.relative_humidity;
                    returnData.UV = curObser.UV;
                    returnData.wind_mph = curObser.wind_mph;
                    returnData.wind_kph = curObser.wind_kph;
                    returnData.icon = curObser.icon;
                    returnData.icon_url = curObser.icon_url;
                    returnData.condition = curObser.weather;

                    callback(null, returnData);
                });
            },
            getWeatherHourly: function (city, country, callback) {
                weather.getWeatherHourly(city, country, function (error, data) {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    var returnData = [];
                    var hourlyForecast = data.hourly_forecast;
                    var length = hourlyForecast.length, 
                        i, tempData;
                    for (i = 0; i < length; i ++) {
                        tempData = {};
                        tempData.time = hourlyForecast[i].FCTTIME.hour;
                        tempData.ampm = hourlyForecast[i].FCTTIME.ampm;
                        tempData.temp_c = hourlyForecast[i].temp.metric;
                        tempData.temp_f = hourlyForecast[i].temp.english;
                        tempData.condition = hourlyForecast[i].condition;
                        tempData.icon = hourlyForecast[i].icon;
                        tempData.icon_url = hourlyForecast[i].icon_url;
                        returnData.push(tempData)
                    }
                    callback(null, returnData);
                })
            },
            getWeatherForecast5Day: function (city, country, callback) {
                weather.getWeatherForecast10Day(city, country, function (error, data) {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    var returnData = [];
                    var forecast10Day = data.forecast.simpleforecast.forecastday;
                    var i, tempData;
                    for (i = 0; i < 5; i ++) {
                        tempData = {};
                        tempData.date = forecast10Day[i].date.pretty;
                        tempData.weekday = forecast10Day[i].date.weekday;
                        tempData.temp_f_high = forecast10Day[i].high.fahrenheit;
                        tempData.temp_f_low = forecast10Day[i].low.fahrenheit;
                        tempData.temp_c_high = forecast10Day[i].high.celsius;
                        tempData.temp_c_low = forecast10Day[i].low.celsius;
                        tempData.conditions = forecast10Day[i].conditions;
                        tempData.icon = forecast10Day[i].icon;
                        tempData.icon_url = forecast10Day[i].icon_url;
                        returnData.push(tempData);
                    }
                    callback(null, returnData);
                });
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

module.exports = ModuleWeatherUnderground;