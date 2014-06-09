var api = require("../lib/call_api.js");
var ModelDailyWeather = require("../model/weather").ModelDailyWeather;

var ModuleGetRawWeather = function (_url, _cacheFilePath) {
    var url = _url,
        cacheFilePath = _cacheFilePath;

    return {
        getRawContent: function (error, model) {
        	// if cache has the file
        	try {
        		var cacheFile = require(_cacheFilePath);
        		model.setData(null, cacheFile, true);
        	} catch(e) { // cache doesn't have the file
        		api.getHttpResponse(url, model.setData);
        	}
        }
    }
};


var ModuleGetDailyWeather = function (_cityCode) {
	var url = "http://opendata.cwb.gov.tw/opendata/MFC/F-C0032-001.xml",
		cacheFilePath = "../.cache/weather36hours.json",
		cityCode = _cityCode;
	var moduleGetRawWeather = ModuleGetRawWeather(url, cacheFilePath);
	var modelDailyWeather = Object.create(ModelDailyWeather);

	return {
		getJsonContent: function (callback) {
			moduleGetRawWeather.getRawContent(error, ModelDailyWeather);
		}
	}
}

