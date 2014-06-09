var util = require('util');
var EventEmitter = require('events').EventEmitter;

var parser = require('xml2js');
var parseString = parser.parseString;

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


// modulize
var ModelDailyWeather = function () {
    // store data in DB?
    this.data;
    this.callback;

}
ModelDailyWeather.prototype.parseData = function (error, data) {
    if (error) {
        return;
    }
    parseString(data, function (error, result) {
        var parsedWeather = weatherLib.parse36HoursCityWeather(result.fifowml.data[0].location[city]);

        var parsedWeather = {};
        var weatherElements = data['weather-elements'][0];
        parsedWeather.condition = weatherElements.Wx[0].time[0].text[0] || '';
        parsedWeather.maxT = weatherElements.MaxT[0].time[0].value[0]._ || '';
        parsedWeather.minT = weatherElements.MinT[0].time[0].value[0]._ || '';
        parsedWeather.feeling = weatherElements.CI[0].time[0].text[0] || '';
        parsedWeather['chance-of-rain'] = weatherElements.PoP[0].time[0].value[0]._ || '';


        var weather36hours = fs.createWriteStream(__dirname + '/../.cache/weather36hours.json');
        weather36hours.write(JSON.stringify(result.fifowml.data[0].location));
        weather36hours.close();
    });
};
ModelDailyWeather.prototype.setData = function (error, data, isFromCache) {
    if (error) {
        return;
    }
    if (isFromCache) {
        this.data = data;
    } else {
        this.data = data.fifowml.data[0].location;
    }
};
ModelDailyWeather.prototype.setCallback = function (callback) {
    this.callback = callback;
};


