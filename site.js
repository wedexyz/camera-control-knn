var $motionBox = $('.motion-box');
var $turret = $('img');

var scale = 10;	// capture resolution over motion resolution
var isActivated = false;
var isTargetInSight = false;
var isKnockedOver = false;
var lostTimeout;

function initSuccess() {
	DiffCamEngine.start();
}

function initError() {
	alert('Something went wrong.');
}

function startComplete() {
	setTimeout(activate, 500);
}

function activate() {
	isActivated = true;
	play('activated');
}

function capture(payload) {
	if (!isActivated || isKnockedOver) {
		return;
	}

	var box = payload.motionBox;
	if (box) {
		// video is flipped, so we're positioning from right instead of left
		var right = box.x.min * scale + 1;
		var top = box.y.min * scale + 1;
		var width = (box.x.max - box.x.min) * scale;
		var height = (box.y.max - box.y.min) * scale;

		$motionBox.css({
			display: 'block',
			right: right,
			top: top,
			width: width,
			height: height
		});

		if (!isTargetInSight) {
			isTargetInSight = true;
			play('i-see-you');
		} else {
			play('fire');
		}

		clearTimeout(lostTimeout);
		lostTimeout = setTimeout(declareLost, 2000);
	}

	// video is flipped, so (0, 0) is at top right
	//if (payload.checkMotionPixel(0, 0)) {
	//	knockOver();
//	}
}

function declareLost() {
	isTargetInSight = false;
	play('target-lost');
}

//function knockOver() {
//	isKnockedOver = true;
//	clearTimeout(lostTimeout);

//	$turret.addClass('knocked-over');
//	$motionBox.hide();

//	play('ow');
//}

function play(audioId) {
	$('#audio-' + audioId)[0].play();
}

DiffCamEngine.init({
	video: document.getElementById('remoteVideo'),
	captureIntervalTime: 50,
	includeMotionBox: true,
	includeMotionPixels: true,
	initSuccessCallback: initSuccess,
	initErrorCallback: initError,
	startCompleteCallback: startComplete,
	captureCallback: capture
});
// Generate random room name if needed
if (!location.hash) {
	location.hash = 123488;
  }
  const roomHash = location.hash.substring(1);
  
  // TODO: Replace with your own channel ID
  const drone = new ScaleDrone('yiS12Ts5RdNhebyM');
  // Room name needs to be prefixed with 'observable-'
  const roomName = 'observable-' + roomHash;
  const configuration = {
	iceServers: [{
	  urls: 'stun:stun.l.google.com:19302'
	}]
  };
  let room;
  
  
  
  function onSuccess() {};
  function onError() {
//	alert("menjalankan");
  };
  
  drone.on('open', error => {
	if (error) {
	  return console.error(error);
	}
	room = drone.subscribe(roomName);
	room.on('open', error => {
	  if (error) {
		onError(error);
	  }
	});
	// We're connected to the room and received an array of 'members'
	// connected to the room (including us). Signaling server is ready.
	room.on('members', members => {
	  console.log('MEMBERS', members);
	  // If we are the second user to connect to the room we will be creating the offer
	  const isOfferer = members.length === 2;
	  startWebRTC(isOfferer);
	});
  });
  
  // Send signaling data via Scaledrone
  function sendMessage(message) {
	drone.publish({
	  room: roomName,
	  message
	});
  }
  
  function startWebRTC(isOfferer) {
	pc = new RTCPeerConnection(configuration);
  
	// 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
	// message to the other peer through the signaling server
	pc.onicecandidate = event => {
	  if (event.candidate) {
		sendMessage({'candidate': event.candidate});
	  }
	};
  
	// If user is offerer let the 'negotiationneeded' event create the offer
	if (isOfferer) {
	  pc.onnegotiationneeded = () => {
		pc.createOffer().then(localDescCreated).catch(onError);
	  }
	}
  
	// When a remote stream arrives display it in the #remoteVideo element
	pc.ontrack = event => {
	  const stream = event.streams[0];
	  if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
		remoteVideo.srcObject = stream;
	  }
	};
	
	navigator.mediaDevices.getUserMedia({
	  audio: true,
	  video: true,
	}).then(stream => {
	  // Display your local video in #localVideo element
	  localVideo.srcObject = stream;
	  // Add your stream to be sent to the conneting peer
	  stream.getTracks().forEach(track => pc.addTrack(track, stream));
	}, onError);
  
	// Listen to signaling data from Scaledrone
	room.on('data', (message, client) => {
	  // Message was sent by us
	  if (client.id === drone.clientId) {
		return;
	  }
  
	  if (message.sdp) {
		// This is called after receiving an offer or answer from another peer
		pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
		  // When receiving an offer lets answer it
		  if (pc.remoteDescription.type === 'offer') {
			pc.createAnswer().then(localDescCreated).catch(onError);
		  }
		}, onError);
	  } else if (message.candidate) {
		// Add the new ICE candidate to our connections remote description
		pc.addIceCandidate(
		  new RTCIceCandidate(message.candidate), onSuccess, onError
		);
	  }
	});
  }
  
  function localDescCreated(desc) {
	pc.setLocalDescription(
	  desc,
	  () => sendMessage({'sdp': pc.localDescription}),
	  onError
	);
  }
  