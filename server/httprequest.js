// var request = require("request");
var SL = require('sl-api');
 
var sl = new SL({
  realtimeInformation: "a759eafc14934dd681cb2f542e99330b",
  locationLookup: "fb98d1b0f1f841b2bfe48b43e48f77e4"
}, 'json');


// Realtime data
(function() {
	var data = [];
	var totalDelays = [];

	module.exports.requestRealTimeData = function(siteids) {
		for (var i = 0; i < siteids.length; i++) {
			sl.realtimeInformation({siteid: siteids[i], timewindow: 20}, function(err, results) {
				if(err) {
					console.log("Error: " + err);
				}
				if (results) {
					var d = JSON.parse(results);
					var trains = d.ResponseData.Trains;
					data.push(trains);
					var timetable;
					var expected;
					var delay = 0;
					var siteid = trains[0].SiteId;
					// console.log(trains[0].SiteId);
					if(trains.length > 0) {
						for (var j = 0; j < trains.length; j++) {
							timetable = new Date(trains[j].TimeTabledDateTime);
							expected = new Date(trains[j].ExpectedDateTime);
							var tempDelay = expected.getTime() - timetable.getTime(); 
							if (tempDelay > 0) {
								delay += tempDelay;
							}
						}
						console.log(siteid + " " + delay);
						totalDelays.push({
							siteid: siteid,
							delayMS: delay
						});
					} else {
						console.log(siteid + " has no departues");
					}
				}
			});
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
		for (var i = 0; i < data.length; i++) {
			if (data[i][0].SiteId == siteid) {
				return data[i];
			}
		}
		return "No data found";
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
			// console.log(data.ResponseData);
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


