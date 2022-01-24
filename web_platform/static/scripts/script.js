let n = 0;
let m = 0;
let k = 0;
let l = 0;
let myVideo = document.querySelector("#myVideo");
let remoteVideo = document.querySelector("#remoteVideo");
let stopVideo = document.querySelector("#stop");
let startVideo = document.querySelector("#start");
let cam = document.getElementById("camBtn");
let mic = document.getElementById("micBtn");

let connectBtnDiv = document.getElementById("connectBtn");
let disconnectBtnDiv = document.getElementById("disconnectBtn");
let createBtn = document.getElementById("createBtn");

let nicknameInput = document.getElementById("nicknameInput");
let header = document.getElementById("header");

let button = document.getElementById("button");
let button2 = document.getElementById("button2");
button.addEventListener("click", change, false);
button2.addEventListener("click", change2, false);

disconnectBtnDiv.style.visibility = "hidden";
remoteVideo.style.visibility = "hidden";

// hiding/unhiding elements(nickname input; second video; buttons switch)
function change() {
  if (l % 2 == 1) {
    connectBtnDiv.style.visibility = "visible";
    disconnectBtnDiv.style.visibility = "hidden";
    nicknameInput.style.visibility = "visible";
    remoteVideo.style.visibility = "hidden";
  } else {
    connectBtnDiv.style.visibility = "hidden";
    disconnectBtnDiv.style.visibility = "visible";
    nicknameInput.style.visibility = "hidden";
    remoteVideo.style.visibility = "visible";
  }
  l++;
}

// hiding/unhiding header(login input; create buitton)
function change2() {
  if (k % 2 == 0) {
    header.style.visibility = "hidden";
    createBtn.style.visibility = "hidden";
  } else {
    header.style.visibility = "visible";
    createBtn.style.visibility = "visible";
  }
  k++;
}

cam.addEventListener("click", changeCamState, false);
mic.addEventListener("click", changeMicState, false);

function changeCamState() {
  if (n % 2 == 0) {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          myVideo.srcObject = stream;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });
    }
    n++;
    camBtn.src = "static/images/cam.png";
    console.log("cam ON");
  } else {
    var stream = myVideo.srcObject;
    var tracks = stream.getTracks();

    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }
    n++;
    myVideo.srcObject = null;
    camBtn.src = "static/images/cam_off.png";
    console.log("cam OFF");
  }
}

function changeMicState() {
  if (m % 2 == 0) {
    m++;
    micBtn.src = "static/images/mic.png";
    console.log("mic ON");
  } else {
    m++;
    micBtn.src = "static/images/mic_off.png";
    console.log("mic OFF");
  }
}
