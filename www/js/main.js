//Libraries (commented lines are loaded inside the previous line callback)
require(['lib/plugins/domReady!'], domReady);
  // require(["motion_display"], anim_init);
    // require(["lib/pulse_generator"], sound_init);

//Globar vars
  //constants
  var VIEWPORT_WIDTH = 320,
      VIEWPORT_HEIGHT = 480,
      SAMPLE_RATE = 44100,
      MIN_BPM = 10,
      MAX_BPM = 230,
      TEMPO_MARKS = [
        [0,   "lento assai"],
        [59,  "largo"],
        [65,  "larghetto"],
        [75,  "adagio"],
        [100, "andante"],
        [107, "moderatto"],
        [119, "allegro"],
        [139, "vivace"],
        [167, "presto"],
        [199, "prestissimo"]
      ],
      UI_SLIDER_MIN_ANGLE = 8,
      UI_SLIDER_MAX_ANGLE = 82;


  //elements
  var bpm_el,
      tempo_mark_el,
      time_signature_el,
      time_signature_button_el,
      time_signature_dialog_el,
      time_signature_submit_button_el,
      mute_button_el,
      play_pause_button_el,
      decrease_speed_button_el,
      increase_speed_button_el,
      motion_display_el,
      speed_slider_el,
      speed_slider_axis_el,
      slider_bg_el,
      pendulum_el;

  //variables
  var sampleRate = SAMPLE_RATE, moveCount=0;
  var bpm_speed, beat_time_ms, beat_time, buffer_interval, time_signature, audioDestination, angle;

//Helpers
function bpmToMiliseconds(bpm_value){
  return (60 / bpm_value) * 1000;
}
function bpmToTempoMark(bpm_value){
  if (bpm_value > TEMPO_MARKS[9][0]){ return TEMPO_MARKS[9][1];}
  if (bpm_value > TEMPO_MARKS[8][0]){ return TEMPO_MARKS[8][1];}
  if (bpm_value > TEMPO_MARKS[7][0]){ return TEMPO_MARKS[7][1];}
  if (bpm_value > TEMPO_MARKS[6][0]){ return TEMPO_MARKS[6][1];}
  if (bpm_value > TEMPO_MARKS[5][0]){ return TEMPO_MARKS[5][1];}
  if (bpm_value > TEMPO_MARKS[4][0]){ return TEMPO_MARKS[4][1];}
  if (bpm_value > TEMPO_MARKS[3][0]){ return TEMPO_MARKS[3][1];}
  if (bpm_value > TEMPO_MARKS[2][0]){ return TEMPO_MARKS[2][1];}
  if (bpm_value > TEMPO_MARKS[1][0]){ return TEMPO_MARKS[1][1];}
  return TEMPO_MARKS[0][1];
}
function updateSpeedSliderPosition(bpm_value){
  var percent = 1 - ( (MAX_BPM - MIN_BPM) - (bpm_value - MIN_BPM) ) / (MAX_BPM - MIN_BPM);
  var angle = Math.round((UI_SLIDER_MAX_ANGLE - UI_SLIDER_MIN_ANGLE) * percent + UI_SLIDER_MIN_ANGLE);
  speed_slider_axis_el.style.transform = "rotate("+angle+"deg)";
  speed_slider_el.style.transform = "rotate(-"+angle+"deg)";
  slider_bg_el.style.transform = "rotate("+angle+"deg)";
}
function getAngle(x, y){
  var deltaX = x - VIEWPORT_WIDTH,
      deltaY = y - VIEWPORT_HEIGHT,
      angle = ( Math.atan2(deltaY,deltaX) / (Math.PI/180) ) + 180;
  angle = Math.max( UI_SLIDER_MIN_ANGLE, Math.min( UI_SLIDER_MAX_ANGLE, angle ) );
  return Math.round(angle);
}

function setSpeed(bpm_value){
  bpm_speed = Math.max( MIN_BPM, Math.min(MAX_BPM, bpm_value) );
  beat_time_ms = bpmToMiliseconds(bpm_speed);
  beat_time = Math.round((beat_time_ms / 1000) * sampleRate);
  bpm_el.textContent = bpm_speed;
  tempo_mark_el.textContent = bpmToTempoMark(bpm_speed);
  updateSpeedSliderPosition(bpm_speed);
}
function setTimeSignature(time_signature_value){
  time_signature = time_signature_value;
  time_signature_el.textContent = time_signature_value;
  time_signature_button_el.textContent = time_signature_value;
}

