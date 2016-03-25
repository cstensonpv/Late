// var request = require("request");
var SL = require('sl-api');
var fs = require('fs');
var siteids = require('./siteids');
var ProgressBar = require('progress');

var readingbar = new ProgressBar('reading data: [:bar] :percent', {
  "total": siteids.length,
  "incomplete": ' '
});

var sl = new SL({
  realtimeInformation: "a759eafc14934dd681cb2f542e99330b",
  locationLookup: "fb98d1b0f1f841b2bfe48b43e48f77e4",
  tripPlanner: "4b570251388b4e33afeb139f007952b7"
}, 'json');


// Realtime data
(function() {
	var data = [];
	var totalDelays = [];
  var delaysPerHour = {};
  var timetable = {};
	var currentMinute = 0;
  var lineNames = ['J35', 'J36', 'J37'];
	var lineids = [];

	// Load the data
	// console.log("loading data...");
	for (var i = 0; i < siteids.length; i++) {
		data['id_' + siteids[i]] = JSON.parse(fs.readFileSync('./data/' + siteids[i] + '.json', 'utf8'));
    readingbar.tick();
	}

  for (var i = 0; i < lineNames.length; i++) {
    lineids[lineNames[i]] = JSON.parse(fs.readFileSync('./json/' + lineNames[i] + '.json', 'utf8'));
  }

  // Add ID to all the trains
  var d = [];
  var currentTime;
  var direction;
  for(var i = 0; i < siteids.length; i++) {
    d = data['id_' + siteids[i]];
    if(d !== undefined) {
      var tableTimesNorth = [];
      var tableTimesSouth = [];
      var southID = 0;
      var northID = 0;
      var minData;
      for(var j = 0; j < d.length; j++) {
        minData = d[j].data;
        for (var k = 0; k < minData.length; k++) {
          currentTime = new Date(minData[k].TimeTabledDateTime).getTime();
          direction = minData[k].JourneyDirection;
          // 1 = south, 2 = north
          var indexOfSouth = -1;
          for (var l = 0; l < tableTimesSouth.length; l++) {
            // console.log(l);
            if (tableTimesSouth[l].time === currentTime) {
              indexOfSouth = l;
            }
          }
          var indexOfNorth = -1;
          for (var l = 0; l < tableTimesNorth.length; l++) {
            if (tableTimesNorth[l].time === currentTime) {
              indexOfNorth = l;
            }
          }
          // if currentTime is in the timetable array south and the direction is to the south.
          if (indexOfSouth !== -1 && direction === 1) {
            data['id_' + siteids[i]][j].data[k].id = tableTimesSouth[indexOfSouth].id;
          } else if (direction === 1){
            tableTimesSouth.push({
              "time": currentTime,
              "id": southID
            });
            data['id_' + siteids[i]][j].data[k].id = southID;
            southID++;
          }
          // If it's not in timeTableTimesNorth and the direction is to the north
          else if (indexOfNorth > -1 && direction === 2) {
            data['id_' + siteids[i]][j].data[k].id = tableTimesNorth[indexOfNorth].id;
          } else if (direction === 2) {
            tableTimesNorth.push({
              "time": currentTime,
              "id": northID
            });
            data['id_' + siteids[i]][j].data[k].id = northID;
            northID++;
          }
        }
      }
    }
  }
  // console.log("init data...");
  // Timetable
  for (var i = 0; i < siteids.length; i++) {
    timetable['id_' + siteids[i]] = getTimetable(siteids[i]);
  }
  // Delaydata
  for (var i = 0; i < siteids.length; i++) {
    delaysPerHour['id_' + siteids[i]] = getDelayPerHour(siteids[i]);
  }

	console.log("done.");

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
		return "Error: no data found";
	}

  function getData(minutes, siteid) {
    var d = data['id_' + siteid];
    // console.log(d);
    if (d !== undefined) {
      for (var i = 0; i < d.length; i++) {
        if (d[i].time === minutes) {
          return d[i].data;
        }
      }
    }
    return "Error: no data found";
  }

  function getNextTrainFrom(minutes, siteid) {
    var d = getData(minutes, siteid);
    // var isInLine = [];
    var values = {
      "time": minutes,
      "south": null,
      "north": null
    };

    for (var i = 0; i < d.length; i++) {
      if (d[i].JourneyDirection === 1 && values.south === null) {
        values.south = d[i];
      }
      else if (d[i].JourneyDirection === 2 && values.north === null) {
        values.north = d[i];
      }
    }

    if (values.south === null) {
      values.south = "No train going south";
    }
    if (values.north === null) {
      values.north = "No train going north";
    }

    return values;
  }

  function getTimetable(siteid) {
    var d = data['id_' + siteid];
    var returnVar = {
      "south": [],
      "north": []
    };
    var start = 0;
    var stop = 1440;
    var first = true;
    var day;
    for (var i = 0; i < d.length; i++) {
      for (var j = 0; j < d[i].data.length; j++) {
        var currentDate = new Date(d[i].data[j].TimeTabledDateTime);
        if (first) {
          day = currentDate.getDay();
          first = false;
        }

        var currentTime = currentDate.getUTCHours() * 60 + currentDate.getMinutes();
        var currentDay = currentDate.getDay();
        if (currentDay !== day) {
          currentTime += 24 * 60;
        }
        var currentID = d[i].data[j].id;
        var currentDirection = d[i].data[j].JourneyDirection;
        // 1 = south, 2 = north

        if (currentTime >= start && currentTime <= stop) {
          // Check if the train already is in returnVar
          var newTrain = true;
          if (currentDirection === 1) {
            for (var k = 0; k < returnVar.south.length; k++) {
              if (currentID === returnVar.south[k].id) {
                returnVar.south[k] = d[i].data[j];
                returnVar.south[k].minutes = currentTime;
                newTrain = false;
              }
            }
          } else if (currentDirection === 2) {
            for (var k = 0; k < returnVar.north.length; k++) {
              if (currentID === returnVar.north[k].id) {
                returnVar.north[k] = d[i].data[j];
                returnVar.north[k].minutes = currentTime;
                newTrain = false;
              }
            }
          }

          if (newTrain) {
            if (currentDirection === 1) {
              returnVar.south.push(d[i].data[j]);
              returnVar.south[returnVar.south.length - 1].minutes = currentTime;
            } else if (currentDirection === 2) {
              returnVar.north.push(d[i].data[j]);
              returnVar.north[returnVar.north.length - 1].minutes = currentTime;
            }
          }
        }
      }
    }
    return returnVar;
  }

  function getTimetableBetween(siteid, start, stop) {
    var d = timetable['id_' + siteid];

    var returnVar = {
      "south": [],
      "north": []
    };

    for (var i = 0; i < d.south.length; i++) {
      if (d.south[i].minutes >= start && d.south[i].minutes <= stop) {
        returnVar.south.push(d.south[i]);
      }
    }

    for (var i = 0; i < d.north.length; i++) {
      if (d.north[i].minutes >= start && d.north[i].minutes <= stop) {
        returnVar.north.push(d.north[i]);
      }
    }

    return returnVar;
  }

  function getDelayPerHour(siteid) {
    var d = timetable['id_' + siteid];

    if (d === undefined) {
      return "Error: no data";
    }

    var hours = {
      "south": [],
      "north": []
    };

    // init hours
    for (var i = 0; i < 24; i++) {
      hours.south.push({
        "totalDelay": 0,
        "delayedTrains": 0,
        "totalTrains": 0,
        "hour": i,
        "meanDelay": 0
      });
      hours.north.push({
        "totalDelay": 0,
        "delayedTrains": 0,
        "totalTrains": 0,
        "hour": i,
        "meanDelay": 0
      });
    }
    var currentHour = 0;
    if (d.south !== undefined) {
      for (var i = 0; i < d.south.length; i++) {
        var expectedDate = new Date(d.south[i].ExpectedDateTime);
        var timetableDate = new Date(d.south[i].TimeTabledDateTime);
        var timetableHour = timetableDate.getUTCHours();
        var timetableSeconds = timetableHour * 60 * 60 + timetableDate.getMinutes() * 60 + timetableDate.getSeconds();
        var expectedSeconds = expectedDate.getUTCHours() * 60 * 60 + expectedDate.getMinutes() * 60 + expectedDate.getSeconds();
        var tempDelay = Math.round((expectedSeconds - timetableSeconds) / 60);

        if (tempDelay > 0) {
          hours.south[timetableHour].totalDelay += tempDelay;
          hours.south[timetableHour].delayedTrains++;
          hours.south[timetableHour].totalTrains++;
        } else {
          hours.south[timetableHour].totalTrains++;
        }
      }
    }
    if (d.north !== undefined) {
      for (var i = 0; i < d.north.length; i++) {
        var expectedDate = new Date(d.north[i].ExpectedDateTime);
        var timetableDate = new Date(d.north[i].TimeTabledDateTime);
        var timetableHour = timetableDate.getUTCHours();
        var timetableSeconds = timetableHour * 60 * 60 + timetableDate.getMinutes() * 60 + timetableDate.getSeconds();
        var expectedSeconds = expectedDate.getUTCHours() * 60 * 60 + expectedDate.getMinutes() * 60 + expectedDate.getSeconds();
        var tempDelay = Math.round((expectedSeconds - timetableSeconds) / 60);

        if (tempDelay > 0) {
          hours.north[timetableHour].totalDelay += tempDelay;
          hours.north[timetableHour].delayedTrains++;
          hours.north[timetableHour].totalTrains++;
        } else {
          hours.north[timetableHour].totalTrains++;
        }
      }
    }

    for (var i = 0; i < 24; i++) {
      if (hours.south[i].totalTrains !== 0) {
        hours.south[i].meanDelay = hours.south[i].totalDelay / hours.south[i].totalTrains;
      }
      if (hours.north[i].totalTrains !== 0) {
        hours.north[i].meanDelay = hours.north[i].totalDelay / hours.north[i].totalTrains;
      }
    }

    return hours;
  }

	module.exports.getRealTimeData = function(siteid) {
		return getRealTimeData(siteid);
	};

	module.exports.setCurrentMinute = function(n) {
		currentMinute = n;
	};

  module.exports.getDataFromTime = function(minutes) {
    var d = {};
    for (var i = 0; i < siteids.length; i++) {
      d['id_' + siteids[i]] = getNextTrainFrom(minutes, siteids[i]);
    }
    return d;
  };

  module.exports.getNextTrainFrom = function(siteid) {
    return getNextTrainFrom(currentMinute, siteid);
    // TODO: return for all the directions on y-shaped stations.
  };

  module.exports.getTimetableUntil = function(minutes, siteid) {
    return getTimetableBetween(siteid, 0, minutes);
  };

  module.exports.getTimetableBetween = function(siteid, start, stop) {
    return getTimetableBetween(siteid, start, stop);
  };

  module.exports.getMiscData = function(siteid) {
    return getMiscData(siteid);
  };

  module.exports.getDelayPerHour = function(siteid) {
    return getDelayPerHour(siteid);
  };

  module.exports.getAllDataFor = function(siteid) {
    if (data['id_' + siteid] !== undefined) {
      return data['id_' + siteid];
    } else {
      return {message: "Error, no data found"}
    }
  };

  module.exports.getCurrentDate = function() {
    return {date: new Date()}
  };

  module.exports.getRawTimetable = function(siteid) {
    if (timetable['id_' + siteid] !== undefined) {
      return timetable['id_' + siteid];
    } else {
      return {message: "Error, no data found"}
    }
  };
}());
