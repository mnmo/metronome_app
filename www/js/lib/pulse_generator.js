// code adapted from https://developer.mozilla.org/en-US/docs/Creating_a_Web_based_tone_generator
function AudioDataDestination(sampleRate, readFn) {
  // Initialize the audio output.
  var audio = new Audio();
  audio.mozSetup(1, sampleRate);

  var currentWritePosition = 0;
  var prebufferSize = sampleRate / 2; // buffer 500ms
  var tail = null;

  // The function called with regular interval to populate
  // the audio output buffer.
  buffer_interval = setInterval(function() {
    var written;
    // Check if some data was not written in previous attempts.
    if(tail) {
      written = audio.mozWriteAudio(tail);
      currentWritePosition += written;
      if(written < tail.length) {
        // Not all the data was written, saving the tail...
        tail = tail.subarray(written);
        return; // ... and exit the function.
      }
      tail = null;
    }

    // Check if we need add some data to the audio output.
    var currentPosition = audio.mozCurrentSampleOffset();
    var available = currentPosition + prebufferSize - currentWritePosition;
    if(available > 0) {
      // Request some sound data from the callback function.
      var soundData = new Float32Array(parseFloat(available));
      readFn(soundData);

      // Writing the data.
      written = audio.mozWriteAudio(soundData);
      if(written < soundData.length) {
        // Not all the data was written, saving the tail.
        tail = soundData.slice(written);
      }
      currentWritePosition += written;
    }
  }, 100);
  return audio;
}

// Control and generate the sound.
var d = 0,
    stop = false,
    currentSoundSample,
    downbeat,
    offbeat;

function requestSoundData(soundData) {
  if (stop) {
    return; // no sound selected
  }
  var duration;
  var data;
  var k;
  if (time_signature == 'none'){
    frequency = offbeat;
  }
  for (var i=0, size=soundData.length; i<size; i++) {
    currentSoundSample++;
    if(currentSoundSample % beat_time < 900){
      if (frequency == offbeat){
        if (currentSoundSample % beat_time == 0){
          soundData[i] = offbeat;
        }else{
          soundData[i] = 0;
        }
      }else{
        k = 2* Math.PI * frequency / sampleRate;
        soundData[i] = Math.sin(k * currentSoundSample);
      }
    }else if (currentSoundSample % beat_time == 1000){
      d++;
      switch (time_signature){
        case '2/4':
        case '2/2':
          frequency = (d % 2 == 0 ) ? downbeat : offbeat;
          motion_display_el.textContent = '..';
          break;
        case '3/4':
        case '3/8':
          frequency = (d % 3 == 0 ) ? downbeat : offbeat;
          motion_display_el.textContent = '...';
          break;
        case '4/4':
          frequency = (d % 4 == 0 ) ? downbeat : offbeat;
          motion_display_el.textContent = '....';
          break;
        case '5/4':
          frequency = (d % 5 == 0 ) ? downbeat : offbeat;
          motion_display_el.textContent = '.....';
          break;
        case '6/8':
          frequency = (d % 6 == 0 ) ? downbeat : ((d % 6 == 3) ? onbeat : offbeat);
          motion_display_el.textContent = '......';
          break;
        case '7/8':
          frequency = (d % 7 == 0 ) ? downbeat : ((d % 7 == 2)||(d % 7 == 4) ? onbeat : offbeat);
          motion_display_el.textContent = '.......';
          break;
        case '9/8':
          frequency = (d % 9 == 0 ) ? downbeat : ((d % 3 == 0) ? onbeat : offbeat);
          motion_display_el.textContent = '.........';
          break;
        case '12/8':
          frequency = (d % 12 == 0 ) ? downbeat : ((d % 3 == 0) ? onbeat : offbeat);
          motion_display_el.textContent = '............';
          break;
        case 'none':
        default:
          frequency = offbeat;
          motion_display_el.textContent = '';
          break;
      }
      motion_display_el.textContent = setCharAt(motion_display_el.textContent,((d-1) % Number(time_signature.substring(0,time_signature.indexOf('/')))),'o');

      soundData[i] = 0;
    } else {
      soundData[i] = 0;
    }
  }
}


function start() {
  console.log(start);
  c = 0;
  d = 0;
  currentSoundSample = 0;
  downbeat = 880;
  offbeat = 1;
  onbeat = 400;
  frequency = downbeat;
  delete audioDestination;
  audioDestination = new AudioDataDestination(sampleRate, requestSoundData);
}



