/*

Voice Links Button Management
Initial Commit: 02/05/16

Use: Any HTML buttons that depend on JS are defined in here.
Note: Must be called after HTML button has been rendered in DOM - so include at the bottom of room.php

*/
var files_saved = 0;
// Don't let them start recording if page is about to be unloaded
// This is mostly useless afaik
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
	//Record the streams of the other users
    for (var i = 0; i < media_stream_list.length; i++) {   
		var user_easyrtcid = media_stream_list[i][0];	
        var user_stream = media_stream_list[i][1];
        record_handle(user_stream, user_easyrtcid);
    }
    
    document.getElementById('stop-recording').disabled = false;
	//Warning about multiple recordings
    if (files_saved == 1) {
        document.getElementById('stop-recording').innerHTML = "Don't Expect Results";
    }
};

document.getElementById('stop-recording').onclick = function() {
	this.disabled = true;
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
        current_recordings[i][1].save(null, current_recordings[i][0]);
	}
	document.getElementById('start-recording').disabled = false;
	//Warning about multiple recordings
	document.getElementById('start-recording').innerHTML = "Broken";
	files_saved = 1;
};
