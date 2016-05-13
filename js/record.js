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

// Record peer audio in stereo
// 1 == Mono
// 2 == Stereo
var stereo = 1;

var current_recordings = [];
var time_interval = 5000; // Time of each audio segment in milliseconds
var recording = false; // Am I recording yet?
var num_recording_streams = 0; // Amount of streams that are currently being recorded

function record_handle(stream, filename, record_timestamp) {
	// Check if offset isn't set
	if (typeof record_timestamp == 'undefined') {
		console.log('Record timestamp not set. Set it!');
	}
	// Create temporary MediaRecorder object from media-stream-record.js to push to array later
	var recorder_temp = new MediaStreamRecorder(stream);
	// Save in .wav file format
	recorder_temp.mimeType = 'audio/wav';
	// Set the stream
	recorder_temp.stream = stream;
	// Mono audio (instead of stereo)
	recorder_temp.audioChannels = stereo;

	// ondataavailable is an event (like 'onclick()') which fires when blog data is available
	recorder_temp.ondataavailable = function(blob) {
	};

	// Get blob after specific time interval
	recorder_temp.start(time_interval);
	// Add the new recorder to the array
	current_recordings.push([filename, recorder_temp, record_timestamp]);
	num_recording_streams++;
}
