exports.parse36HoursCityWeather = function (data) {
    var parsedWeather = {};
    var weatherElements = data['weather-elements'][0];
    parsedWeather.contition = weatherElements.Wx[0].time[0].text[0] || '';
    parsedWeather.maxT = weatherElements.MaxT[0].time[0].value[0]._ || '';
    parsedWeather.minT = weatherElements.MinT[0].time[0].value[0]._ || '';
    parsedWeather.feeling = weatherElements.CI[0].time[0].text[0] || '';
    parsedWeather['chance-of-rain'] = weatherElements.PoP[0].time[0].value[0]._ || '';
    return parsedWeather;
};

exports.parseCityHV = function (data, cityCode) {
    var HV = {
    	hv: ''
    };
    data.forEach(function (location) {
    	if (location.locationCode[0] === cityCode) {
    		HV.hv = location.value[0];
    	}
    });
    return HV;
};
