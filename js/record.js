/*

Voice Links Record Streams
Initial Commit: 02/05/16

Use: When a user clicks the record button, gather all streams and begin to record them
Note: Must be called before webrtc.js

*/

// Array of all media recorder Objects
//[n][0] == easyrtcid String
//[n][1] == MediaStreamRecorder Object
//[n][2] == timestamp in milliseconds when record begins
var current_recordings = [];

var time_interval = 5000; // time of each audio segment in milliseconds.
var index = 1;
var recording = false; // Am I recording yet?

// Amount of streams that are currently being recorded (minus 1)
var num_recording_streams = 0;

function record_handle(stream, filename, record_timestamp) {
	// check if offset is set
	if (typeof record_timestamp == 'undefined') {
		// if 'record_timestamp' is undefined it means user was already in channel when recording begun
		// therefore they have no offset and hense record_timestamp == 0;
		record_timestamp = '0';
	}
	//Create temporary MediaRecorder object from media-stream-record.js to push to array later
	var recorder_temp = new MediaStreamRecorder(stream);
	// Save in .ogg file format
	recorder_temp.mimeType = 'audio/ogg';
	// Set the stream
	recorder_temp.stream = stream;
	// Mono audio (instead of stereo)
	recorder_temp.audioChannels = 1; // Is this important?

	// ondataavailable is an event (like 'onclick()') which fires when blog data is available
	recorder_temp.ondataavailable = function(blob) {
		// this was really only for testing tbh....

		// var audios_container = document.getElementById('audios-container');
		// var a = document.createElement('a');
		// a.target = '_blank';
		// a.innerHTML = 'Open Recorded Audio No. ' + (index++) + ' (Size: ' + neaten_bytes(blob.size) + ') Time Length: ' + neaten_time(time_interval);

		// a.href = URL.createObjectURL(blob);

		// audios_container.appendChild(a);
		// audios_container.appendChild(document.createElement('hr'));
	};

	// get blob after specific time interval
	recorder_temp.start(time_interval);
	//Add the new recorder to the array
	current_recordings.push([filename, recorder_temp, record_timestamp]);
	num_recording_streams++;
}

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
