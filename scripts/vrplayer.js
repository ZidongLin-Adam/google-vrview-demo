/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var vrView;
var playButton;
var muteButton;

window.addEventListener('load', onVrViewLoad);

function onVrViewLoad() {
  // Load VR View.
  vrView = new VRView.Player('#vrplayer', {
    //参数详细介绍看这里https://github.com/googlevr/vrview/tree/links-to-build
    video: '/video/PPAP.mp4',
    //image: '',
    width:'100%',
    height:'100%',
    //preview: '',
    is_stereo: false,
    //is_debug: true,
    is_vr_off: false,
    //is_autopan_off: true,
    //default_yaw: 0,
    is_yaw_only: false,
    loop: true,
    //hide_fullscreen_button: true,
    //volume: 0.4,
    //muted: true,
    //default_heading: 90,
  });
  
  playButton = document.querySelector('#toggleplay');
  muteButton = document.querySelector('#togglemute');
  volumeRange = document.querySelector('#volumerange');
  timeContainer = document.querySelector('#time');

  playButton.addEventListener('click', onTogglePlay);
  muteButton.addEventListener('click', onToggleMute);
  volumeRange.addEventListener('change', onVolumeChange);
  volumeRange.addEventListener('input', onVolumeChange);

  // If you set mute: true, uncomment the line bellow.
  // muteButton.classList.add('muted');

  vrView.on('ready', onVRViewReady);

  vrView.on('play', function() {
    console.log('media play');
    console.log(vrView.getDuration());
  });
  vrView.on('pause', function() {
    console.log('media paused');
  });
  vrView.on('timeupdate', function(e) {
    var current = formatTime(e.currentTime);
    var duration = formatTime(e.duration);
    timeContainer.innerText = current + ' | ' + duration;
    console.log('currently playing ' + current + ' secs.');
  });
  vrView.on('ended', function() {
    console.log('media ended');
    playButton.classList.add('paused');
  });
}

function onVRViewReady() {
  console.log('vrView.isPaused', vrView.isPaused);
  // Set the initial state of the buttons.
  if (vrView.isPaused) {
    playButton.classList.add('paused');
  } else {
    playButton.classList.remove('paused');
  }
}

function onTogglePlay() {
  if (vrView.isPaused) {
    vrView.play();
    playButton.classList.remove('paused');
  } else {
    vrView.pause();
    playButton.classList.add('paused');
  }
}

function onToggleMute() {
  var isMuted = muteButton.classList.contains('muted');
  vrView.mute(!isMuted);
  muteButton.classList.toggle('muted');
}

function onVolumeChange(e) {
  vrView.setVolume(volumeRange.value / 100);
}

function formatTime(time) {
  time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

  var minutes = Math.floor(time / 60) % 60;
  var seconds = Math.floor(time % 60);

  minutes = minutes <= 0 ? 0 : minutes;
  seconds = seconds <= 0 ? 0 : seconds;

  var result = (minutes < 10 ? '0' + minutes : minutes) + ':';
  result += seconds < 10 ? '0' + seconds : seconds;
  return result;
}
