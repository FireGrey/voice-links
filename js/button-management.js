/*

Voice Links Button Management
Initial Commit: 02/05/16

Use: Any HTML buttons that depend on JS are defined in here.
Note: Must be called after HTML button has been rendered in DOM - so include at the bottom of room.php

*/

// Don't let them start recording if page is about to be unloaded
// This is mostly useless afaik
window.onbeforeunload = function() {
	document.getElementById('start-recording').disabled = false;
};

document.getElementById('start-recording').onclick = function() {
	this.disabled = true;
	recording = true; // I am recording!
	// Get streams from easyRTC
	// Just getting our local stream atm to debug
	// Ultimately this will need to get all the current streams from easyrtc and record them all,
    // probably in some sort of loop?
    
    var mainStream = easyrtc.getLocalStream();
    record_handle(mainStream);
    for (var i = 0; i < peers.length; i++) {        
        var user = peers[i];
        //mainStream.addTrack(user);
        record_handle(user);
    }
    //record_handle(mainStream);
    
    document.getElementById('stop-recording').disabled = false;
	//document.getElementById('pause-recording').disabled = false;
	//document.getElementById('save-recording').disabled = false;
};

document.getElementById('stop-recording').onclick = function() {
	this.disabled = true;
    for (var i = 0; i < recordingStreams; i++) {
        media_recorder[i].stop();
        media_recorder[i].stream.stop();
    }
	//document.getElementById('pause-recording').disabled = true;
	//document.getElementById('start-recording').disabled = false;
    document.getElementById('save-recording').disabled = false;
	recording = false; // I have stopped recording
};

document.getElementById('pause-recording').onclick = function() {
	this.disabled = true;
    for (var i = 0; i < recordingStreams; i++) {
        media_recorder[i].pause();
    }
	document.getElementById('resume-recording').disabled = false;
};

document.getElementById('resume-recording').onclick = function() {
	this.disabled = true;
    for (var i = 0; i < recordingStreams; i++) {
        media_recorder[i].resume();
    }
	document.getElementById('pause-recording').disabled = false;
};

document.getElementById('save-recording').onclick = function() {
	this.disabled = true;
    for (var i = 0; i < recordingStreams; i++) {
        media_recorder[i].save();
    }
    document.getElementById('start-recording').disabled = false;
    document.getElementById('start-recording').value = "<Broken?>";
};