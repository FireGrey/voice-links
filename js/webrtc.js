// new users must call everyone else
var called_before = false; // is this a new user? - false means they haven't called everyone yet
//Array to hold all the MediaStream objects from each user
//[n][0] == easyrtcid String
//[n][1] == MediaStream Object
var media_stream_list = [];
// check if chrome
var is_chrome = !!window.chrome;

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

	easyrtc.setIceUsedInCalls(
		{"iceServers": [
			{url:"stun:stun:stun.l.google.com:19302"},
			{url:'stun:stun1.l.google.com:19302'},
			{url:'stun:stun2.l.google.com:19302'},
			{url:'stun:stun3.l.google.com:19302'},
			{url:'stun:stun4.l.google.com:19302'},
			{
				"url":"turn:numb.viagenie.ca",
				"username":"muazkh",
				"credential":"webrtc@live.com"
			},
			{
				"url":"turn:192.158.29.39:3478?transport=tcp",
				"username":"JZEOEt2V3Qb0y27GRntt2u2PAYA=",
				"credential":"28224511:1379330808"
			}
		]}
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

function attach_sink_id(element, sink_id, output_selector) {
	if (typeof element.sinkId !== 'undefined') {
		element.setSinkId(sink_id).then(function() {
			console.log('Success, audio output device attached: ' + sink_id + ' to ' + 'element with ' + element.title + ' as source.');
		}).catch(function(error) {
			var error_message = error;
			if (error.name === 'SecurityError') {
				error_message = 'You need to use HTTPS for selecting audio output ' + 'device: ' + error;
			}
			console.error(error_message);

			// Jump back to first output device in the list as it's the default.
			output_selector.selectedIndex = 0;
		});
	} else {
		console.warn('Browser does not support output device selection.');
	}
}

// Create visual controls upon accepting a call
easyrtc.setStreamAcceptor(function(callerEasyrtcid, stream) {
	media_stream_list.push([callerEasyrtcid, stream]);
	// create a name tag
	var user_box = document.getElementById('client-list');
	var list_item = document.createElement('li');
	list_item.setAttribute('id', 'label-' + callerEasyrtcid);
	var table = document.createElement('table');
	table.setAttribute('style', "max-width:100px;"); // Does this line not contridict line 133?
	var table_row_1 = document.createElement('tr');
	var table_cell_1 = document.createElement('td');

	label = document.createElement('span');
	label.textContent = 'User ID:' + callerEasyrtcid;
	
	table_cell_1.appendChild(label);
	table_row_1.appendChild(table_cell_1);

	// create controls for them
	var table_row_2 = document.createElement('tr');
	var table_cell_2 = document.createElement('td');
	var table_row_3 = document.createElement('tr');
	var table_cell_3 = document.createElement('td');
	var video = document.createElement('audio');
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

	// set peers stream to corresponding html tag
	easyrtc.setVideoObjectSrc(video, stream);

	function change_audio_destination(event) {
		var device_id = event.target.value;
		var output_selector = event.target;
		var element = video;
		attach_sink_id(element, device_id, output_selector);
	}

	function got_devices(device_infos) {
		for (var i = 0; i !== device_infos.length; ++i) {
			var device_info = device_infos[i];
			var option = document.createElement('option');
			option.value = device_info.deviceId;
		
			if (device_info.kind === 'audiooutput') {
				console.info('Found audio output device: ', device_info.label);
				option.text = device_info.label || 'speaker ' + (masterOutputSelector.length + 1);
				selector.appendChild(option);
			} else {
				console.log('Found non audio output device: ', device_info.label);
			}
		}
		selector.addEventListener('change', change_audio_destination);
	}

	if (is_chrome) {
		var selector = document.createElement('select');
		selector.setAttribute('class', 'output_selector'); // Is this important?
		table_cell_3.appendChild(selector);
		table_row_3.appendChild(table_cell_3);
		table.appendChild(table_row_3);
		navigator.mediaDevices.enumerateDevices().then(got_devices)
	} else {
		console.warn('Output selection only supported by chrome');
	}

	// Object has been created, check if I am recording
	if(recording) {
		// I am recording, Add new stream to the record with timestamp so we can calculate the offset later
		// Fun fact: Date.now() currently suffers from the year 2038 problem.
		record_handle(stream, callerEasyrtcid, Date.now());
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
