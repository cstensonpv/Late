// var http = require('http');
var express = require('express');
var httprequest = require('./httprequest');
var app = express();

var fetchInterval = 60000;
var currentDate = new Date();

// ];
app.get('/test', function(req, res) {
	res.send("Hello");
});

app.get('/realtimedata/:siteid', function(req, res) {
	res.jsonp(httprequest.getRealTimeData(req.params.siteid));
});

app.get('/realtime/next/:siteid', function(req, res) {
	res.jsonp(httprequest.getNextTrainFrom(req.params.siteid));
});

app.get('/locationdata', function(req, res) {
	res.jsonp(httprequest.getLocationData(res.query.siteid));
});

app.get('/delaydata', function(req, res) {
	if (req.query.siteid) {
		res.jsonp(httprequest.getDelayDataSiteid(req.query.siteid));
	} else {
		res.jsonp(httprequest.getDelayData());
	}
});

app.get('/delaydatafrom', function(req, res) {
	if (req.query.siteid) {
		res.jsonp(httprequest.getDelaysFrom(req.query.siteid));
	} else {
		res.jsonp("No siteid");
	}
});

var cm = -1;
var hours = currentDate.getHours();
var minutes = currentDate.getMinutes();
cm = hours * 60 + minutes - 1;

var setMinute = function() {
	cm++;
	if (cm >= 1440) {
		cm = 0;
	}
	// console.log("Current minute: " + cm);
	httprequest.setCurrentMinute(cm);
};

setMinute();
setInterval(setMinute, fetchInterval);

var server = app.listen(3000);
console.log("Server is now listening on port 3000");