function resetPendulum(){
  startTime = Date.now() - beat_time_ms / 2;
}
function startMetronome(){
  resetPendulum();
  start();
}
function stopMetronome(){
  clearInterval(buffer_interval);
  buffer_interval = undefined;
  resetPendulum();
  myanim();
}
function increaseSpeed(event){
  event.preventDefault();
  event.stopPropagation();
  setSpeed(++bpm_speed);
}
function decreaseSpeed(event){
  event.preventDefault();
  event.stopPropagation();
  setSpeed(--bpm_speed);
}
function muteSoundToggle(event){
  event.preventDefault();
  event.stopPropagation();
  audioDestination.volume = (audioDestination.volume + 1) % 2;
}
function playPauseClicked(event){
  // console.log('playPauseClicked');
  event.preventDefault();
  event.stopPropagation();
  if (event.target.className === 'disabled') { return false; }
  // console.log(buffer_interval);
  if (typeof buffer_interval !== 'undefined'){
    // alert('stop');
    stopMetronome();
  } else {
    // alert('play');
    startMetronome();
  }
}
function openTimeSignatureDialog(event){
  event.preventDefault();
  event.stopPropagation();
  time_signature_dialog_el.style.display = "inline-block";
}
function timeSignatureDialogSubmit(event){
  event.preventDefault();
  event.stopPropagation();
  for (var i=0; i < time_signature_dialog.elements['option'].length; i++){
      if (time_signature_dialog.elements['option'][i].checked){
        setTimeSignature(time_signature_dialog.elements['option'][i].value);
        time_signature_dialog_el.style.display = "none";
        return false;
      }
  }
}
function timeSignatureDialogCancel(event){
  event.preventDefault();
  event.stopPropagation();
  time_signature_dialog_el.style.display = "none";
}
function sliderDown(event){
  event.preventDefault();
  event.target.dataset.state = 'down';
  if (typeof buffer_interval !== 'undefined'){
    play_pause_button_el.dataset.before_slider = 'on';
    stopMetronome();
  }else{
    play_pause_button_el.dataset.before_slider = 'off';
  }
  if ((typeof event.touches != "undefined") && (event.touches.length == 1)){ // one finger touchs only
      oneFingerOnly = true;
      var touch = event.touches[0];  // finger #1
      //update variables
      event.target.dataset.startX = touch.pageX;
      event.target.dataset.startY = touch.pageY;
    } else {
      event.target.dataset.oneFingerOnly = false;
    }

  motion_display_el.className = "disabled";
}


function sliderMove(event){
  var x,
      y,
      touch,
      percent,
      bpm_value;
  if((typeof event.touches != "undefined")&&(event.touches.length == 1)){
    touch = event.touches[0];
    x = touch.pageX;
    y = touch.pageY;
  }else{
    x = event.clientX;
    y = event.clientY;
  }
  if (y > VIEWPORT_HEIGHT){ return }
  if (  event.target.dataset.state === 'down'){
    angle = getAngle(x, y);
    percent = (1 - ((UI_SLIDER_MAX_ANGLE - angle) / (UI_SLIDER_MAX_ANGLE - UI_SLIDER_MIN_ANGLE)));
    bpm_value = Math.round((MAX_BPM - MIN_BPM) * percent + MIN_BPM)
    setSpeed(bpm_value);
  }
}
function sliderUp(event){
  resetPendulum();
  event.target.dataset.state = 'up';
  if (play_pause_button_el.dataset.before_slider === 'on'){
    startMetronome();
  }
}
//Animation script loaded
function anim_init(){
  document.querySelector("#pendulum").className='';
  myanim();
  require(["lib/pulse_generator"], sound_init);
}
//Sound related initializations
function sound_init(){
  //enable play button
  document.querySelector("#play_pause_button").className='';
}
//Main init
function domReady(doc){
  //assign elements
  bpm_el = doc.querySelector("#bpm");
  tempo_mark_el = doc.querySelector("#tempo_mark");
  time_signature_el = doc.querySelector("#time_signature");
  time_signature_button_el = doc.querySelector("#time_signature_button");
  time_signature_dialog_el = doc.querySelector("#time_signature_dialog");
  time_signature_cancel_button_el = doc.querySelector("#time_signature_cancel_button");
  time_signature_submit_button_el = doc.querySelector("#time_signature_submit_button");
  mute_button_el = doc.querySelector("#mute_button");
  play_pause_button_el = doc.querySelector("#play_pause_button");
  decrease_speed_button_el = doc.querySelector("#decrease_speed_button");
  increase_speed_button_el = doc.querySelector("#increase_speed_button");
  motion_display_el = doc.querySelector("#motion_display");
  speed_slider_el = doc.querySelector("#speed_slider");
  speed_slider_axis_el = doc.querySelector("#speed_slider_axis");
  slider_bg_el = doc.querySelector("#slider_bg"),
  pendulum_el =  doc.querySelector("#pendulum");

  //assign values
  setSpeed(Number(bpm_el.textContent));
  setTimeSignature(time_signature_el.textContent);

  //load more modules
  require(["motion_display"], anim_init);


  //assign events
  mute_button_el.addEventListener('click', muteSoundToggle, true);
  // mute_button_el.addEventListener('touchstart', muteSoundToggle, true);
  // play_pause_button_el.addEventListener('touchstart', playPauseClicked, true);
  play_pause_button_el.addEventListener('click', playPauseClicked, true);
  decrease_speed_button_el.addEventListener('click', decreaseSpeed, true);
  decrease_speed_button_el.addEventListener('touchstart', decreaseSpeed, true);
  increase_speed_button_el.addEventListener('click', increaseSpeed, true);
  increase_speed_button_el.addEventListener('touchstart', increaseSpeed, true);
  time_signature_button_el.addEventListener('click', openTimeSignatureDialog, true);
  time_signature_button_el.addEventListener('touchstart', openTimeSignatureDialog, true);
  time_signature_submit_button_el.addEventListener('click', timeSignatureDialogSubmit, true);
  time_signature_submit_button_el.addEventListener('touchstart', timeSignatureDialogSubmit, true);
  time_signature_cancel_button_el.addEventListener('click', timeSignatureDialogCancel, true);
  time_signature_cancel_button_el.addEventListener('touchstart', timeSignatureDialogCancel, true);
  speed_slider_el.addEventListener('mousedown', sliderDown, true);
  speed_slider_el.addEventListener('mousemove', sliderMove, true);
  speed_slider_el.addEventListener('mouseup', sliderUp, true);
  speed_slider_el.addEventListener('touchstart', sliderDown, false);
  speed_slider_el.addEventListener('touchmove', sliderMove, false);
  speed_slider_el.addEventListener('touchend', sliderUp, false);
}








