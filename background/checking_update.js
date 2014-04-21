var fs = require('fs'),
	timer = require('timer').timer,
	api = require('../lib/call_api');
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var FIVE_MINUTES = 5 * MINUTE;
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
	}
});