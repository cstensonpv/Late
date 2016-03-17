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

  function getDelayData() {
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
          var timeTableDate = new Date(d.TimeTabledDateTime);

          var expectedMinute = expectedDate.getUTCHours() * 60 + expectedDate.getMinutes();
          var timeTabledMinute = timeTableDate.getUTCHours() * 60 + timeTableDate.getMinutes();

          var minutes = expectedMinute - currentMinute;
          if (minutes < 0) {
            minutes = 0;
          }
          if (d.SiteId === 9727) {
            console.log("Krigslida: " + minutes);
          }
          arc.setTime(minutes);

          var calculatedDelay = Math.abs(timeTabledMinute - expectedMinute)
          if(calculatedDelay != 0)// there is a delay
            arc.setColorOfArc("rgb(195,67,43)");
          else //no delay
            arc.setColorOfArc("rgb(109,187,86)");
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
    clearTimeout(timeout);
    interval();
  }

  this.setDirection = function(dir) {
    direction = dir;
    clearTimeout(timeout);
    interval();
  }

  interval();
  function interval() {
    getDelayData();
    currentMinute++;
    timeout = setTimeout(interval, minute * speedMultiplier);
  }
}
