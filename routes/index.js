
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

var db = require("../models/connectDB");
db.execute("SELECT * FROM account_info;", function (rows, error) {
                if (error) {
                        console.log(error);
                        return;
                }
                console.log(rows);
        });

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

exports.store = function (req, res) {
    console.log(req);
    res.write("get it");
    res.end();
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
    if(req.method == 'POST'){
        console.log('Post coming...');
        console.log('url : ' + req.body.userAccount);
        var insertValue = {};
        insertValue.account = req.body.userAccount;
        insertValue.password = req.body.password;
        //console.log(insertValue);
        db.execute("INSERT INTO account_info VALUES ('"+ req.body.userAccount + "','" + req.body.password + "')", function (error,result) {
            console.log('performing db insertion');
            if (error) {
                console.log(error);
                return;
            }
            console.log(result);
        });
        var qs = require('querystring');
        var body = '';
        req.on('data',function(chunk){
            console.log('here...');
            body += chunk;
            console.log(body);
        });
        req.on('end', function () {
            console.log('end here...');
            console.log(qs.parse(body));
        });
    }
    if(req.method == 'GET'){
        console.log('GET coming');
    }
    var data;
    console.log("retrieving landscape icon");
        var request = http.get('http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AV&CaseNo2=1&FileType=1&Lang=C&FolderType=', function (response) {
        var data_json = "";
        response.on('data', function (chunk) {
            data_json += chunk.toString();
        });

        response.on('end', function () {
            parseString(data_json, function (err, result) {
                console.log("rending data...");
                jsonObj = JSON.parse(result.html.body[0].form[0].div[0].span[0]._);
                console.log(jsonObj[0].Name);
                res.render('landscapeIcon', {landscapeIconData:jsonObj});
            });            
        });
    });
    request.on('error', function (e) {
        console.log(e);
    });
    request.end();
};

