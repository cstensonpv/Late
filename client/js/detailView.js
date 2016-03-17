var DetailView = function(siteid, dir) {
  var currentStation = siteid;
  var direction = dir;

  var currentDate = new Date();
  var currentHour = currentDate.getHours();
  var currentTime = currentDate.getHours()*60+currentDate.getMinutes();

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      // console.log(d);
      return d.value;
    });

  var color = d3.scale.linear()
    .domain([0, 4])
    .range(["#f5c959", "#c74f2f"]);

  function getDelayTime (id) {
    var url = "http://localhost:3000/timetable/until/"+id+"/"+ currentTime;//minutesToTime(currentMinute);//currentTime; //instead of until you can use between to get between 2 times
    $.ajax({
      type: "GET",
      dataType: 'jsonp',
      cache: false,
      url: url,
      success: function (data) {
        var actualTime = (new Date().getHours()*60*60) + (new Date().getHours()*60) + (new Date().getHours());
        drawData(data);
      }
    });
  }
  // getDelayTime(currentStation);

  function getAllTime (id) {
    var url = "http://localhost:3000/timetable/until/"+id+"/"+ 24*60;//minutesToTime(currentMinute);//currentTime; //instead of until you can use between to get between 2 times
    $.ajax({
      type: "GET",
      dataType: 'jsonp',
      cache: false,
      url: url,
      success: function (data) {
        // console.log(data)
        // drawAll(data);
      }
    });
  }
  // getAllTime(currentStation);


  var widthPercent = 100;
  var heightPercent = 100;

  var width = window.innerWidth * widthPercent/100;
  var height = window.innerHeight * heightPercent/100;
  console.log("w: " + innerWidth + " h: " + innerHeight)
  var cx = width/2;
  var cy = height/2;
  var radius = height/Math.PI;

  var svg = d3.select("body")
  	.append("svg")
  	.attr("width", width)
  	.attr("height", height)
  	.style("background", "#f0f0f0")

  resetSvg();

  var arc = d3.svg.arc()
    .outerRadius(radius * 1)
    .innerRadius(radius * 0.6);

  function dateToMins(expected, table){
    var diffMinutes = parseInt(expected.substring(14,16))-parseInt(table.substring(14,16))
    var diffHours = parseInt(expected.substring(11,13))-parseInt(table.substring(11,13))
    var diff = diffHours*60+diffMinutes;
    return diff;
  }

  function resetSvg() {
    svg.html("");
    svg.append("g")
      .attr("class", "slices")
      .attr("transform", "translate(" + cx + "," + cy + ")");

    svg.append("g")
      .attr("class", "tooltip")
      .attr("transform", "translate(" + cx + "," + cy + ")");

    svg.append("g")
      .attr("class", "detail-title")
      .attr("transform", "translate(" + cx + ", 10)")

  }

  function updateCircleData (siteid){
    var url = "http://localhost:3000/delayperhour/" + siteid;
    $.ajax({
      type: "GET",
      dataType: 'jsonp',
      cache: false,
      url: url,
      success: function (data) {
        var slices = [];
        for (var i = 0; i < 24; i++) {
          var slice = {
            "mean": data[direction][i].meanDelay,
            "value": 1,
            "id": i,
            "zoom": false,
            "zoomable": (currentHour > i)
          };
          slices.push(slice);
        }
        changeCircle(slices);
      }
    });
  }
  updateCircleData(currentStation);

  function changeCircle(data) {

    /* ------- PIE SLICES -------*/
    var slice = svg.select(".slices").selectAll("path.slice")
      .data(pie(data));
      if(data[0].value === 1 && data[1].value === 1){
      }
      else{
          for(var i = 0; i < 24; i++){
            if(data[i].value === 1){
              var selectedHour = i;
            }
          }

        }

    d3.select("g.tooltip").html("");

    if(selectedHour){
      d3.selectAll(".trainz")
        .transition()
        .ease("linear")
        .duration(1000)
        .attr("transform", function(d) {
          hour = parseInt(d["ExpectedDateTime"].substring(11,13));
          minute = parseInt(d["ExpectedDateTime"].substring(14,16));
          if(hour == selectedHour){
            var angleDiff = minute/60*360 - (hour*60 + minute) / (24*60) * 360;
            console.log("anglediff: " + angleDiff)
            console.log("cx: " + cx + " cy: " + cy)
            console.log(data.zoom)
            return "rotate(" + angleDiff + " " + cx + " " + cy + ")"; }

          else{
             d3.select(this).style("opacity", 0)
            return "rotate(" + 0 + " " + cx + " " + cy + ")";}
          })
    }
    else if(selectedHour == null){
      d3.selectAll(".trainz").remove()
      getDelayTime(currentStation);
    }

    slice.enter()
      .insert("path")
      .style("fill", function(d) {
        if (currentHour <= d.data.id) {
          return "#dadada";
        } else {
          if (d.data.mean === 0) {
            return "#6dbb56";
          } else {
            return color(d.data.mean);
          }
        }
      })
      .style('stroke', 'white')
      .style('stroke-width', '1')
      .attr("class", "slice")
      .on('click', function(d) {
        if (d.data.zoomable) {
          if (d.data.zoom) {
            d.data.zoom = false;
            selectedHour = null;
            for (var i = 0; i < 24; i++) {
              data[i].value = 1;
            }
          } else {
            d.data.zoom = true;
            for (var i = 0; i < 24; i++) {
              if (data[i].id === d.data.id) {
                data[i].value = 1;
              } else {
                data[i].value = 0;
              }
            }
          }
          changeCircle(data);
        }
      });

    slice
      .transition().duration(6000).ease("linear")
      .attrTween("d", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        };
      })

    slice.exit()
      .remove();

  }


  function drawData(data){
    d3.select("g.detail-title")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "before-edge")
      .text("Trains going " + direction + " from " + data[direction][0].StopAreaName)
      .attr("font-family", "Helvetica, Arial, sans-serif")
      .attr("font-size", "30px")
      .attr("font-weight", "bold")
      .attr("fill", "#292929");

    var lines = svg.selectAll("g")
  		.data(data[direction])
  	.enter().append("g").attr("class", "trainz")
  		.append("line")
  		.attr("x1", cx)
  		.attr("x2", cx)
  		.attr("y1", (cy - radius))
    	.attr("y2", (cy - radius))
    	.style("stroke-width","2px")
      // .style("stroke", "green")
    	.attr("transform", function(d) {
  			hour = parseInt(d["ExpectedDateTime"].substring(11,13));
  			minute = parseInt(d["ExpectedDateTime"].substring(14,16));
        return "rotate(" + (hour * 60 + minute) / (24 * 60) * 360 + " " + cx + " " + cy + ")";
      });

    lines.transition().ease("elastic").duration(1000).delay(function(d,i) {
        return (i-25)*10;
      })
      .attr("y2", function(d){
        return (cy - radius - (dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"]))*8);
      });

    svg.selectAll(".trainz").append("circle")
  		.attr("class", "blob")
  		.attr("cx", cx)
  		.attr("cy", cy-radius)
  		.attr("r", 5)
      // .style("fill", "green")
      .style("opacity",0)
  		.attr("transform", function(d){
  			hour = parseInt(d["ExpectedDateTime"].substring(11,13));
  			minute = parseInt(d["ExpectedDateTime"].substring(14,16));
  			return "rotate(" + (hour * 60 + minute) / (24 * 60) * 360 + " " + cx + " " + cy + ")";
      });

    d3.selectAll(".blob").transition().ease("elastic").duration(1000).delay(function(d,i) {
        return (i-25)*10;
      })
      .attr("cy", function(d){
        return (cy - radius - (dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"]))*8);
      })
      .style("opacity",1);





    var trainz = svg.selectAll(".trainz")

    trainz
      .style("fill", "green")
      .style("stroke", "green");

    var side = Math.sqrt(Math.pow((radius*2),2)/2);

    trainz
        .on("click", function(d){
            trainz
              .style("fill", "green")
              .style("stroke", "green")

            d3.select(this)
              .style("fill", "orange")
              .style("stroke", "orange");

            var arrivalDate = new Date(d["ExpectedDateTime"]);
            var arrivalString = ('0' + arrivalDate.getHours()).slice(-2) + ":" + ('0' + arrivalDate.getMinutes()).slice(-2);
            var delay = dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"]);
            var tooltip = d3.select("g.tooltip");

            tooltip.html("");

            tooltip
              .append("text")
              .attr("class", "tooltip-title")
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "middle")
              .attr("y", -30)
              .text(d["Destination"])
              .attr("font-family", "Helvetica, Arial, sans-serif")
              .attr("font-size", "14px")
              .attr("fill", "#575757");

            tooltip
              .append("text")
              .attr("class", "tooltip-time")
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "middle")
              .text(arrivalString)
              .attr("font-family", "Helvetica, Arial, sans-serif")
              .attr("font-size", "20px")
              .attr("fill", "#161616");

            tooltip
              .append("text")
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "middle")
              .attr("y", 30)
              .text("[ " + delay + " min late ]")
              .attr("font-family", "Helvetica, Arial, sans-serif")
              .attr("font-size", "14px")
              .attr("fill", "#8a3636");
          });


  }

  function stareIntoTheAbyss(data){

  }

  this.setSiteID = function(id){
    currentStation = id;
  }

  this.setDirection = function(dir) {
    direction = dir;
  }

  this.reset = function(id, dir) {
    currentStation = id;
    direction = dir;
    resetSvg();
    updateCircleData(currentStation);
  }

  this.hide = function() {
    svg.html("");
  }

  this.show = function() {
    resetSvg();
    updateCircleData(currentStation);
  }
}

var siteid = 9000;
var detailView = new DetailView(siteid, "north");

$("#button-north").click(function() {
  detailView.reset(siteid, "north");
});

$("#button-south").click(function() {
  detailView.reset(siteid, "south");
});

$("#button-show").click(function() {
  detailView.show();
});

$("#button-hide").click(function() {
  detailView.hide();
});
