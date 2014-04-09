
/**
 * Module dependencies.
 */

//require('./db');

var express = require('express'),
    routes = require('./routes'),
    path = require('path'),
    dust_engine = require('dustjs-linkedin'),
    template_enging = 'dust',
    cons = require('consolidate');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', template_enging);

app.engine(template_enging, cons.dust);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/weather', routes.weather);
app.get('/weatherJSON', routes.weatherJSON);
app.get('/yweather', routes.yweather);
app.get('/youBike', routes.youBike);
app.get('/landscapeIcon', routes.landscapeIcon);

app.listen(3000);
