//shim from http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+
          'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}())

var time,
    startTime,
    lastTime,
    animation_running;

function quadInOut(t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
        return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

function render(time) {
  if ((time - lastTime) > 400){
    //animation too slow to render
    motion_display_el.className = "disabled";
    // alert('shutting animation down')
    return false;
  }
  if (time === undefined)
    time = Date.now();
  if (startTime === undefined)
    startTime = time;
    var deltaT = (time - startTime)%(beat_time_ms*2);
    // bpm_el.textContent = (time - lastTime);
    lastTime = time;
    if ( deltaT < beat_time_ms ) {
      var rotation = Math.round(quadInOut(deltaT, -42, 39, beat_time_ms));
    }else{
      var rotation = Math.round(quadInOut((deltaT-beat_time_ms), -3, -39, beat_time_ms));
    }
    motion_display_el.style.transform = "rotate(" + rotation + "deg)";
    return true;
}

function myanim(){
  animation_running = true;
  // alert(beat_time_ms);
  lastTime = Date.now();
  (function animloop(){
    if (animation_running = render(Date.now())){
      motion_display_el.className = "";
      requestAnimationFrame(animloop, null);
    }
  })();
}

