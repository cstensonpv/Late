//Declaration of variables

var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

var slider = d3.slider().on("slide", function(event, value) {
    updateFromSliderValue(value,true);
  }).axis(true).min(0).max(24);

var allArcs = {};
var margin = {top: 90, right: 240, bottom: 90, left: 240},
    width = 960 - margin.left - margin.right,
    t = .5,
    height = 1000 - margin.top - margin.bottom;

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
  .attr("id","outerSvg")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")"+"rotate("+0+","+350+","+450+")")
  .attr("id", "innerSvg");

//svg.call(zoom.event);

var data = null;
var active = null;
var isAStationClicked = false;

//Main
window.onload = function() {
  printCommuterMap();
  startTransition(0);
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
      .style("stroke", "grey");
      data = pendeltag.nodes;
    // Append nodes (circles)
    var stations = svg.selectAll(".station")
      .data(pendeltag.nodes)
      .enter()
      .append("g")
      .attr("id",function(d,i){

        return "station_" + d.id;
      })
      .on("click",clicked)
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
    for(var i = 0; i < pendeltag.nodes.length; i++) {
      var id = "#station_"+pendeltag.nodes[i].id;
      var arc = new Arc(id, x(pendeltag.nodes[i].x) , y(pendeltag.nodes[i].y), pendeltag.nodes[i].name);
      //arc.start();
      allArcs[id] = arc;
      //console.log(allArcs);
    }


    svg.append("g")
      .attr("class", "x axis");

    svg.append("g")
      .attr("class", "y axis");

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

function changeColorOfStationNameText(d3Object, siteid, colorName, arcRgb){
  var text = d3Object.select("#text"+siteid);
  text.style("fill",colorName);

  var selectedArc = d3.select("#stationPath_"+siteid);
  selectedArc.attr("fill",arcRgb);
}

function drawDetailView(domid,direction){
  var siteid = domid.substring(8,domid.length); //siteid will be 9xxx
  var detailView = new DetailView(siteid, "north");
}

function clicked(d,i)
{
  var idOfSelected = d3.select(this).attr("id"); //station_9xxx

  if(active == null) // if no selection was made
  {
    drawDetailView(idOfSelected,"north");
    changeColorOfStationNameText(d3.select(this),idOfSelected.substring(8,idOfSelected.length),
      "red", "rgb(108, 7, 107)");
    active = d3.select(this);
  }
  else{
    var idOfactive = active.attr("id");

    d3.select("#detailView").remove();

    if(idOfSelected == idOfactive){ //same node clicked. Remove the drawn detail.
      console.log("same clicked");

      changeColorOfStationNameText(active,idOfSelected.substring(8,idOfSelected.length),
        "black","rgb(26,115,0)");
      active = null;
    }
    else{
      console.log("diff clicked " + idOfactive);
      changeColorOfStationNameText(active,idOfactive.substring(8,idOfactive.length),
        "black","rgb(26,115,0)");
      changeColorOfStationNameText(d3.select(this),idOfSelected.substring(8,idOfSelected.length),
        "red","rgb(108, 7, 107)");
      drawDetailView(idOfSelected,"north");
      active = d3.select(this);
    }
  }
}

