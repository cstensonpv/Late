// Declarations

var timer_ret_val = false;
var continueTimerVal = false;
var isContinue = false;
var timerCurrentValue = 0;
var last = 0;

var maxScaleofSlider = 1400;
var currentPositionOfSlider = 0;

var sliderPlace = d3.select('#slider6').call(slider);
var sliderHandle = d3.select("#handle-one");


//Functions
function stop(){
  timer_ret_val = true;
  continueTimerVal = true;
  last = timerCurrentValue;
  last *= 100;
  //console.log("push stop: "  + timerCurrentValue);
}

function startAnimate(){
  timer_ret_val = false;
  isContinue = true;
  console.log(d3.select('#slider6'));
  var cntVal = parseFloat(d3.select("#path_9502_9511").attr("T"));//Can't it be cahnged to the value from slider?
  startTransition(cntVal);
  //console.log("push start: "  + timerCurrentValue);
}

function getDataForCurrentMinute(minutes){
  $.ajax({
  url: "http://localhost:3000/datafromtime/"+minutes,
  dataType: "jsonp",
  success: function(result){
    //console.log(result);
    update(result);
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

function updateFromSliderValue(value,isDragged){
  var calculatedTimeValue = 0;
  if(!isDragged){
    calculatedTimeValue = percentageToMinutes(value);
  }
  else{
    calculatedTimeValue = value*60;
  }

  d3.select('#slider3text').text(calculatedTimeValue.toFixed(0));//*60);

  getDataForCurrentMinute(calculatedTimeValue.toFixed(0));

  //console.log("value: " + value);
  var selectPath = d3.select("#path_9502_9511");
  selectPath.attr("T",calculatedTimeValue);
  var strokeStr = "rgba(255,0,0," + (value/100) + ")";

  var tmp = 0.25 + (value/100);
  selectPath
    .transition()
    .duration(0)
    .style("stroke","rgb(255,0,0)")
    .style("stroke-opacity","."+tmp)
    .attr("T",calculatedTimeValue);

  var selectPath2 = d3.select("#path_9502_9501");
  selectPath2.attr("T",calculatedTimeValue);
  if(value >= 50){
    var tmp2 = 0.25 + (value-50)/100;
    selectPath2
      .transition()
      .delay(0)
      .duration(0)
      .style("stroke","rgb(255,0,0)")
      .style("stroke-opacity","."+tmp2)
      .attr("T",calculatedTimeValue);
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

function update(data){
  for(var key in data) {
    if(typeof data[key].north === 'object') {
      var timeTabledDate = parseDate(data[key].north.TimeTabledDateTime);
      var expectedDate = parseDate(data[key].north.ExpectedDateTime);
      var pendeltagDelay = Math.abs(timeTabledDate - expectedDate)/60000;
      if(pendeltagDelay != 0) {
        var id = key.substring(3);
        d3.select("#station_"+id).style("fill","rgb(162,26,"+pendeltagDelay*10 + ")");
        // console.log(pendeltagDelay + " *---* " + id);
      }
      else {
        d3.select("#station_"+id).style("fill","rgb(26,115,0)");
      }
    }
  }
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