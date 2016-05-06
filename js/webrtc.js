// new users must call everyone else
var called_before = false; // is this a new user? - false means they haven't called everyone yet

//Array to hold all the MediaStream objects from each user
//[n][0] == easyrtcid String
//[n][1] == MediaStream Object
var media_stream_list = [][];

function roomListener(roomName, otherPeers) {
	var otherClientDiv = document.getElementById('other-clients');
	while (otherClientDiv.hasChildNodes()) {
		otherClientDiv.removeChild(otherClientDiv.lastChild);
	}
	if (!called_before) {
		// i = the other users easyrtcid
		for (var i in otherPeers) {
			// foreach peer call them once
			performCall(i);
		}
		called_before = true; // I have called everyone.
	}
}

function my_init(roomName) {
	easyrtc.setSocketUrl(":8080");
	easyrtc.setRoomOccupantListener(roomListener);
	var connectSuccess = function(myId) {
		console.log("My easyrtcid is " + myId);
	}
	var connectFailure = function(errorCode, errText) {
		console.log(errText);
	}
	easyrtc.enableAudio(true);
	easyrtc.enableVideo(false);

	// Set STUN/TURN config
	easyrtc.setIceUsedInCalls(
		{"iceServers": [
			{url:'stun:stun01.sipphone.com'},
			{url:'stun:stun.ekiga.net'},
			{url:'stun:stun.fwdnet.net'},
			{url:'stun:stun.ideasip.com'},
			{url:'stun:stun.iptel.org'},
			{url:'stun:stun.rixtelecom.se'},
			{url:'stun:stun.schlund.de'},
			{url:'stun:stun.l.google.com:19302'},
			{url:'stun:stun1.l.google.com:19302'},
			{url:'stun:stun2.l.google.com:19302'},
			{url:'stun:stun3.l.google.com:19302'},
			{url:'stun:stun4.l.google.com:19302'},
			{url:'stun:stunserver.org'},
			{url:'stun:stun.softjoys.com'},
			{url:'stun:stun.voiparound.com'},
			{url:'stun:stun.voipbuster.com'},
			{url:'stun:stun.voipstunt.com'},
			{url:'stun:stun.voxgratia.org'},
			{url:'stun:stun.xten.com'},
			{
			url: 'turn:numb.viagenie.ca',
				credential: 'muazkh',
				username: 'webrtc@live.com'
			},
			{
			url: 'turn:192.158.29.39:3478?transport=udp',
			credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
			username: '28224511:1379330808'
			},
			{
			url: 'turn:192.158.29.39:3478?transport=tcp',
			credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
			username: '28224511:1379330808'
			}]
		}
	);

	easyrtc.initMediaSource(
		function(){
			// create or join the room connection
			easyrtc.connect(roomName, connectSuccess, connectFailure);
		},
		connectFailure
	);
}

function performCall(easyrtcid) {
	easyrtc.call(
		easyrtcid,
		function(easyrtcid) { console.log("completed call to " + easyrtcid);},
		function(errorCode, errorText) { console.log("err:" + errorText);},
		function(accepted, bywho) {
			console.log((accepted?"accepted":"rejected") +  " by " + bywho);
		}
	);
}

// Remove elements function
Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for(var i = this.length - 1; i >= 0; i--) {
		if(this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}

easyrtc.setStreamAcceptor(function(callerEasyrtcid, stream) {
	media_stream_list.push([callerEasyrtcid, stream]);
	// create a name tag
	var user_box = document.getElementById('client-list');
	var list_item = document.createElement('li');
	list_item.setAttribute('id', 'label-' + callerEasyrtcid);
	var table = document.createElement('table');
	var table_row_1 = document.createElement('tr');
	var table_cell_1 = document.createElement('td');

	label = document.createElement('span');
	label.textContent = 'User ID:' + callerEasyrtcid;
	
	table_cell_1.appendChild(label);
	table_row_1.appendChild(table_cell_1);

	// create controls for them
	var table_row_2 = document.createElement('tr');
	var table_cell_2 = document.createElement('td');
	var video = document.createElement('video');
	video.setAttribute('id', callerEasyrtcid);
	video.setAttribute('width', '300');
	video.setAttribute('height', '30');
	video.setAttribute('controls', 'controls');

	table_cell_2.appendChild(video);
	table_row_2.appendChild(table_cell_2);

	table.appendChild(table_row_1);
	table.appendChild(table_row_2);
	list_item.appendChild(table);
	user_box.appendChild(list_item);

	easyrtc.setVideoObjectSrc(video, stream);

	// Object has been created, check if I am recording
	if(recording) {
		// If so, add new stream to the record
		begin_record(stream); 	// this more than likely doesn't work but the idea is there
								// we need to watch for new comers and add their stream if a client is currently recording
	}
});

easyrtc.setOnStreamClosed(function(callerEasyrtcid) {
	// gracefully close the connection
	easyrtc.setVideoObjectSrc(document.getElementById(callerEasyrtcid), "");
	// less gracefully remove the box
	document.getElementById(callerEasyrtcid).remove();
	// and label
	document.getElementById('label-' + callerEasyrtcid).remove();
});
