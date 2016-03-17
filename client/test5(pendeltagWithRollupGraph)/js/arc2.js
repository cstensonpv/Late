var Arc = function(_id, _cx, _cy, _svg) {
  // var currentStation = siteid;
  this.id = _id;
  var direction = "north";
  var totalMinutes = 1;
  var minute = 60000;
  var svg = _svg;
  var cx = _cx;
  var cy = _cy;
  var minutesLeft = 10;

  var currentDate = new Date();
  var currentMillis = currentDate.getTime();

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      // console.log(d);
      return d.value;
    });

  var color = d3.scale.linear()
    .domain([0, 4])
    .range(["#f5c959", "#c74f2f"]);

  var radius = 12;

  var arc = d3.svg.arc()
    .outerRadius(radius * 1)
    .innerRadius(radius * 0);

  var slicesId = "slices_" + this.id;
  var textId = "minutesLeft_" + this.id;
  var backgroundId = "background_" + this.id;

  var svgGroup = svg.append("g")
    .attr("class", "slices")
    .attr("id", slicesId)
    .attr("transform", "translate(" + cx + "," + cy + ")");


  var slices = [{
    "mean": 0,
    "value": 0.4,
    "id": 0
  },
  {
    "mean": 4,
    "value": 0.6,
    "id": 1
  }];

  // changeCircle();

  function changeCircle(s) {
    /* ------- PIE SLICES ------- */
    var slice = svgGroup.selectAll("path.slice")
      .data(pie(slices));

    slice.transition();

    slice.enter()
      .insert("path")
      .style("fill", function(d) {
        if (d.data.id === 0) {
          return "#3b8de3";
        } else {
          return "#c9c7c7"
        }
      })
      .style('stroke', 'white')
      .style('stroke-width', '1')
      .attr("class", "slice");

    slice
      .transition().duration(s).ease("linear")
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

  this.setSiteID = function(id){
    currentStation = id;
  };

  this.setDirection = function(dir) {
    direction = dir;
  };

  this.start = function() {
    slices[0].value = 1;
    slices[1].value = 0;
    changeCircle(minute * minutesLeft * speedMultiplier);
  };

  this.setTime = function(newTime) {
    // console.log(newTime);
    if (newTime === "nan") {
      newTime = 20;
    }
    else if (newTime > 10) {
      svgGroup.selectAll("#" + textId).remove();
      svgGroup.append("text")
        .attr("id", textId)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-family", "Helvetica, Arial, sans-serif")
        .attr("font-size", "8px")
        .attr("fill", "#2d2d2d")
        .text(newTime);
    } else {
      svgGroup.selectAll("#" + textId).remove();
    }
    minutesLeft = newTime;
    var ratio1 = (10 - newTime) / 10;
    var ratio2 = 1 - ratio1;
    slices[0].value = ratio1;
    slices[1].value = ratio2;
    changeCircle(50);
    setTimeout(this.start, 50);
  }

  this.setSpeedMultiplier = function(sm) {
    speedMultiplier = sm;
  }
}
