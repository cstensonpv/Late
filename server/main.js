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

app.get('/datafromtime/:minutes', function(req, res) {
	res.jsonp(httprequest.getDataFromTime(parseInt(req.params.minutes)));
});

app.get('/realtime/next/:siteid', function(req, res) {
	res.jsonp(httprequest.getNextTrainFrom(req.params.siteid));
});

app.get('/timetable/until/:siteid/:minutes', function(req, res) {
	res.jsonp(httprequest.getTimetableUntil(req.params.minutes, req.params.siteid));
});

app.get('/timetable/between/:siteid/:start/:stop', function(req, res) {
	res.jsonp(httprequest.getTimetableBetween(req.params.siteid, req.params.start, req.params.stop));
});

app.get('/miscdata/:siteid', function(req, res) {
	res.jsonp(httprequest.getMiscData(req.params.siteid));
});

app.get('/delayperhour/:siteid', function(req, res) {
	res.jsonp(httprequest.getDelayPerHour(req.params.siteid));
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
