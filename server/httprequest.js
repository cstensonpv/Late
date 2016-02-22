var request = require("request");

(function() {
	var data;

	module.exports.requestRealTimeData = function() {
		request({
			uri: "http://api.sl.se/api2/realtimedepartures.json?key=a759eafc14934dd681cb2f542e99330b&siteid=9192&timewindow=5",
			method: "GET",
			timeout: 5000,
			followRedirect: true,
			maxRedirects: 10
		}, function(error, response, body) {
			data = body;
			console.log("realtimedata updated");
		});
	};

	module.exports.getRealTimeData = function() {
		return data;
	};
}());


