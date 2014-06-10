var weatherConditionMapping = require("../data/WeatherConditionMapping.json");
exports.parse36HoursCityWeather = function (data) {
    var parsedWeather = {};
    var weatherElements = data['weather-elements'][0];
    parsedWeather.condition = weatherElements.Wx[0].time[0].text[0] || '';
    parsedWeather.maxT = weatherElements.MaxT[0].time[0].value[0]._ || '';
    parsedWeather.minT = weatherElements.MinT[0].time[0].value[0]._ || '';
    parsedWeather.feeling = weatherElements.CI[0].time[0].text[0] || '';
    parsedWeather['chance-of-rain'] = weatherElements.PoP[0].time[0].value[0]._ || '';
    return parsedWeather;
};

exports.parseCityUV = function (data, cityCode) {
    var UV = {
    	uv: ''
    };
    data.forEach(function (location) {
    	if (location.locationCode[0] === cityCode) {
    		UV.uv = location.value[0];
    	}
    });
    return UV;
};

exports.parseNext24HoursWeather = function (currentHour, data) {
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
    var weatherElements = data['weather-elements'][0];
    var currentWeather;
    var currentTime = new Date(weatherElements.MaxT[0].time[0]['$'].start);
    currentTime.setHours(currentHour);

    for (i = 0; i < 24; i++ ) {
        if (previousIndex !== currentIndex) {
            currentWeather = weatherElements.MaxT[0].time[currentIndex];
            startTime      = new Date(weatherElements.MaxT[0].time[currentIndex]['$'].start);
            endTime        = new Date(weatherElements.MaxT[0].time[currentIndex]['$'].end);
            maxT           = weatherElements.MaxT[0].time[currentIndex].value[0]._ || '';
            minT           = weatherElements.MinT[0].time[currentIndex].value[0]._ || '';
            chanceOfRain   = weatherElements.PoP[0].time[currentIndex].value[0]._ || '';
            weatherIndex   = weatherElements.Wx[0].time[0].value[0];
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
                condIndex = 'undefined value=' + weatherIndex + ' with string=' + weatherElements.Wx[0].time[0].text[0];
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
    //console.log(next24Houts);
    return next24Houts;
};

exports.parseWeekWeather = function (data) {
    var weekWeather = [];
    var dateMapping = [];
    var previousDate;
    
    data.Wx[0].time.forEach(function (forecast) {
        var time = new Date(forecast['$'].start);
        // right now only fetch forecast data during the daytime
        if (!previousDate || previousDate !== time.getDate()) {
            var forecastElement = {
                month: (time.getMonth() + 1).toString(),
                date: time.getDate().toString(),
                day: time.getDay().toString(),
                condition: forecast.text[0]
            }
            weekWeather.push(forecastElement);
            dateMapping.push(time.getDate());
            previousDate = time.getDate();
        }
    });

    data.MaxT[0].time.forEach(function (forecast) {
        var time = new Date(forecast['$'].start);
        // right now only fetch forecast data during the daytime
        if (!previousDate || previousDate !== time.getDate()) {
            var date = time.getDate();
            var index = dateMapping.indexOf(date);
            weekWeather[index].maxT = forecast.value[0]._;
            previousDate = date;
        }
    });

    data.MinT[0].time.forEach(function (forecast) {
        var time = new Date(forecast['$'].start);
        // right now only fetch forecast data during the daytime
        if (!previousDate || previousDate !== time.getDate()) {
            var date = time.getDate();
            var index = dateMapping.indexOf(date);
            weekWeather[index].minT = forecast.value[0]._;
            previousDate = date;
        }
    });
    return weekWeather;
}