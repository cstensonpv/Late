var Arc = function(_id, _cx, _cy, _svg) {
  // var currentStation = siteid;
  var id = _id;
  var direction = "north";
  var speed = 60000;
  var svg = _svg;
  var cx = _cx;
  var cy = _cy;

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

  var radius = 20;

  var arc = d3.svg.arc()
    .outerRadius(radius * 1)
    .innerRadius(radius * 0);

  svg.append("g")
    .attr("class", "slices")
    .attr("id", id)
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

  changeCircle(speed);

  function changeCircle(s) {
    /* ------- PIE SLICES -------*/
    var slice = svg.select("#" + id).selectAll("path.slice")
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
    changeCircle(speed);
  };

  this.setTime = function(newTime) {
    var ratio1 = (10 - newTime) / 10;
    var ratio2 = 1 - ratio1;
    console.log(ratio1, ratio2);
    slices[0].value = ratio1;
    slices[1].value = ratio2;
    changeCircle(50);
    setTimeout(this.start, 50);
  }

  this.setSpeed = function(newSpeed) {
    speed = newSpeed;
  }
}

var svg = d3.select("body")
  .append("svg")
  .attr("width", "500")
  .attr("height", "500")
  .style("background", "#f0f0f0");

var siteid = 9000;
var cx = 250;
var cy = 250;

var arc = new Arc("id_9000", cx, cy, svg);
var arc2 = new Arc("id_2000", cx + 100, cy + 100, svg);

$("#button-start").click(function() {
  arc.start();
  arc2.start();
});

$("#button-set").click(function() {
  arc.setTime(6);
  arc2.setTime(4);
});

$("#button-show").click(function() {
  arc.show();
});

$("#button-hide").click(function() {
  arc.hide();
});
