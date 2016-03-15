var Arc = function(id, cxArc, cyArc, name){
  var _this = this;
  this.name = name;
  this.id = id;
  this.cxArc = cxArc;
  this.cyArc = cyArc;
  console.log("created new arc"); 
  this.counter = 0;
  var maxTime = 60*10;
  this.stopVar = true;

  var fields = [
    //{value: 24, size: 24, label: "h", update: function(date) { return date.getHours(); }},
    //{value: 60, size: 60, label: "m", update: function(date) { return date.getMinutes(); }},
    {name: this.name, value: maxTime, size: maxTime, label: "s", update: function() { return increaseCounter(); }}
  ];

  //trainLeavesAt-getDateRightNow

  var width = 90;
        height = 30;
  var svg = d3.select("#innerSvg").append("g")
  // console.dir(svg);
  //       .attr("width", width)
  //       .attr("height", height);
  var arc = d3.svg.arc()
      .innerRadius(4)
      .outerRadius(12)
      .startAngle(0)
      .endAngle(function(d) { return (d.value / d.size) * 2 * Math.PI; });



  //console.log(fields);
  var field = svg.selectAll(".field")
      .data(fields)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate("+cxArc+","+cyArc+")"})
      .attr("class", "field");

  // console.dir(field);

  field.append("path")
      .attr("class", "path path--background")
      .attr("d", arc);

  var path = field.append("path")
      .attr("class", "path path--foreground");

  // var label = field.append("text")
  //     .attr("class", "label")
  //     .attr("dy", ".35em");

  this.update = function() {
    //console.log("update arc)");

    field
        .each(function(d) { d.previous = d.value, d.value = d.update(); });

    path.transition()
        .ease("linear")
        .duration(1000)
        .attrTween("d", arcTween);

    // label
    //     .text(function(d) { return d.name + (d.value + d.label) });

    if(!_this.stopVar){
      setTimeout(_this.update, 1000);     
    }
 
  };

  this.update();

  function arcTween(b) {
    if(b.previous <= maxTime-60){
      var i = d3.interpolate({value: b.previous}, b);
      return function(t) {
        return arc(i(t));
      };
    }
    
  }

  function increaseCounter(){
    if(_this.counter >= maxTime){
      _this.counter = 0;
      _this.stop();
      return _this.counter;
    }else if(_this.counter >= maxTime-2*60){
      _this.counter = maxTime;
    }else{
      _this.counter++;
    }
    //console.log(_this.name + ": "+_this.counter);
    return _this.counter;
  }

  this.updateArc = function(timeToDeparture){
    if(maxTime >= timeToDeparture*60/speed){
      _this.counter = maxTime - timeToDeparture*60/speed;
    }
    
  }
  this.stop = function() {
    _this.stopVar = true;
  }
  this.start = function() {
    console.log("start");
    _this.stopVar = false;
    _this.update();
  }
  this.getCurrentTimeLeft = function() {
    return _this.counter;
  }
}