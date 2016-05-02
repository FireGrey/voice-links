/*

Voice Links Record Streams
Initial Commit: 02/05/16

Use: When a user clicks the record button, gather all streams and begin to record them
Note: Must be called before webrtc.js

*/

var media_recorder;
var time_interval = 5000; // time of each audio segment in milliseconds.
var index = 1;
var audios_container = document.getElementById('audios-container');
var recording = false; // Am I recording yet?

document.querySelector('#start-recording').onclick = function() {
	this.disabled = true;
	recording = true; // I am recording!

	// Get streams from easyRTC
	begin_record(getLocalStream());
};

document.querySelector('#stop-recording').onclick = function() {
	this.disabled = true;
	media_recorder.stop();
	media_recorder.stream.stop();
	document.querySelector('#pause-recording').disabled = true;
	document.querySelector('#start-recording').disabled = false;
	recording = false; // I have stopped recording
};

document.querySelector('#pause-recording').onclick = function() {
	this.disabled = true;
	media_recorder.pause();
	document.querySelector('#resume-recording').disabled = false;
};

document.querySelector('#resume-recording').onclick = function() {
	this.disabled = true;
	media_recorder.resume();
	document.querySelector('#pause-recording').disabled = false;
};

document.querySelector('#save-recording').onclick = function() {
	this.disabled = true;
	media_recorder.save();
};

function begin_record(stream) {
	// Create new MediaSteamRecorder from media-stream-record.js
	var media_recorder = new MediaStreamRecorder(stream);
	// Save in .ogg file format
	media_recorder.mimeType = 'audio/ogg';
	// Set the stream
	media_recorder.stream = stream;
	//media_recorder.audioChannels = !!document.getElementById('left-channel').checked ? 1 : 2;

	// ondataavailable is an event (like 'onclick()') which fires when blog data is available
	media_recorder.ondataavailable = function(blob) {
		var a = document.createElement('a');
		a.target = '_blank';
		a.innerHTML = 'Open Recorded Audio No. ' + (index++) + ' (Size: ' + neaten_bytes(blob.size) + ') Time Length: ' + neaten_time(time_interval);

		a.href = URL.createObjectURL(blob);

		audios_container.appendChild(a);
		audios_container.appendChild(document.createElement('hr'));
	};

	// get blob after specific time interval
	media_recorder.start(time_interval);

	document.querySelector('#stop-recording').disabled = false;
	document.querySelector('#pause-recording').disabled = false;
	document.querySelector('#save-recording').disabled = false;
}

// Don't let them start recording until page is fully loaded - can probably be removed
window.onbeforeunload = function() {
	document.querySelector('#start-recording').disabled = false;
};

// convert bytes to megabytes/etc http://goo.gl/B3ae8c
function neaten_bytes(bytes) {
	var k = 1000;
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Bytes';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
		return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// convert time to seconds or whatever http://goo.gl/6QNDcI
function neaten_time(milliseconds) {
	var data = new Date(milliseconds);
	return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
}
