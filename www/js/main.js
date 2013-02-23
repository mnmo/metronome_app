//Libraries
require(['lib/plugins/domReady!'], domReady);
require(["lib/pulse_generator"], sound_init);

//Globar vars
  //elements
  var bpm_el,
      tempo_mark_el,
      time_signature_el,
      mute_button_el,
      play_pause_button_el,
      decrease_speed_button_el,
      increase_speed_button_el,
      motion_display_el;

  //variables
  var sampleRate = 44100;
  var bpm_speed, beat_time, buffer_interval, time_signature, audioDestination;

//Sound related initializations
function sound_init(){
  //enable play button
  document.querySelector("#play_pause_button").className='';
}
function bpmToMiliseconds(bpm_value){
  return (60 / bpm_value) *1000;
}
function bpmToTempoMark(bpm_value){
  var names = [
    "lento assai",
    "largo",
    "larghetto",
    "adagio",
    "andante",
    "moderatto",
    "allegro",
    "vivace",
    "presto",
    "prestissimo"
  ];
  if (bpm_value > 199){   return names[9];}
  if (bpm_value > 167){   return names[8];}
  if (bpm_value > 139){   return names[7];}
  if (bpm_value > 119){   return names[6];}
  if (bpm_value > 107){   return names[5];}
  if (bpm_value > 100){   return names[4];}
  if (bpm_value > 75){    return names[3];}
  if (bpm_value > 65){    return names[2];}
  if (bpm_value > 59){    return names[1];}
  if (bpm_value > 39){    return names[0];}
}
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
function setSpeed(bpm_value){
  bpm_speed = bpm_value;
  beat_time = Math.round((bpmToMiliseconds(bpm_speed) / 1000) * sampleRate);
  bpm_el.textContent = bpm_value;
  tempo_mark_el.textContent = bpmToTempoMark(bpm_value);
}
function increaseSpeed(event){
  setSpeed(++bpm_speed);
}
function decreaseSpeed(event){
  setSpeed(--bpm_speed);
}
function setTimeSignature(time_signature_value){
  time_signature = time_signature_value;
}
function muteSoundToggle(){
  audioDestination.volume = (audioDestination.volume + 1) % 2;
}
function startMetronome(){
  start();
}
function stopMetronome(){
  clearInterval(buffer_interval);
}
function playPauseClicked(event){
  if (event.target.className === 'disabled') { return false; }
  if (event.target.dataset.action === 'play'){
    event.target.dataset.action = 'stop';
    startMetronome();
  } else {
    event.target.dataset.action = 'play';
    stopMetronome();
  }
}
function domReady(doc){
  //assign elements
  bpm_el = doc.querySelector("#bpm");
  tempo_mark_el = doc.querySelector("#tempo_mark");
  time_signature_el = doc.querySelector("#time_signature");
  mute_button_el = doc.querySelector("#mute_button");
  play_pause_button_el = doc.querySelector("#play_pause_button");
  decrease_speed_button_el = doc.querySelector("#decrease_speed_button");
  increase_speed_button_el = doc.querySelector("#increase_speed_button");
  motion_display_el = doc.querySelector("#motion_display");

  //assign values
  setSpeed(Number(bpm_el.textContent));
  setTimeSignature(time_signature_el.textContent);

  //assign events
  mute_button_el.addEventListener('click', muteSoundToggle, true);
  play_pause_button_el.addEventListener('click', playPauseClicked, true);
  decrease_speed_button_el.addEventListener('click', decreaseSpeed, true);
  increase_speed_button_el.addEventListener('click', increaseSpeed, true);
}








