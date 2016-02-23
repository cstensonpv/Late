var http = require('http');
var express = require('express');
var httprequest = require('./httprequest');
var app = express();

var fetchInterval = 10000;

// var siteids = [
// 	// Stockholm C
// 	{
// 		siteid: 9000,
// 		connectedStations: [
// 			9510
// 		]
// 	},
// 	// Karlberg C
// 	{
// 		siteid: 9510,
// 		connectedStations: [
// 			9000,
// 			9509
// 		]
// 	},
// 	// Solna C
// 	{
// 		siteid: 9509,
// 		connectedStations: [
// 			9000,
// 			9509
// 		]
// 	},

// ];

var siteids = [
	9000, // Stockholm C
	9510, // Karlberg
	9509, // Solna
	9508, // Ulriksdal
	9507, // Helenelund
	9506, // Sollentuna
	9505, // häggvik
	9504, // Norrviken
	9503, // Rotebro
];



// var train = {
// 	lastStation: 9000,
// 	nextStation: 9510,
// 	leftMinAgo: 2,
// 	arriveMin: 3
// };

app.get('/test', function(req, res) {
	res.send("Hello");
});

app.get('/realtimedata', function(req, res) {
	if (req.query.siteid) {
		res.sendStatus(httprequest.getRealTimeData(req.query.siteid));
	} else {
		res.sendStatus("No siteid");
	}
});

app.get('/locationdata', function(req, res) {
	res.sendStatus(httprequest.getLocationData(res.query.siteid));
});

app.get('/delaydata', function(req, res) {
	if (req.query.siteid) {
		res.sendStatus(httprequest.getDelayData(req.query.siteid));
	} else {
		res.sendStatus("No siteid");
	}
});

httprequest.requestRealTimeData(siteids);
// httprequest.requestLocationData("Rotebro");

/////////////////// Uncomment when ready /////////////////
// setInterval(function() {
// 	httprequest.requestRealTimeData();
// }, fetchInterval);

var server = app.listen(8081);