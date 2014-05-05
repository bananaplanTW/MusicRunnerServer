var util = require('util');
var EventEmitter = require('events').EventEmitter;

function WeatherCollector (_callback) {
    EventEmitter.call(this);

    var weatherData = {};
    var callback = _callback;

    this.isGetting36Hours = false;
    this.isGetting24Hours = false;
    this.isGettingUV = false;
    this.isGettingWeekWeather = false;
    
    this.on('data', function (data) {
        var type;
        if (Array.isArray(data)) {
            //for week weather data
            weatherData = data;
        } else {
            for (type in data) {
                weatherData[type] = data[type];
            }
        }
        if ((this.isGetting36Hours && this.isGettingUV) ||
             this.isGettingWeekWeather ||
             this.isGetting24Hours) {
            callback(null, JSON.stringify(weatherData));
        }
    });
    this.on('error', function (error) {
        console.log(error);
        if ((this.isGetting36Hours && this.isGettingUV) ||
             this.isGettingWeekWeather) {
            callback(null, JSON.stringify(weatherData));
        }
    });
}
util.inherits(WeatherCollector, EventEmitter);
exports.WeatherCollector = WeatherCollector;