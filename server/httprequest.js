// var request = require("request");
var SL = require('sl-api');
var fs = require('fs');
var siteids = require('./siteids');
 
var sl = new SL({
  realtimeInformation: "a759eafc14934dd681cb2f542e99330b",
  locationLookup: "fb98d1b0f1f841b2bfe48b43e48f77e4",
  tripPlanner: "4b570251388b4e33afeb139f007952b7"
}, 'json');


// Realtime data
(function() {
	var data = [];
	var totalDelays = [];
	var currentMinute = 0;
	var lineids = [];

	// Load the data
	console.log("loading data...");
	for (var i = 0; i < siteids.length; i++) {
		data['id_' + siteids[i]] = JSON.parse(fs.readFileSync('./data/' + siteids[i] + '.json', 'utf8'));
	}
	lineids['J35'] = JSON.parse(fs.readFileSync('./json/J35.json', 'utf8'));
	console.log("done.");

	function addRealtimeData(d) {
		for (var i = 0; i < data.length; i++) {
			if (data[i][0].SiteId == d[0].SiteId) {
				console.log("Same station " + data[i][0].SiteId + " " + d[0].SiteId);
				data[i] = d;
				return;
			}
		}
		data.push(d);
	}

	function addDelayData(d) {
		for (var i = 0; i < totalDelays.length; i++) {
			if (totalDelays[i].siteid == d.siteid) {
				totalDelays[i] = d;
				return;
			}
		}
		totalDelays.push(d);
	}

	function getRealTimeData(siteid) {
		var d = data['id_' + siteid];
		if (d !== undefined) {
			for (var i = 0; i < d.length; i++) {
				if (d[i].time === currentMinute) {
					return d[i].data;
				}
			}
		}
		return "No data found";
	}

	module.exports.requestRealTimeData = function(siteid) {
	};

	module.exports.getDelaysFrom = function(siteid) {
		var d = getRealTimeData(siteid);
		var lineNumbers = ["35", "36", "37"];
		var lines = [];

		for (var i = 0; i < lineNumbers.length; i++) {
			lines['J' + lineNumbers[i]] = [];
		}

		for (var i = 0; i < d.length; i++) {
			if (lineNumbers.indexOf(d[i].LineNumber) > -1) {
				lines['J' + d[i].LineNumber].push(d[i]);
			}
		}

		for (var i = 0; i < lineNumbers.length; i++) {

		}
	};

	module.exports.getDelayDataSiteid = function(siteid) {
		for (var i = 0; i < totalDelays.length; i++) {
			if (totalDelays[i].siteid == siteid) {
				return totalDelays[i];
			}
		}
		return "No data found";
	};

	module.exports.getDelayData = function() {
		console.log(totalDelays);
		return totalDelays;
	};

	module.exports.getRealTimeData = function(siteid) {
		return getRealTimeData(siteid);
	};

	module.exports.setCurrentMinute = function(n) {
		currentMinute = n;
	};
}());

// Location data
(function() {
	var siteid;

	module.exports.requestLocationData = function(search) {
		console.log(search);
		sl.locationLookup({searchstring: search})
		.then(function(data) {
			data = JSON.parse(data);
			console.log(data.ResponseData);
			siteid = data.ResponseData[0].SiteId;
			console.log("location data updated");
			// console.log(siteid);
		})
		.fail(console.error)
		.done();
	};

	module.exports.getLocationData = function() {
		return siteid;
	};
}());

(function() {
	module.exports.requestTrip = function(originId, destId) {
		sl.tripPlanner.trip({originId: originId, destId: destId}, function(err, results) {
			console.log(results);
		});
	};
}());




