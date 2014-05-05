
/*
 * GET home page.
 */
var fs = require('fs');
var http = require('http');
var path = require('path');
var parser = require('xml2js');
var parseString = parser.parseString;
var handleUsers = require('../stores/users');
var weatherStore = require('../stores/weather');
var youBikeStore = require('../stores/youbike');

exports.weather = function(req, res){
    var options = {
        hostname : "opendata.cwb.gov.tw",
        path: "opendata/MFC/F-C0032-001.xml"
    };
    var data;
    var request = http.get('http://opendata.cwb.gov.tw/opendata/MFC/F-C0032-001.xml', function (response) {
        console.log(response.statusCode);
        var data_xml = "";
        response.on('data', function (chunk) {
            data_xml += chunk.toString();
        });
        response.on('end', function () {
            parseString(data_xml, function (err, result) {
                res.render('weather', {weatherData:result.fifowml.data[0]});
            });
        });
    });
    request.on('error', function (e) {
        console.log(e);
    });
    request.end();
};

exports.weatherJSON = function(req, res){
    weatherStore.get(req.query.cityCode, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.end();
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'text/json'
        });
        res.write(data);
        res.end();
    });
};

exports.weatherWeekJSON = function(req, res){
    weatherStore.getWeek(req.query.cityCode, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.end();
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'text/json'
        });
        res.write(data);
        res.end();
    });
};

exports.weather24HoursJSON = function(req, res){
    var query = req.query;
    weatherStore.get24Hours(query.cityCode, query.currentHour, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.end();
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'text/json'
        });
        res.write(data);
        res.end();
    });
};

exports.yweather = function (req, res) {
    var options = {
        hostname : "weather.yahooapis.com/forecastrss",
        path: "/forecastrss?w=12703524&u=c"
    };
    var data;
    var request = http.get('http://weather.yahooapis.com/forecastrss?w=12703524&u=c', function (response) {
        console.log(response.statusCode);
        var data_xml = "";
        response.on('data', function (chunk) {
            data_xml += chunk.toString();
        });
        response.on('end', function () {
            parseString(data_xml, function (err, result) {
                var jsonResult = JSON.stringify(result.rss.channel[0]);
                res.render('yweather', {yweatherData:jsonResult});
            });
        });
    });
    request.on('error', function (e) {
        console.log(e);
    });
    request.end();
};

exports.youBike = function (req, res) {
    var data;
    var request = http.get('http://its.taipei.gov.tw/atis_index/data/youbike/youbike.json', function (response) {
        console.log(response.statusCode);
        var data_json = "";
        response.on('data', function (chunk) {
            data_json += chunk.toString();
        });
        response.on('end', function () {
            /*parseString(data_xml, function (err, result) {
                var jsonResult = JSON.stringify(result.rss.channel[0]);
                res.render('yweather', {yweatherData:jsonResult});
            });*/
            data = JSON.parse(data_json);
            res.render('youBike', {youBikeData: data.retVal});
        });
    });
    request.on('error', function (e) {
        console.log(e);
    });
    request.end();
};

exports.youBikeJSON = function (req, res) {
    youBikeStore.get(function (error, data) {
        if (error) {
            res.writeHead(404);
            res.end();
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'text/json'
        });
        res.write(data);
        res.end();
    });
};

exports.landscapeIcon = function (req, res) {
    var data;
    var request = http.get('http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AV&CaseNo2=1&FileType=1&Lang=C', function (response) {
        var data_json = "";
        response.on('data', function (chunk) {
            data_json += chunk.toString();
        });
        response.on('end', function () {
            data = JSON.parse(data_json);
            console.log(data);
            res.render('landscapeIcon', {landscapeIconData: data});
        });
    });
    request.on('error', function (e) {
        console.log(e);
    });
    request.end();
};
