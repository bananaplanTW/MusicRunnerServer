var express = require('express'),
    routes = require('../routes'),
    path = require('path'),
    dust_engine = require('dustjs-linkedin'),
    config = require('../config/config'),
    fs = require('fs'),
    template_enging = config['template-engine'],
    cons = require('consolidate');
var logfile = fs.createWriteStream('./musicserver.log', {flags: 'a'});
var checking_update = require('child_process').fork(__dirname + '/../background/checking_update.js');
var app = express();


// all environments
app.set('port', config.port || process.env.PORT || 8080);
app.set('views', __dirname + '/../views');
app.set('view engine', template_enging);

app.engine(template_enging, cons.dust);
app.use(express.favicon());
app.use(express.logger({stream: logfile}));
app.use(express.bodyParser());
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
console.log('server starts');
checking_update.send('ready');
