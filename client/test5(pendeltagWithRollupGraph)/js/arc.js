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
    {name: this.name, value: maxTime, size: maxTime, label: "s", update: function() { return increaseCounter(); }}
  ];

  var width = 25;
        height = 25;
  var svg = d3.select("#innerSvg").append("g")

  var arc = d3.svg.arc()
      .innerRadius(4)
      .outerRadius(12)
      .startAngle(0)
      .endAngle(function(d) { return (d.value / d.size) * 2 * Math.PI; });

  var field = svg.selectAll(".field")
      .data(fields)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate("+cxArc+","+cyArc+")"})
      .attr("class", "field");

  field.append("path")
      .attr("class", "path path--background")
      .attr("d", arc);

  var path = field.append("path")
      .attr("class", "path path--foreground")
      .attr("id", "stationPath_" + id.substring(9));

  this.update = function(stop) {
    if(typeof stop == 'boolean'){
      _this.stopVar= stop;
    }
    var checkTime = new Date();
    path.transition()
        .ease("linear")
        .duration(1000/speed)
        .attrTween("d", arcTween);

    if(!_this.stopVar){
       field
        .each(function(d) { d.previous = d.value, d.value = d.update(); });

      setTimeout(_this.update, 1000/speed);
    }
  };

  function arcTween(b) {
    if(b.previous < maxTime/*-60*/){
      var i = d3.interpolate({value: b.previous}, b);
      return function(t) {
        return arc(i(t));
      };
    }else{
      var i = d3.interpolate({value: b.previous}, b);
      return function(t) {
        t=1; //last frame in the interpolation interpolate makes an svg path.
        return arc(i(t));
      };
    }
  }

  function increaseCounter(){
    if(_this.counter >= maxTime){
      _this.counter = 0;
      _this.update(true);
      return _this.counter;
    }else{
      _this.counter++;
    }
    return _this.counter;
  }

  this.updateArc = function(timeToDeparture){
    //Takes in maxTime and timeToDeparture in seconds!
    timeToDeparture = maxTime - timeToDeparture;
    if(maxTime >= timeToDeparture && 0 <= timeToDeparture){
      var correctionAmount = Math.abs(_this.counter - timeToDeparture);
      if(correctionAmount >= 30 ){ //If correction is more than 30sek due to resolution in data
        _this.counter = timeToDeparture;
      }
    }else{
      // console.log("time to departure not in range of arc for station " + _this.name);
    }


  }
  this.stop = function() {
    //console.log("stop");
    _this.stopVar = true;
  }
  this.start = function() {
    //console.log("start");
    _this.stopVar = false;
    _this.update();
  }
  this.getCurrentTimeLeft = function() {
    return _this.counter;
  }
}
