//Declaration of variables

var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

var slider = d3.slider().on("slide", function(event, value) {
    updateFromSliderValue(value,true);
  }).axis(true).min(0).max(24);

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

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("id","outerSvg")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var data = null;


//Main
window.onload = function() {
  printCommuterMap(); 
  startTransition(0);
};
//End Main

function printCommuterMap(){
  d3.json("data/pendeltag.json", function(error, social) {
    if (error) throw error;

    x.domain([getMinOfArray(social.nodes.map(fx)),getMaxOfArray(social.nodes.map(fx))])
    x.range([0, width]);
    y.domain([getMaxOfArray(social.nodes.map(fy)),getMinOfArray(social.nodes.map(fy))]);
    y.range([0,height]);

    //Append the links between circles
    svg.selectAll(".link")
      .data(social.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("id", function(d,i) {return "path_"+social.nodes[d.source].id+"_"+social.nodes[d.target].id;})
      .attr("d", function(d,i) {
        var source = social.nodes[d.source];
        var target = social.nodes[d.target];
        var startX = x(parseFloat(source.x).toFixed(0)),
          startY = y(parseFloat(source.y).toFixed(0)),
          stopX = x(parseFloat(target.x).toFixed(0));
          stopY = y(parseFloat(target.y).toFixed(0));
        return "M "+startX+" "+startY + " "+stopX+" "+stopY;
      })
      .style("stroke-width", function(d) { return 4; });

    // Append nodes (circles)
    var stations = svg.selectAll(".station")
      .data(social.nodes)
      .enter()
      .append("g")
      .attr("id",function(d,i){

        return "station_" + d.id;
      })
      .classed("station", true);

    var label = stations.append("text")
    .attr("class", "word")
    .attr("dy", function(d) {return 5 })
    .attr("dx", function(d) {return 10 })
    .attr("id", function(d) {return "text"+d.id })
    .text( function(d) {
      return d.name;
    });

    /*
    This part adds the interactive circles to the "map". First parameter is the
    id of the station. Second paramter is the "cy" parameter.
    Third parameter is the name of the station
    */
    for(var i = 0; i < social.nodes.length; i++) {
      var one = x(social.nodes[i].x);
      var two = y(social.nodes[i].y);
      stationNode("#station_"+social.nodes[i].id, x(social.nodes[i].x) , y(social.nodes[i].y), social.nodes[i].name);
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





// function getStation(selected){
//   for(station in data.nodes){
//     if(data.nodes[station].nodes[0].id == selected){
//       return data.nodes[station].nodes[0];
//     }
//   }
//   return "";
// }

// function getStationIndex(selected){
//   for(station in data.nodes){
//     if(data.nodes[station].nodes[0].id == selected){
//       return station;
//     }
//   }
//   return "";
// }

// function calcPath(source,target,x,dir) {
//   var startX = source.x.toFixed(0),
//   startY = parseInt(source.y.toFixed(0)),
//   stopX = target.x.toFixed(0);
//   stopY = parseInt(target.y.toFixed(0));

//   if(dir === "north"){
//     stopY += x;
//   }else if(dir === "south"){
//     startY += x;
//   }
//   return "M "+startX+" "+startY + " "+stopX+" "+stopY;
// }