var httprequest = require('./httprequest');
var siteids = require('./siteids');
var fetchInterval = 60000;

siteidCounter = 0;
var cm = -1;
var callsTotal = 0;

var requestData = function() {
	callsTotal += 52;
	cm++;
	console.log("requesting data, minute: " + cm + ", number of calls: " + callsTotal);
	httprequest.setCurrentMinute(cm);
	for (var i = 0; i < siteids.length; i++) {
		(function(iCopy) {
			setTimeout(function() {
				httprequest.requestRealTimeData(siteids[iCopy]);
				// console.log(siteids[i]);
			}, 1000 * iCopy);
		}(i));
	}
};

// httprequest.setCurrentMinute(cm);
requestData();
setInterval(requestData, fetchInterval);