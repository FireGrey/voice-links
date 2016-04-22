// new users must call everyone else
var called_before = false; // is this a new user? - false means they haven't called everyone yet

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
	//easyrtc.setOption("appIceServers", myIceServers);
	easyrtc.setRoomOccupantListener(roomListener);
	var connectSuccess = function(myId) {
		console.log("My easyrtcid is " + myId);
	}
	var connectFailure = function(errorCode, errText) {
		console.log(errText);
	}
	easyrtc.enableAudio(true);
	easyrtc.enableVideo(false);
	easyrtc.initMediaSource(
		function(){
			// create or join the room connection
			easyrtc.connect(roomName, connectSuccess, connectFailure);
		},
		connectFailure
	);
	easyrtc.setIceUsedInCalls( {"iceServers": [
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
}
]});


}

function performCall(easyrtcid) {
	easyrtc.call(
		easyrtcid,
		function(easyrtcid) { console.log("completed call to " + easyrtcid);},
		function(errorCode, errorText) { console.log("err:" + errorText);},
		function(accepted, bywho) {
			console.log((accepted?"accepted":"rejected")+ " by " + bywho);
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
	// create a name tag
	var user_box = document.getElementById('client-box');
	label = document.createElement('span');
	label.setAttribute('id', 'label-' + callerEasyrtcid);
	label.textContent = 'User ID:' + callerEasyrtcid;
	user_box.appendChild(label);

	// create controls for them
	var video = document.createElement('video');
	video.setAttribute('id', callerEasyrtcid);
	video.setAttribute('width', '300');
	video.setAttribute('height', '30');
	video.setAttribute('controls', 'controls');
	user_box.appendChild(video);
	easyrtc.setVideoObjectSrc(video, stream);
});

easyrtc.setOnStreamClosed(function(callerEasyrtcid) {
	// gracefully close the connection
	easyrtc.setVideoObjectSrc(document.getElementById(callerEasyrtcid), "");
	// less gracefully remove the box
	document.getElementById(callerEasyrtcid).remove();
	// and label
	document.getElementById('label-' + callerEasyrtcid).remove();
});
