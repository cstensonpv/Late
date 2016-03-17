var DetailView = function(siteid, dir, ct) {
  var currentStation = siteid;
  var direction = dir;
  var initStep = true;

  var currentDate = new Date();
  var currentHour = currentDate.getHours();
  var currentTime = currentDate.getHours()*60+currentDate.getMinutes();
  currentTime = ct;

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

  function getDelayTimeUpdate(id) {
    var url = "http://localhost:3000/timetable/until/"+id+"/"+ currentTime;//minutesToTime(currentMinute);//currentTime; //instead of until you can use between to get between 2 times
    $.ajax({
      type: "GET",
      dataType: 'jsonp',
      cache: false,
      url: url,
      success: function (data) {
        changeData(data);
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


  var widthPercent = 50;
  var heightPercent = 100;

  var width = window.innerWidth * widthPercent/100;
  var height = window.innerHeight * heightPercent/100;
  console.log("w: " + innerWidth + " h: " + innerHeight)
  var cx = width/2;
  var cy = height/2;
  var radius = height/Math.PI;

  var svg = d3.select("#two")
  	.append("svg")
  	.attr("width", width)
  	.attr("height", height)
  	.style("background", "#006699")

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
            "zoomable": (currentMinute / 60 > i)
          };
          slices.push(slice);
        }
        changeCircle(slices);
      }
    });
  }
  updateCircleData(currentStation);

  function changeCircle(data) {

    svg.selectAll(".slice").remove();
    /* ------- PIE SLICES -------*/
    var slice = svg.select(".slices").selectAll("path.slice")
      .data(pie(data));
      for(var i = 0; i < 24; i++){
        if(data[0].value === 1 && data[1].value === 1){

        }
        else if (data[i].value===1){
            console.log(data[0].value)

            if(data[i].value === 1){
              var selectedHour = i;
            }
          }
        }

    //d3.select("g.tooltip").html("");

    if(selectedHour>-1){
      d3.selectAll(".trainz")
        .transition()
        .ease("linear")
        .duration(1000)
        .attr("transform", function(d) {
          hour = parseInt(d["ExpectedDateTime"].substring(11,13));
          minute = parseInt(d["ExpectedDateTime"].substring(14,16));
          if(hour == selectedHour){
            var angleDiff = minute/60*360 - (hour*60 + minute) / (24*60) * 360;
           // console.log("anglediff: " + angleDiff)
            //console.log("cx: " + cx + " cy: " + cy)
            //console.log(data.zoom)
            return "rotate(" + angleDiff + " " + cx + " " + cy + ")"; }

          else{
            d3.select(this)
              .style("visibility","hidden")
            return "rotate(" + 0 + " " + cx + " " + cy + ")";}
          })
    }
    else if(selectedHour == null){
      d3.selectAll(".trainz").remove();
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
            d3.select("g.tooltip").html("");
            for (var i = 0; i < 24; i++) {
              data[i].value = 1;
            }
          } else {
            d.data.zoom = true;
            for (var i = 0; i < 24; i++) {
              if (data[i].id === d.data.id) {
                data[i].value = 1;
                  var tooltip = d3.select("g.tooltip")
                  if (!(tooltip.html())){
                    tooltip
                      .append("text")
                      .attr("class", "tooltip-title")
                      .attr("text-anchor", "middle")
                      .attr("alignment-baseline", "middle")
                      .attr("y", -60)
                      .text("Average delay for")
                      .attr("font-family", "Helvetica, Arial, sans-serif")
                      .attr("font-size", "17px")
                      .attr("fill", "#575757");

                    tooltip
                      .append("text")
                      .attr("class", "tooltip-title")
                      .attr("text-anchor", "middle")
                      .attr("alignment-baseline", "middle")
                      .attr("y", -30)
                      .text(i+":00 - "+i+":59")
                      .attr("font-family", "Helvetica, Arial, sans-serif")
                      .attr("font-size", "17px")
                      .attr("fill", "#575757");

                    var wholeNumber = parseInt(data[i].mean.toString().substring(0,1));
                    var decimals = parseFloat(data[i].mean.toString().substring(2,4));
                    var modulus = data[i].mean%wholeNumber;

                    tooltip
                      .append("text")
                      .attr("class", "tooltip-time")
                      .attr("text-anchor", "middle")
                      .attr("alignment-baseline", "middle")
                      .attr("y", 20)
                      .text(function(){
                        if(wholeNumber == 1){
                          return data[i].mean.toString().substr(0,1)+" minute"
                        }
                        else{
                          return data[i].mean.toString().substr(0,1)+" minutes"
                        }
                      })
                      .attr("font-family", "Helvetica, Arial, sans-serif")
                      .attr("font-size", "20px")
                      .attr("fill", "#161616");


                      //1.07 -> "1.07" -> "07" -> "0.07" -> 0.07
                      console.log("wholeNumber: " +wholeNumber+" , meantofixed: "+data[i].mean+" , modulus: "+data[i].mean%wholeNumber+" , decimals: "+decimals+" , secondsFixed: "+ modulus.toFixed(2))

                    if(data[i].mean>0 && wholeNumber>0 && isNaN(decimals)===false){ //numbers bigger than 1 and have decimals (e.g. 1.07)
                      tooltip
                        .append("text")
                        .attr("class", "tooltip-time")
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "middle")
                        .text(modulus.toFixed(2)*(60)+" seconds")
                        .attr("y", 50)
                        .attr("font-family", "Helvetica, Arial, sans-serif")
                        .attr("font-size", "20px")
                        .attr("fill", "#161616");
                    }
                    else if(data[i].mean>0 && isNaN(decimals)){ //numbers bigger than 0 without decimals (e.g. 1.00)

                    }

                    else if(data[i].mean>0){
                      tooltip
                        .append("text")
                        .attr("class", "tooltip-time")
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "middle")
                        .text(data[i].mean.toFixed(2)*(60)+" seconds")//.toString().substring(3,5)+" seconds")
                        .attr("y", 50)
                        .attr("font-family", "Helvetica, Arial, sans-serif")
                        .attr("font-size", "20px")
                        .attr("fill", "#161616");
                    }
                  }


              } else {
                data[i].value = 0;
              }
            }
          }
          changeCircle(data);
        }
      });

    slice
      .transition().duration(1000)
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
    var colorScale = chroma.scale(["green", "#FFF235","red"]).domain([0, 2, 8]);

    d3.select("g.detail-title")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "before-edge")
      .text(data[direction][0].StopAreaName)
      .attr("font-family", "Helvetica, Arial, sans-serif")
      .attr("font-size", "30px")
      .attr("font-weight", "bold")
      .attr("fill", "#ffffff");

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

    function trainzClick(){
      trainz
        .style("fill", function(d){
          return colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex()
        })
        .style("stroke", function(d){

          return colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex()
        })


      var side = Math.sqrt(Math.pow((radius*2),2)/2);

      trainz
          .on("click", function(d){
              trainz
                .style("fill", "#afafaf")
                .style("stroke", "#afafaf")

              d3.select(this)
                .style("fill", colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex())
                .style("stroke", colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex())
                .on("click", function(d){
                  trainzClick()
                  /*trainz
                    .style("fill", function(d){
                      return colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex()
                    })
                    .style("stroke", function(d){

                      return colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex()
                    })*/
                })

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
            })
    }
    trainzClick()



   /* d3.selectAll()
      .on("click", function(d){
          var thisOne = d3.select(this)
          if(this == trainz){
            console.log("bugger off!")
          }
        }) */

  }

  function changeData(data) {
    var colorScale = chroma.scale(["green", "#FFF235","red"]).domain([0, 2, 8]);

    svg.selectAll(".trainz").remove();

    var lines = svg.selectAll("g")
  		.data(data[direction])
  	.enter().append("g").attr("class", "trainz")
  		.append("line")
  		.attr("x1", cx)
  		.attr("x2", cx)
  		.attr("y1", (cy - radius))
      .attr("y2", function(d){
        return (cy - radius - (dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"]))*8)
      })
    	.style("stroke-width","2px")
      // .style("stroke", "green")
    	.attr("transform", function(d) {
  			hour = parseInt(d["ExpectedDateTime"].substring(11,13));
  			minute = parseInt(d["ExpectedDateTime"].substring(14,16));
        return "rotate(" + (hour * 60 + minute) / (24 * 60) * 360 + " " + cx + " " + cy + ")";
      });

      svg.selectAll(".trainz").append("circle")
    		.attr("class", "blob")
    		.attr("cx", cx)
        .attr("cy", function(d){
          return (cy - radius - (dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"]))*8)
        })
    		.attr("r", 5)
        // .style("fill", "green")
    		.attr("transform", function(d){
    			hour = parseInt(d["ExpectedDateTime"].substring(11,13));
    			minute = parseInt(d["ExpectedDateTime"].substring(14,16));
    			return "rotate(" + (hour * 60 + minute) / (24 * 60) * 360 + " " + cx + " " + cy + ")";
        });
    var trainz = svg.selectAll(".trainz");

    trainz
      .style("fill", function(d){
        return colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex()
      })
      .style("stroke", function(d){
        return colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex()
      });

      function trainzClick(){
        trainz
          .style("fill", function(d){
            return colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex()
          })
          .style("stroke", function(d){
            return colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex()
          })


        var side = Math.sqrt(Math.pow((radius*2),2)/2);

        trainz
            .on("click", function(d){
                trainz
                  .style("fill", "#afafaf")
                  .style("stroke", "#afafaf")

                d3.select(this)
                  .style("fill", colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex())
                  .style("stroke", colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex())
                  .on("click", function(d){
                    trainzClick()
                    /*trainz
                      .style("fill", function(d){
                        return colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex()
                      })
                      .style("stroke", function(d){

                        return colorScale(dateToMins(d["ExpectedDateTime"], d["TimeTabledDateTime"])).hex()
                      })*/
                  })

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
              })
      }
      trainzClick()
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

  this.updateData = function(newTime) {
    currentTime = newTime;
    getDelayTimeUpdate(currentStation);
    // updateCircleData(currentStation);
  }

  this.hide = function() {
    svg.html("");
  }

  this.show = function() {
    resetSvg();
    updateCircleData(currentStation);
  }
}
