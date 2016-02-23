// var http = require('http');
var express = require('express');
var httprequest = require('./httprequest');
var app = express();

var fetchInterval = 4000;

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
	// 9509, // Solna
	// 9508, // Ulriksdal
	// 9507, // Helenelund
	// 9506, // Sollentuna
	// 9505, // häggvik
	// 9504, // Norrviken
	// 9503, // Rotebro
	// 9502, // Upplands väsby
	// 9501, // Rosersberg
	// 9500, // Märsta
	// 9511, // Arlanda
	// 6086, // Uppsala
];

app.get('/test', function(req, res) {
	res.send("Hello");
});

app.get('/realtimedata', function(req, res) {
	if (req.query.siteid) {
		res.json(httprequest.getRealTimeData(req.query.siteid));
	} else {
		res.json("No siteid");
	}
});

app.get('/locationdata', function(req, res) {
	res.send(httprequest.getLocationData(res.query.siteid));
});

app.get('/delaydata', function(req, res) {
	if (req.query.siteid) {
		res.json(httprequest.getDelayDataSiteid(req.query.siteid));
	} else {
		res.json(httprequest.getDelayData());
	}
});

// httprequest.requestLocationData("uppsala");

///////////////////// Test purposes /////////////////////
// Fetch the data only once.
for (var i = 0; i < siteids.length; i++) {
	httprequest.requestRealTimeData(siteids[i]);
}

/////////////////// Uncomment when ready /////////////////
// siteidCounter = 0;
// setInterval(function() {
// 	console.log(siteids[siteidCounter]);
// 	httprequest.requestRealTimeData(siteids[siteidCounter]);
// 	siteidCounter++;
// 	if (siteidCounter >= siteids.length) {
// 		siteidCounter = 0;
// 	}
// }, fetchInterval);

var server = app.listen(3000);