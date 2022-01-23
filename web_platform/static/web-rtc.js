let connectButton = document.getElementById('callButton')
let conn;
let peerConnection;
let dataChannel;
let btnCamera = document.getElementById('btnVideo');
let btnMicrophone = document.getElementById('btnAudio');
const camera = document.getElementById('localVideo');


let config = {
    iceServers: [
        {
            "urls": "stun:stun.l.google.com:19302",
        }
    ]
};


const constraints = {
    video: true,
    audio: true,
};
let map_peers = {};
var webSocket;

function webSocketOnMessage(event) {
    var parsed_data = JSON.parse(event.data);
    var peerUsername = parsed_data['peer'];
    var action = parsed_data['action'];

    if (username === peerUsername){
        return;
    }

    var receiver_channel_name = parsed_data['message']['receiver_channel_name'];
    if (action === 'new-peer'){
        createOfferer(peerUsername, receiver_channel_name);
    }

    if (action === 'new-offer'){
        var offer = parsed_data['message']['sdp'];
        createAnswerer(offer, peerUsername, receiver_channel_name);
    }

    if (action === 'new-answer' && peerUsername !== map_peers[peerUsername][0] ){
        var answer = parsed_data['message']['sdp'];
        var peer = map_peers[peerUsername][0];
        console.log("ping1");
        peer.setRemoteDescription(answer)
    }
}

function connect() {
    var endPoint = "ws://localhost:8000/ws/room/" + roomName + "/"
    console.log("endPoint: ", endPoint);

    webSocket = new WebSocket(endPoint);

    webSocket.addEventListener('open', (e) => {
        console.log('Connection oppened!');
        sendMessageToWS('new-peer', {})
    });
    webSocket.addEventListener('close',  (e) => {
        console.log('Connection closed!');
        });
    webSocket.addEventListener('message', webSocketOnMessage);
    webSocket.addEventListener('error',
        (e) => {
        console.log('ERROR occurred!');
        });
}

var localStream = new MediaStream();

const localVideo = document.querySelector('#localVideo');
const remoteVideo = document.querySelector('#remoteVideo');

var userMedia = navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = localStream;
        localVideo.muted = true;

        audio = stream.getAudioTracks()
        video = stream.getVideoTracks()

        audio[0].enabled = true;
        video[0].enabled = true;

        btnMicrophone.addEventListener('click', () => {
            audio[0].enabled = !audio[0].enabled
        })

        btnCamera.addEventListener('click', () => {
            audio[0].enabled = !audio[0].enabled
        })
    })
    .catch(error => {
        console.log("Error requesting media devices.", error);
    });


function sendMessageToWS(action, message) {
    var jsonStr = JSON.stringify({
        'peer': username,
        'action': action,
        'message': message
        });
    webSocket.send(jsonStr);
}

function createOfferer(peerUsername, receiver_channel_name){
    var peer = new RTCPeerConnection(config);

    addLocalTracks(peer);

    var data_channel = peer.createDataChannel('channel');
    data_channel.addEventListener('open', () => {
        console.log('Connection oppened!')
    });
    setOnTrack(peer, remoteVideo);

    map_peers[peerUsername] = [peer, data_channel];

    peer.addEventListener('iceconnectionstatechange', () => {
        var iceConnectState = peer.iceConnectionState;
        if (iceConnectState === 'failed' || iceConnectState === 'disconnected' || iceConnectState === 'closed') {
            delete map_peers[peerUsername];
            if (iceConnectState !== 'closed') {
                peer.close()
            }
        }
    })

    peer.addEventListener('icecandidate', (event) => {
        sendMessageToWS('new-offer', {
            'sdp': peer.localDescription,
            'receiver_channel_name' : receiver_channel_name
        });
    })

    peer.createOffer()
        .then(o => peer.setLocalDescription(o))
        .then(() => {
            console.log("Local desc loaded successfully")
        })
}

function addLocalTracks(peer){
    localStream.getTracks().forEach( track => {
        peer.addTrack(track, localStream)
    })
}

function setOnTrack(peer, remoteVideo) {
    var remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;
    peer.addEventListener('track', async (event) => {
        remoteStream.addTrack(event.track, remoteStream)
    })

}

function createAnswerer(offer, peerUsername, receiver_channel_name) {
    var peer = new RTCPeerConnection(config);

    addLocalTracks(peer);

    setOnTrack(peer, remoteVideo);

    peer.addEventListener('datachannel', e => {
        peer.data_channel = e.channel
        peer.data_channel.addEventListener('open', () => {
        console.log('Connection oppened!')
    });
    })

    map_peers[peerUsername] = [peer, peer.data_channel];

    peer.addEventListener('iceconnectionstatechange', () => {
        var iceConnectState = peer.iceConnectionState;
        if (iceConnectState === 'failed' || iceConnectState === 'disconnected' || iceConnectState === 'closed') {
            delete map_peers[peerUsername];
            if (iceConnectState !== 'closed') {
                peer.close()
            }
        }
    })

    peer.addEventListener('icecandidate', (event) => {
        sendMessageToWS('new-answer', {
            'sdp': peer.localDescription,
            'receiver_channel_name' : receiver_channel_name
        });
    })
    peer.setRemoteDescription(offer)
        .then( () => {
            console.log('Remote description: ok')
            return peer.createAnswer();
        })
        .then( a => {
            console.log("Answer created");
            peer.setLocalDescription(a).then(r => {

            })
        })
}
// btnCamera.addEventListener('click', my_stream)
connectButton.addEventListener('click', connect)