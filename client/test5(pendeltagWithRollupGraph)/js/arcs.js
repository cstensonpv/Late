var Arcs = function(trains, svg) {
  var arcs = {};
  var minute = 60000;
  var speedMultiplier = 1;
  var timeout;
  // console.log(svg);
  var direction = "north";

  var currentDate = new Date();
  var currentMinute = currentDate.getHours() * 60 + currentDate.getMinutes();

  for (var i = 0; i < trains.nodes.length; i++) {
    var id = trains.nodes[i].id;
    var arc = new Arc(id, x(trains.nodes[i].x) , y(trains.nodes[i].y), svg);
    arc.setSpeedMultiplier(speedMultiplier);
    arcs[id] = arc;
  }

  this.getDelayData = function() {
    $.ajax({
      url: "http://localhost:3000/datafromtime/" + currentMinute,
      dataType: "jsonp",
      success: function(data){
        // console.log(data);
        updateArcs(data);
      },
      error:function(jqXHR,status,error){
        if (jqXHR.status === 0) {
          console.log('Not connect.\n Verify Network.');
        } else if (jqXHR.status == 404) {
          console.log('Requested page not found. [404]');
        } else if (jqXHR.status == 500) {
          console.log('Internal Server Error [500].');
        } else if (exception === 'parsererror') {
          console.log('Requested JSON parse failed.');
        } else if (exception === 'timeout') {
          console.log('Time out error.');
        } else if (exception === 'abort') {
          console.log('Ajax request aborted.');
        } else {
          console.log('Uncaught Error.\n' + jqXHR.responseText);
        }
      }
    });
  }

  function updateArcs(data) {
    // console.log(data);

    for (key in arcs) {
      var arc = arcs[key];
      if (data["id_" + arc.id] !== undefined) {
        var d = data["id_" + arc.id][direction];
        if (d !== "No train going " + direction) {
          var expectedDate = new Date(d.ExpectedDateTime);
          var expectedMinute = expectedDate.getUTCHours() * 60 + expectedDate.getMinutes();
          var minutes = expectedMinute - currentMinute;
          if (minutes < 0) {
            minutes = 0;
          }
          arc.setTime(minutes);
        } else {
          arc.setTime("nan");
        }
      }
      // arc.setTime(data[]
    }
  }

  this.setSpeedMultiplier = function(sm) {
    speedMultiplier = sm;
    for (key in arcs) {
      arcs[key].setSpeedMultiplier(speedMultiplier);
    }
    this.getDelayData();
  };

  this.setDirection = function(dir) {
    direction = dir;
    for (key in arcs) {
      arcs[key].setDirection(dir);
    }
    this.getDelayData();
  };

  this.setCurrentMinute = function(cm) {
    currentMinute = cm;
  };
}
