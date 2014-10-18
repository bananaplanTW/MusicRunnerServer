var express = require('express'),
    routes = require('../routes'),
    path = require('path'),
    fs = require('fs'),
    dust_engine = require('dustjs-linkedin'),
    config = require('../config/config'),
    template_engine = config['template-engine'],
    cons = require('consolidate'),
    logger = require('../lib/logger'),
    bodyParser = require('body-parser'),
    httpLogFile;
//var checking_update = require('child_process').fork(__dirname + '/../background/checking_update.js');
var app = express();

logger.createLogsDir(function (error, status) {
    if (error) {
        console.error("[server/server.js]: cannot create httplogs file");
        throw error;
        return;
    }
    httpLogFile = fs.createWriteStream('./logs/http.log', {flags: 'a'});
});

// all environments
app.set('port', config.port || process.env.PORT || 8080);
app.set('views', __dirname + '/../views');
app.set('view engine', template_engine);

app.engine(template_engine, cons.dust);
app.use(express.favicon());
app.use(express.logger({stream: httpLogFile}));
//app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

config.routes.forEach(function (route) {
	var method = route.method;
	route.settings.forEach(function (setting) {
		app[method](setting.path, routes[setting.value]);
	});
});
app.listen(8080);
console.log('[server/server.js]: server starts with port=' + app.get('port'));
//checking_update.send('ready');
