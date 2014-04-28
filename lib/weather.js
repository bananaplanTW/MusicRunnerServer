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

exports.parseWeekWeather = function (data) {
    var weekWeather = [];
    var dateMapping = [];
    var previousDate;
    
    data.Wx[0].time.forEach(function (forecast) {
        var time = new Date(forecast['$'].start);
        // right now only fetch forecast data during the daytime
        if (!previousDate || previousDate !== time.getDate()) {
            var forecastElement = {
                month: time.getMonth() + 1,
                date: time.getDate(),
                day: time.getDay(),
                condition: forecast.text[0]
            }
            weekWeather.push(forecastElement);
            dateMapping.push(forecastElement.date);
            previousDate = forecastElement.date;
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
    console.log(weekWeather);
    return weekWeather;
}