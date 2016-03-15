var Arc = function(id, cx, cy, name){ 
  var counter = 0;
  var maxTime = 5*60;

  var fields = [
    //{value: 24, size: 24, label: "h", update: function(date) { return date.getHours(); }},
    //{value: 60, size: 60, label: "m", update: function(date) { return date.getMinutes(); }},
    {value: maxTime, size: maxTime, label: "s", update: function() { return increaseCounter(); }}
  ];

  //trainLeavesAt-getDateRightNow

  var width = 960;
        height = 620;
  // var svg = d3.select("body").append("svg")
  //       .attr("width", width)
  //       .attr("height", height);
  var arc = d3.svg.arc()
      .innerRadius(width / 6.5-70)
      .outerRadius(width / 6.5 - 5)
      .startAngle(0)
      .endAngle(function(d) { return (d.value / d.size) * 2 * Math.PI; });



  //console.log(fields);
  var field = svg.selectAll(".field")
      .data(fields)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate("+cx+","+cy+")"})
      .attr("class", "field");

  field.append("path")
      .attr("class", "path path--background")
      .attr("d", arc);

  var path = field.append("path")
      .attr("class", "path path--foreground");

  var label = field.append("text")
      .attr("class", "label")
      .attr("dy", ".35em");

  update();

  function update() {

    field
        .each(function(d) { d.previous = d.value, d.value = d.update(); });

    path.transition()
        .ease("linear")
        .duration(1000)
        .attrTween("d", arcTween);

    label
        .text(function(d) { return d.value + d.label; });

    setTimeout(update, 1000);
  };

  function arcTween(b) {
    if(b.previous != maxTime){
      var i = d3.interpolate({value: b.previous}, b);
      return function(t) {
        return arc(i(t));
      };
    }
    
  }

  function increaseCounter(){
    if(counter >= maxTime){
      return counter;
    }else{
      counter++;
    }
    return counter;
  }

  this.updateArc = function(value){
    counter = value;
  }
}