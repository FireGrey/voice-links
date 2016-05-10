/*

Voice Links Button Management
Initial Commit: 02/05/16

Use: Any HTML buttons that depend on JS are defined in here.
Note: Must be called after HTML button has been rendered in DOM - so include at the bottom of room.php

*/
var files_saved = 0;
var begin_record_timestamp = ''; // we populate this with the timestamp in milliseconds that a user begins recording

// Don't let them start recording if page is about to be unloaded
// This is mostly useless afaik... not that we're gonna remove it
window.onbeforeunload = function() {
	document.getElementById('start-recording').disabled = false;
};

document.getElementById('start-recording').onclick = function() {
	this.disabled = true;
	recording = true; // I am recording!
    
	//Record Host's Stream
	var host_user_id = easyrtc.myEasyrtcid;
    var main_stream = easyrtc.getLocalStream();
    record_handle(main_stream, host_user_id);
	//Record the streams of peers
    for (var i = 0; i < media_stream_list.length; i++) {   
		var user_easyrtcid = media_stream_list[i][0];	
        var user_stream = media_stream_list[i][1];
        record_handle(user_stream, user_easyrtcid);
    }
    
    // enable the ability to stop recording now we have started
    document.getElementById('stop-recording').disabled = false;
	//Warning about multiple recordings in one session (without a refresh)
    if (files_saved == 1) {
        document.getElementById('stop-recording').innerHTML = "Caution: Out of Scope";
    }

    // Get timestamp that recording begins
    begin_record_timestamp = Date.now();
};

document.getElementById('stop-recording').onclick = function() {
	this.disabled = true;
	// stop recording all streams
    for (var i = 0; i < num_recording_streams; i++) {
        current_recordings[i][1].stop();
        //current_recordings[i][1].stream.stop();
    }

	document.getElementById('save-recording').disabled = false;
	recording = false; // I have stopped recording
	//Warning about multiple recordings
	if (files_saved == 1) {
		document.getElementById('save-recording').innerHTML = "Have fun with your duplicate files";
	}
};

document.getElementById('save-recording').onclick = function() {
	this.disabled = true;
	for (var i = 0; i < num_recording_streams; i++) {
		// calcualte offset for peers in milliseconds if offset exists
		if (current_recordings[i][2] != '0') {
			var offset = current_recordings[i][2] - begin_record_timestamp;
		} else {
			var offset = current_recordings[i][2];
		}
		// generate filename
		var save_name = current_recordings[i][0] + "-" + offset;
		// save file
        current_recordings[i][1].save(null, save_name);
	}
	document.getElementById('start-recording').disabled = false;
	//Warning about multiple recordings
	document.getElementById('start-recording').innerHTML = "Done!"; // We don't have to give away that clicking this again will break everything ;)
	files_saved = 1;
};
