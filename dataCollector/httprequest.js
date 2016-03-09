// var request = require("request");
var SL = require('sl-api');
var fs = require('fs');
 
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

	module.exports.requestRealTimeData = function(siteid) {
		sl.realtimeInformation({siteid: siteid, timewindow: 20}, function(err, results) {
			if(err) {
				console.log("Error: " + err);
			} else {
				try {
					saveData(JSON.parse(results));
				} catch (e) {
					console.log("Error saving data: " + e);
					console.log("Result: " + results);
				}
			}
		});
	};

	module.exports.setCurrentMinute = function(n) {
		currentMinute = n;
	};

	var saveData = function(data) {
		if (data.ResponseData.Trains[0] != undefined) {
			var dataString = "{\"data\": " + JSON.stringify(data.ResponseData.Trains) + ", \"time\": " + currentMinute + "},\n";
			var siteid = data.ResponseData.Trains[0].SiteId;
			fs.appendFile("./data/" + siteid + ".json", dataString, 'utf8', function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	};
}());