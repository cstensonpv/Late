//Declaration of variables

var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

var currentDate = new Date();
var currentMinute = currentDate.getHours() * 60 + currentDate.getMinutes();
var minuteasdf = 60000;
var speedMultiplierasdf = 1;
var timeout;
var direction = "north";
var detailSiteId = 9000;
var mouseDown = false;

var arcs;
var detailView = new DetailView(detailSiteId, direction, currentMinute);


var slider = d3.slider().on("slide", function(event, value) {
    updateSliderValue(value,true);
  }).axis(true).min(0).max(24);

var sliderPlace = d3.select('#slider6').call(slider);
var sliderHandle = d3.select("#handle-one");

var widthPercent = 50;
var heightPercent = 100;

var width = window.innerWidth * widthPercent/100;
var height = 1000;

var margin = {top: 90, right: 100, bottom: 90, left: 100},
    width = width - margin.left - margin.right,
    t = .5,
    height = height - margin.top - margin.bottom;

var x = d3.scale.linear();
var y = d3.scale.linear();

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("top")
  .ticks(20);

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var svg = d3.select("#one").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("id", "outerSvg")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")"+"rotate("+0+","+350+","+450+")")
  .attr("id", "innerSvg");

//svg.call(zoom.event);

var data = null;
var active = null;
var tmpActive = d3.select(null);

var isAStationClicked = false;

//Main
window.onload = function() {
  printCommuterMap();

};
//End Main

function printCommuterMap(){
  d3.json("data/pendeltag.json", function(error, pendeltag) {

    if (error) throw error;

    x.domain([getMinOfArray(pendeltag.nodes.map(fx)),getMaxOfArray(pendeltag.nodes.map(fx))])
    x.range([0, width]);
    y.domain([getMaxOfArray(pendeltag.nodes.map(fy)),getMinOfArray(pendeltag.nodes.map(fy))]);
    y.range([0,height]);

    //Append the links between circles
    svg.selectAll(".link")
      .data(pendeltag.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("id", function(d,i) {return "path_"+pendeltag.nodes[d.source].id+"_"+pendeltag.nodes[d.target].id;})
      .attr("d", function(d,i) {
        var source = pendeltag.nodes[d.source];
        var target = pendeltag.nodes[d.target];
        var startX = x(parseFloat(source.x)),
          startY = y(parseFloat(source.y)),
          stopX = x(parseFloat(target.x));
          stopY = y(parseFloat(target.y));
        return "M "+startX+" "+startY + " "+stopX+" "+stopY;
      })
      .style("stroke-width", function(d) { return 10; })
      .style("stroke", "black");
      data = pendeltag.nodes;
    // Append nodes (circles)
    var stations = svg.selectAll(".station")
      .data(pendeltag.nodes)
      .enter()
      .append("g")
      .attr("id",function(d,i){

        return "station_" + d.id;
      })
      .on("click", function(d) {
        var id = d3.select(this).attr("id");

        // active = d3.select(this).classed("active",true);
        // console.log(d3.selectAll(".station").selectAll("text").enter().attr("id"));
        // d3.selectAll(".station").selectAll("text").attr("fill", "red");
        // d3.select(this).select("text").attr("fill", "red");
        id = +id.substring("station_".length);
        // var test = d3.selectAll(".station").filter(".active");
        // console.log(test[0].attr("id"));
        detailSiteId = id;
        detailView.reset(id, direction, currentMinute);
      })
      .classed("station", true);

    var label = stations.append("text")
    .attr("class", "word")
    .attr("dy", function(d) {
      return y(fy(d)) + d.labelY })
    .attr("dx", function(d) {
        if (d.x<100 || d.name==="Rosersberg" || d.name==="Märsta"){
            return x(fx(d)) -d.labelX
        }
        else{
            return x(fx(d)) + 15
        }
    })
    .attr("id", function(d) {return "text"+d.id })
    .text( function(d) {
      return d.name;
    });

    /*
    This part adds the interactive circles to the "map". First parameter is the
    id of the station. Second paramter is the "cy" parameter.
    Third parameter is the name of the station
    */
    arcs = new Arcs(pendeltag, svg);

    d3.selectAll(".slices")
      .on("click", function(d) {
        var id = d3.select(this).attr("id");
        id = +id.substring("slices_".length);
        detailView.reset(id, direction, currentMinute);
        detailSiteId = id;
      });

    svg.append("g")
      .attr("class", "x axis");

    svg.append("g")
      .attr("class", "y axis");

    console.log("init interval");
    arcs.setSpeedMultiplier(speedMultiplierasdf);
    interval();
  });
}

function fx(d) {
  if(typeof data === 'number'){
    return d.x;
  }else{
    return parseInt(d.x);
  }
}

function fy(d) {
  if(typeof data === 'number'){
    return d.y;
  }else{
    return parseInt(d.y);
  }
}
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

function setSpeedMultiplier(sm) {
  speedMultiplierasdf = sm;
  arcs.setSpeedMultiplier(sm);
  clearTimeout(timeout);
  interval();
}

function setDirection(dir) {
  direction = dir;
  arcs.setDirection(dir);
  detailView.reset(detailSiteId, direction, currentMinute);
  clearTimeout(timeout);
  interval();
}

function interval() {
  arcs.setCurrentMinute(currentMinute);
  arcs.getDelayData();
  currentMinute++;
  setSliderMinute(currentMinute);
  timeout = setTimeout(interval, minuteasdf * speedMultiplierasdf);
}

function updateSliderHandle() {
  if (sliderHandle !== undefined) {
    var percent = currentMinute / 1440 * 100;
    sliderHandle.transition().duration(10).style("left",percent+"%");
  }
}

function setSliderMinute(cm) {
  currentMinute = cm;
  updateSliderHandle();
}

function updateSliderValue(value, isDragged) {
  value *= 60;
  currentMinute = value.toFixed(0);
  detailView.updateData(currentMinute);
  // console.log(currentMinute);
}
