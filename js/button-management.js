/*

Voice Links Button Management
Initial Commit: 02/05/16

Use: Any HTML buttons that depend on JS are defined in here.
Note: Must be called after HTML button has been rendered in DOM - so include at the bottom of room.php

*/

// Don't let them start recording if page is about to be unloaded
window.onbeforeunload = function() {
	document.getElementById('start-recording').disabled = false;
};

document.getElementById('start-recording').onclick = function() {
	this.disabled = true;
	recording = true; // I am recording!

	// Get streams from easyRTC
	// Just getting our local stream atm to debug
	record_handle(easyrtc.getLocalStream());
};

// The problem here is media_recorder is set within the record_handle function meaning it
// can't be referenced too outside that function.
// Investigation into how the code: https://www.webrtc-experiment.com/msr/audio-recorder.html
// overcomes this issue is required.

document.getElementById('stop-recording').onclick = function() {
	this.disabled = true;
	media_recorder.stop();
	media_recorder.stream.stop();
	document.getElementById('pause-recording').disabled = true;
	document.getElementById('start-recording').disabled = false;
	recording = false; // I have stopped recording
};

document.getElementById('pause-recording').onclick = function() {
	this.disabled = true;
	media_recorder.pause();
	document.getElementById('resume-recording').disabled = false;
};

document.getElementById('resume-recording').onclick = function() {
	this.disabled = true;
	media_recorder.resume();
	document.getElementById('pause-recording').disabled = false;
};

document.getElementById('save-recording').onclick = function() {
	this.disabled = true;
	media_recorder.save();
};