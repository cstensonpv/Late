function stationNode(id,cx,cy,name)
{
	function drawStationNode(id,cx,cy,name)
	{
		var width = 180;
		    height = 60; 

		var fields = [
		  {value: 60, size: 60*15, label: "s", update: function(date) { return date.getSeconds(); }}
		];

		//trainLeavesAt-getDateRightNow

		var arc = d3.svg.arc()
		    .innerRadius(4)
		    .outerRadius(8)
		    .startAngle(0)
		    .endAngle(function(d) { return (d.value / d.size) * 2 * Math.PI; });

		var svg = d3.select("#outerSvg");

		// var expectedTime = 500;
		// var tableTime = 450;
		// var delayTime = expectedTime - tableTime;


		// var ontime = d3.scale.linear()
		//         .domain([0,500])
		//         .range(['green','red']);


		// console.log("cx:",cx);
		// console.log("cy:",cy);
		// console.log("translate("+cx+","+ cy+")");

		var field = svg.select(id)
			.data(fields)
			.attr("transform", function(d, i) { return "translate("+cx+","+ cy+")"}) // + (i * 2 + 1.25) / 6.5 * width + "," + height / 2 + ")"; })
		    .attr("class", "station");

		  

		/*var text = field.append("text")
		      .attr("class", "label")
		      .attr("dy", "9")
		      .attr("dx", "100")
		      .text( name);*/

		/*var field = svg.select(id).selectAll(".station")
		    .data(fields)
		  .enter().append("g")
		    .attr("transform", function(d, i) { return "translate(300,300)"}) // + (i * 2 + 1.25) / 6.5 * width + "," + height / 2 + ")"; })
		    .attr("class", "station")
		    .style("fill", function(){
		      return ontime(parseInt(delayTime))
		    });*/

		field.append("path")
		    .attr("class", "path path--background")
		    .attr("d", arc);

		var path = field.append("path")
		    .attr("class", "path path--foreground");

		// var label = field.append("text")
		//     .attr("class", "label")
		//     .attr("dy", ".35em");

		(function update() {
		  var now = new Date();

		  field
		      .each(function(d) { d.previous = d.value, d.value = d.update(now); });

		  path.transition()
		      .ease("linear")
		      .duration(1000)
		      .attrTween("d", arcTween);

		  // label
		  //     .text(function(d) { return d.value + d.label; });
		  setTimeout(update, 1000 - (now % 1000));
		})();

		function arcTween(b) {
		  var i = d3.interpolate({value: b.previous}, b);
		  return function(t) {
		    return arc(i(t));
		  };
		}
	}
	var tt = drawStationNode(id,cx,cy,name);

}

function updateStationNode(id, time){
		console.log("update stationNode"+id+time);
		var fields = [
		  {value: 60, size: 60*15, label: "s", update: function(date) { return date.getSeconds(); }}
		];

		//trainLeavesAt-getDateRightNow

		var arc = d3.svg.arc()
		    .innerRadius(4)
		    .outerRadius(8)
		    .startAngle(0)
		    .endAngle(function(d) { return (time / d.size) * 2 * Math.PI; });

		var svg = d3.select("#outerSvg");

		var field = svg.select(id)

		field.append("path")
		    .attr("class", "path path--background")
		    .attr("d", arc);

		var path = field.append("path")
		    .attr("class", "path path--foreground");

		(function update() {
		  var now = new Date();

		 var field = svg.select(id)
		      .each(function(d) { d.previous = d.value, d.value = time*60; });

		  path.transition()
		      .ease("linear")
		      .duration(1000)
		      .attrTween("d", arcTween);

		  // label
		  //     .text(function(d) { return d.value + d.label; });
		  setTimeout(update, 1000 - (now % 1000));
		})();

		function arcTween(b) {
		  var i = d3.interpolate({value: b.previous}, b);
		  return function(t) {
		    return arc(i(t));
		  };
		}
	}