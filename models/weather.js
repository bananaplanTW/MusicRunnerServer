var util = require('util');
var EventEmitter = require('events').EventEmitter;

function WeatherCollector (_callback) {
    EventEmitter.call(this);

    var weatherData = {};
    var callback = _callback;

    this.isGetting36Hours = false;
    this.isGettingUV = false;
    
    this.on('data', function (data) {
        var type;
        for (type in data) {
            weatherData[type] = data[type];
        }
        if (this.isGetting36Hours && this.isGettingUV) {
            callback(null, JSON.stringify(weatherData));
        }
    });
    this.on('error', function (error) {
        console.log(error);
        if (this.isGetting36Hours && this.isGettingUV) {
            callback(null, JSON.stringify(weatherData));
        }
    });
}
util.inherits(WeatherCollector, EventEmitter);
exports.WeatherCollector = WeatherCollector;