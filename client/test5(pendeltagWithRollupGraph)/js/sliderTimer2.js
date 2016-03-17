var SliderTimer = function(cm) {

  var currentMinute = cm;
  var siteids = [];
  var sliderHandle;

  var speed = 60;

  // var timer_ret_val = false;
  // var continueTimerVal = false;
  // var isContinue = false;
  // var timerCurrentValue = 0;
  // var last = 0;
  // var lastCalledMinute;
  //
  // var speed = 1 ;//times normal speed!
  //
  // var maxScaleofSlider = (3600*24)*10/speed;
  // var currentPositionOfSlider = 0;

  this.updateSliderValue = function(value, isDragged) {
    value *= 60;
    currentMinute = value.toFixed(0);
    console.log(currentMinute);
  }

  function updateSliderHandle() {
    if (sliderHandle !== undefined) {
      var percent = currentMinute / 1440 * 100;
      sliderHandle.transition().duration(10).style("left",percent+"%");
    }
  }

  this.setCurrentMinute = function(cm) {
    currentMinute = cm;
    updateSliderHandle();
  }

  this.setTrainData = function(sids) {
    siteids = [];
    for (var i = 0; i < sids.length; i++) {
      siteids.push(sids[i].id);
    }
  }

  this.setSliderHandle = function(sh) {
    sliderHandle = sh;
  }
  // setInterval(getDelayData(), speed);
}
