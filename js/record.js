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
var recording = false; // Am I recording yet?
var num_recording_streams = 0; // Amount of streams that are currently being recorded (minus 1)

function record_handle(stream, filename, record_timestamp) {
	// check if offset is set
	if (typeof record_timestamp == 'undefined') {
		// if 'record_timestamp' is undefined it means user was already in the room when recording begun
		// therefore they have no offset;
		record_timestamp = '0'; // zero millisecond offset
	}
	//Create temporary MediaRecorder object from media-stream-record.js to push to array later
	var recorder_temp = new MediaStreamRecorder(stream);
	// Save in .ogg file format - Chrome ignores this for some reason and records in .webm anyway...
	recorder_temp.mimeType = 'audio/ogg';
	// Set the stream
	recorder_temp.stream = stream;
	// Mono audio (instead of stereo)
	recorder_temp.audioChannels = 1; // Is this important?

	// ondataavailable is an event (like 'onclick()') which fires when blog data is available
	recorder_temp.ondataavailable = function(blob) {
		// for debugging - not used anymore
	};

	// get blob after specific time interval
	recorder_temp.start(time_interval);
	//Add the new recorder to the array
	current_recordings.push([filename, recorder_temp, record_timestamp]);
	num_recording_streams++;
}
