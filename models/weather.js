var fs = require("fs");
var fileLib = require("../lib/fileLib");
var weatherConditionMapping = require("../data/WeatherConditionMapping");
var weatherMappingData = require('../data/weather');
var cityMapping = weatherMappingData.cityMapping;

var ModelWeather = function () {
    this.t36Hrs;
    this.weekly;
    this.uv;
};

ModelWeather.prototype.setData = function () {
    this.t36Hrs = require("../.cache/weather36hours");
    this.weekly = require("../.cache/weekWeather");
    this.uv = require("../.cache/uv");
};

ModelWeather.prototype.setObserver = function () {
    var that = this;
    fs.watch(__dirname + "/../.cache", function (event, filename) {
        if (event === "change") {
            switch (filename) {
                case "weather36hours.json" : 
                    fileLib.readJSON(__dirname + "/../.cache/weather36hours.json", function (error, data) {
                        if (error) {
                            console.log(error.reason);
                            return;
                        }
                        console.log("weather36Hours has been changed, update");
                        that.weekly = data;
                    });
                    break;
                case "weekWeather.json" :
                    fileLib.readJSON(__dirname + "/../.cache/weekWeather.json", function (error, data) {
                        if (error) {
                            console.log(error.reason);
                            return;
                        }
                        console.log("weekWeather has been changed, update");
                        that.weekly = data;
                    });
                    break;
                case "uv.json" :
                    fileLib.readJSON(__dirname + "/../.cache/uv.json", function (error, data) {
                        if (error) {
                            console.log(error.reason);
                            return;
                        }
                        console.log("uv.json has been changed, update");
                        that.uv = data;
                    });
                    break;
            }
        }
    });
};

ModelWeather.prototype.getDailyWeather = function (cityCode) {
    var weatherElement = this.t36Hrs[cityCode]['weather-elements'][0];
    var uvCityCode = cityMapping[cityCode].uv;
    var dailyWeather = {};
    dailyWeather.condition = weatherElement.Wx[0].time[0].text[0] || '';
    dailyWeather.maxT = weatherElement.MaxT[0].time[0].value[0]._ || '';
    dailyWeather.minT = weatherElement.MinT[0].time[0].value[0]._ || '';
    dailyWeather.feeling = weatherElement.CI[0].time[0].text[0] || '';
    dailyWeather['chance-of-rain'] = weatherElement.PoP[0].time[0].value[0]._ || '';
    this.uv.forEach(function (location) {
        if (location.locationCode[0] === uvCityCode) {
            dailyWeather.uv = location.value[0];
        }
    });
    return dailyWeather;
};

ModelWeather.prototype.getWeeklyWeather = function (cityCode) {
    var weeklyWeather = [];
    var dateMapping = [];
    var weatherElement = this.weekly[cityCode]['weather-elements'][0]
    var today = new Date(weatherElement.Wx[0].time[0]['$'].start);
    var previousDate = today.getDate();
    
    weatherElement.Wx[0].time.forEach(function (forecast) {
        var time = new Date(forecast['$'].start);
        // right now only fetch forecast data during the daytime
        if (!previousDate || previousDate !== time.getDate()) {
            var forecastElement = {
                month: (time.getMonth() + 1).toString(),
                date: time.getDate().toString(),
                day: time.getDay().toString(),
                condition: forecast.text[0]
            }

            weatherIndex   = forecast.value[0];
            condIndex      = undefined;
            for (var type in weatherConditionMapping) {
                if(weatherConditionMapping.hasOwnProperty(type)) {
                    if (weatherConditionMapping[type].indexOf(weatherIndex) > -1) {
                        condIndex = type;
                        break;
                    }
                }
            }
            if (typeof condIndex === 'undefined') {
                condIndex = 'undefined value=' + weatherIndex + ' with string=' + forecast.text[0];
            }
            forecastElement.condIndex = condIndex;

            weeklyWeather.push(forecastElement);
            dateMapping.push(time.getDate());
            previousDate = time.getDate();
        }
    });

    previousDate = today.getDate();
    weatherElement.MaxT[0].time.forEach(function (forecast) {
        var time = new Date(forecast['$'].start);
        // right now only fetch forecast weatherElement during the daytime
        if (!previousDate || previousDate !== time.getDate()) {
            var date = time.getDate();
            var index = dateMapping.indexOf(date);
            weeklyWeather[index].maxT = forecast.value[0]._;
            previousDate = date;
        }
    });

    previousDate = today.getDate();
    weatherElement.MinT[0].time.forEach(function (forecast) {
        var time = new Date(forecast['$'].start);
        // right now only fetch forecast weatherElement during the daytime
        if (!previousDate || previousDate !== time.getDate()) {
            var date = time.getDate();
            var index = dateMapping.indexOf(date);
            weeklyWeather[index].minT = forecast.value[0]._;
            previousDate = date;
        }
    });
    return weeklyWeather;
};

ModelWeather.prototype.get24HoursWeather = function (cityCode, currentHour) {
    var next24Houts = [],
        startTime,
        endTime,
        weatherIndex;
    var currentIndex = 0,
        previousIndex = -1;
    var maxT,
        minT,
        chanceOfRain,
        i;
    var weatherElement = this.t36Hrs[cityCode]['weather-elements'][0];
    var currentWeather;
    var currentTime  = new Date(weatherElement.MaxT[0].time[0]['$'].start);
    currentTime.setHours(currentHour);

    for (i = 0; i < 3; i ++) {
        startTime = new Date(weatherElement.MaxT[0].time[i]['$'].start);
        endTime   = new Date(weatherElement.MaxT[0].time[i]['$'].end);
        if (currentTime > startTime && currentTime < endTime) {
            currentIndex = i;
            previousIndex = i-1;
        }
    }

    for (i = 0; i < 24 && currentIndex < 3; i+=1 ) {
        if (previousIndex !== currentIndex) {
            currentWeather = weatherElement.MaxT[0].time[currentIndex];
            startTime      = new Date(weatherElement.MaxT[0].time[currentIndex]['$'].start);
            endTime        = new Date(weatherElement.MaxT[0].time[currentIndex]['$'].end);
            maxT           = weatherElement.MaxT[0].time[currentIndex].value[0]._ || '';
            minT           = weatherElement.MinT[0].time[currentIndex].value[0]._ || '';
            chanceOfRain   = weatherElement.PoP[0].time[currentIndex].value[0]._ || '';
            weatherIndex   = weatherElement.Wx[0].time[0].value[0];
            condIndex      = undefined;
            for (var type in weatherConditionMapping) {
                if(weatherConditionMapping.hasOwnProperty(type)) {
                    if (weatherConditionMapping[type].indexOf(weatherIndex) > -1) {
                        condIndex = type;
                        break;
                    }
                }
            }
            if (typeof condIndex === 'undefined') {
                condIndex = 'undefined value=' + weatherIndex + ' with string=' + weatherElement.Wx[0].time[0].text[0];
                console.log(condIndex);
            }

            previousIndex  = currentIndex;
        }

        next24Houts.push({
            time: currentTime.getHours().toString(),
            maxT: maxT,
            minT: minT,
            'chance-of-rain': chanceOfRain,
            condIndex: condIndex
        });
        currentTime.setHours(currentTime.getHours() + 1);
        if (currentTime >= endTime) {
            currentIndex ++;
        }
    }
    return next24Houts;
};

exports.ModelWeather = ModelWeather;
