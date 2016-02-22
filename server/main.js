var http = require('http');
var express = require('express');
var httprequest = require('./httprequest');
var app = express();

var fetchInterval = 10000;

app.get('/realtimedata', function(req, res) {
	res.send(httprequest.getRealTimeData());
});

httprequest.requestRealTimeData();

/////////////////// Uncomment when ready /////////////////
// setInterval(function() {
// 	httprequest.requestRealTimeData();
// }, fetchInterval);

var server = app.listen(8081);