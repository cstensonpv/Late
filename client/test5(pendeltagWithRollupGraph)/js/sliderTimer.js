// Declarations

var timer_ret_val = false;
var continueTimerVal = false;
var isContinue = false;
var timerCurrentValue = 0;
var last = 0;
var lastCalledMinute;

var speed = 1 ;//times normal speed!

var maxScaleofSlider = (3600*24)*10/speed;
var currentPositionOfSlider = 0;

var sliderPlace = d3.select('#slider6').call(slider);
var sliderHandle = d3.select("#handle-one");


//Functions

function update(data, currTimeMin){
  for(var key in data) {
    if(typeof data[key].north != 'string') {
      var timeTabledDate = parseDate(data[key].north.TimeTabledDateTime);
      var id = key.substring(3);
      var expectedDate = parseDate(data[key].north.ExpectedDateTime);
      var pendeltagDelay = Math.abs(timeTabledDate - expectedDate);
      // Update timers of next
      timeToArrival = dateToMinutes(expectedDate) - currTimeMin;
      //console.log("Time till departure: "+  (dateToMinutes(expectedDate) - currTimeMin));
      var stationId = "#station_"+id;
      if(typeof allArcs[stationId] != 'object'){
        console.log("Station id does nor exists: "+stationId);
      }else{
        allArcs[stationId].updateArc(timeToArrival*60);
        if(allArcs[stationId].stopVar){
          allArcs[stationId].start();
        }
      }

      //updateStationNode("#station_"+id,timeToArrival);
      // Changes color if there is a delay.
      if(pendeltagDelay != 0) {
        console.log(id);
        // console.log(("#stationPath_"+id));
        // console.log(d3.select("#stationPath_"+id));

        d3.select("#stationPath_"+id).attr("fill","red");
        // console.log(pendeltagDelay + " *---* " + id);
      }
      else {
        d3.select("#stationPath_"+id).attr("fill","rgb(26,115,0)");
      }
    }
  }
}


function stop(){
  console.log("Stop!");
  timer_ret_val = true;
  continueTimerVal = true;
  last = timerCurrentValue;
  last *= 100;

  //Stops all the arcs!
  for(key in allArcs){
    //console.log(key);
    allArcs[key].stop();
  }
  //console.log("push stop: "  + timerCurrentValue);
}

function startAnimate(){
  timer_ret_val = false;
  isContinue = true;
  var cntVal = lastCalledMinute; //parseFloat(d3.select("#path_9502_9511").attr("T"));//Can't it be cahnged to the value from slider?
  startTransition(cntVal);
  console.log(cntVal);

  //Starts all arcs
  for(key in allArcs){
    allArcs[key].start();
  }
  //console.log("push start: "  + timerCurrentValue);
}

function getDataForCurrentMinute(minutes){
  $.ajax({
  url: "http://localhost:3000/datafromtime/"+minutes,
  dataType: "jsonp",
  success: function(result){
    //console.log(result);
    update(result, minutes);
  },
  error:function(jqXHR,status,error){
      if (jqXHR.status === 0) {
          console.log('Not connect.\n Verify Network.');
      } else if (jqXHR.status == 404) {
          console.log('Requested page not found. [404]');
      } else if (jqXHR.status == 500) {
          console.log('Internal Server Error [500].');
      } else if (exception === 'parsererror') {
          console.log('Requested JSON parse failed.');
      } else if (exception === 'timeout') {
          console.log('Time out error.');
      } else if (exception === 'abort') {
          console.log('Ajax request aborted.');
      } else {
          console.log('Uncaught Error.\n' + jqXHR.responseText);
      }
    }
  });
}


function percentageToMinutes(percentage){
  return percentage*14.4;
}

function minutesToPercentage(minutes){
  return minutes/14.4;
}

function minutesToTime(minutes){
  var hour = Math.floor((minutes/60)).toString();
  if(hour.length < 2){
    hour = "0" + hour;
  }
  var min = (minutes % 60).toString();
  if(min.length < 2){
    min = "0" + min;
  }
  return  hour + ":" + min;
}

function dateToMinutes(date) {
  var hour = date.getHours();
  var min= date.getMinutes();
  return (hour*60) + min;
}

function updateFromSliderValue(value,isDragged){
  var calculatedTimeValue = 0;
  if(isDragged){
    stop(); // Stops the autoplaying
    calculatedTimeValue = value*60;
  }
  else{
    calculatedTimeValue = percentageToMinutes(value);
  }
  var currentMinute = calculatedTimeValue.toFixed(0);

  d3.select('#slider3text').text(minutesToTime(currentMinute));//*60);
  if(currentMinute != lastCalledMinute){
    getDataForCurrentMinute(currentMinute);
    lastCalledMinute = currentMinute;
  }
}

function startTransition(timerCur) {
  currentPositionOfSlider = timerCur;//value of T tag
  if(!isContinue)
    d3.timer(timerTick);
  else
    d3.timer(continueTimer);
}

function continueTimer(elapsed) {
  var normalTime = minutesToPercentage(currentPositionOfSlider);
  var x = elapsed/maxScaleofSlider;
  var actualSliderPercentage = parseFloat(normalTime) + parseFloat(x);

  //console.log(elapsed + " ----- " + normalTime + " ----- " + x + " ------ " + actualSliderPercentage);

  sliderHandle.transition().duration(0).style("left",actualSliderPercentage+"%");
  updateFromSliderValue(actualSliderPercentage,false);
  timerCurrentValue = actualSliderPercentage;

  return timer_ret_val;
}

function timerTick(elapsed) {
  var normalTime = elapsed/maxScaleofSlider;
  //console.log(timerCurrentValue);

  //d3.select('#slider3text').text("");
  sliderHandle.transition().duration(0).style("left",normalTime+"%");
  updateFromSliderValue(normalTime,false);
  timerCurrentValue = normalTime;

  return timer_ret_val;
}



/*function timerTick(elapsed,clicked_id,isMovingNorth,isPaused){
console.log("elapsed: " + timerCurrentValue);

if(!timer_ret_val)
{
  console.log("I pushed continue: " + timerCurrentValue);
  t = (t + (timerCurrentValue - last) / 5000) % 1;
}
else{
  console.log("I did not pushed shit: " + timerCurrentValue);
  t = (t + (elapsed - last) / 5000) % 1;
}
last = elapsed;

var factor = last/100;

if(factor < 20){//temporary measurement.
  update(last/100,clicked_id,isMovingNorth);//redraw the selected circle and the path
}

var tmpVar = last/100;

if(tmpVar <= 100)
{
  sliderHandle.transition().duration(0).style("left",timerCurrentValue+"%");
  updateFromSliderValue(tmpVar);
  timerCurrentValue = tmpVar;
}
else{
  //console.log("yarrak:" + tmpVar);
}

return timer_ret_val;
}*/
