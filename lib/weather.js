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
