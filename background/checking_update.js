var fs = require('fs'),
	timer = require('timer').timer,
	api = require('../lib/call_api'),
	parser = require('xml2js'),
	parseString = parser.parseString;
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var FIVE_MINUTES = 5 * MINUTE;
var ONE_HOUR = 60 * MINUTE;
process.on('message', function (message) {
	if (message === 'ready') {
		console.log('server starts to update youbike status in every 5 minutes');
		timer.auto(FIVE_MINUTES, function(){
			var url = 'http://its.taipei.gov.tw/atis_index/data/youbike/youbike.json';
		    var parseData = function (error, data) {
		        if (error) {
		            console.log(error);
		            return;
		        }
		        var result = JSON.parse(data);
		        var youbike = fs.createWriteStream(__dirname + '/../.cache/youbike.json');
		        youbike.write(JSON.stringify(result.retVal));
		        youbike.close();
		        console.log('server updated youbike data');
		    };
		    api.getHttpResponse(url, parseData);
		});
		console.log('server starts to update weather status in every hour');
		timer.auto(ONE_HOUR, function(){
			var url = 'http://opendata.cwb.gov.tw/opendata/MFC/F-C0032-001.xml';
		    var parseData = function (error, data) {
		        if (error) {
		            console.log(error);
		            return;
		        }
		        parseString(data, function (error, result) {
		        	var weather36hours = fs.createWriteStream(__dirname + '/../.cache/weather36hours.json');
		        	weather36hours.write(JSON.stringify(result.fifowml.data[0].location));
		        	weather36hours.close();
		        	console.log('server updated weather36hour data');
		        });
		    };
		    api.getHttpResponse(url, parseData);
		});
		console.log('server starts to update UV status in every 6 hours');
		timer.auto(6 * ONE_HOUR, function(){
			var url = 'http://opendata.cwb.gov.tw/opendata/DIV2/O-A0005-001.xml';
		    var parseData = function (error, data) {
		        if (error) {
		            console.log(error);
		            return;
		        }
		        parseString(data, function (error, result) {
		        	var uv = fs.createWriteStream(__dirname + '/../.cache/uv.json');
		        	uv.write(JSON.stringify(result.cwbopendata.dataset[0].weatherElement[0].location));
		        	uv.close();
		        	console.log('server updated UV data');
		        });
		    };
		    api.getHttpResponse(url, parseData);
		});
		console.log('server starts to update weekly weather status in every hour');
		timer.auto(ONE_HOUR, function(){
			var url = 'http://opendata.cwb.gov.tw/opendata/MFC/F-C0032-005.xml';
		    var parseData = function (error, data) {
		        if (error) {
		            console.log(error);
		            return;
		        }
		        parseString(data, function (error, result) {
		        	var weekWeather = fs.createWriteStream(__dirname + '/../.cache/weekWeather.json');
		        	weekWeather.write(JSON.stringify(result.fifowml.data[0].location));
		        	weekWeather.close();
		        	console.log('server updated weekWeather data');
		        });
		    };
		    api.getHttpResponse(url, parseData);
		});
	}
});