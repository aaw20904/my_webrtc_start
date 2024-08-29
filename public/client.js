var name,
connectedUser;


var loginPage = document.querySelector('#login-page');
var usernameInput = document.querySelector('#username');
var loginButton = document.querySelector('#login');
var callPage = document.querySelector('#call-page');
var theirUsernameInput = document.querySelector('#theirusername');
var callButton = document.querySelector('#call');
var hangUpButton = document.querySelector('#hang-up');

var videoViews = {yourVideo:false,theirVideo:false}
var connections = {yourConnection:false, connectedUser:false};
videoViews.yourVideo = document.querySelector('#yours');
videoViews.theirVideo = document.querySelector('#theirs');
let stream;


var connection = new WebSocket('ws://localhost:8080');

connection.onopen = function () {
    console.log("Connected");
};
// Handle all messages through this callback
connection.onmessage = function (message) {
    console.log("Got message", message.data);
    var data = JSON.parse(message.data);
    switch(data.type) {
    case "login":
        onLogin(data.success);
    break;
    case "offer":
        onOffer(data.offer, data.name);
    break;
    case "answer":
        onAnswer(data.answer);
    break;
    case "candidate":
        onCandidate(data.candidate);
    break;
    case "leave":
        onLeave();
    break;
    default:
    break;
    }
};

connection.onerror = function (err) {
    console.log("Got error", err);
};
// Alias for sending messages in JSON format
function send(message) {
    if (connectedUser) {
        message.name = connectedUser;
    }
    connection.send(JSON.stringify(message));
};






callPage.style.display = "none";
// Login when the user clicks the button
loginButton.addEventListener("click", function (event) {
    var name = usernameInput.value;
    if (name.length > 0) {
        send({type: "login",name: name });
    }
});

callButton.addEventListener("click", function () {
    var theirUsername = theirUsernameInput.value;
    if (theirUsername.length > 0) {
        startPeerConnection(theirUsername);
    }
});

function onLogin(success) {
    if (success === false) {
        alert("Login unsuccessful, please try a different name.");
    } else {
        loginPage.style.display = "none";
        callPage.style.display = "block";
        // Get the plumbing ready for a call
        startConnection();
    }
};




async function  startConnection() {
    //globals:
    //var videoViews = {yourVideo, theirVideo}
    //var connections = {yourConnection:false, connectedUser:false};

    //1)getting user media
    try{    
         stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
         videoViews.yourVideo.srcObject = stream;
         setupPeerConnection(stream,connections,videoViews)

        }catch(e){
            alert(e);
            return
    }

}

function setupPeerConnection(stream, connects, vViews) {
    //STUN servers
    const peerConfiguration = {
        iceServers:[
            {
                urls:[
                  'stun:stun.l.google.com:19302',
                  'stun:stun1.l.google.com:19302'
                ]
            }
        ]
    }

    connects.yourConnection =    new RTCPeerConnection(peerConfiguration)
        // Setup stream listening
    connects.yourConnection.addStream(stream);
        ///your Stream to their connection
    connects.yourConnection.onaddstream =  (e) => {
        vViews.theirVideo.srcObject = e.stream;
    };
    // Setup ice handling
    connects.yourConnection.onicecandidate = (event)=>{
        //add your ICE candidat adds to their connection,
        if(event.candidate){
            send({type: "candidate",candidate: event.candidate});
        }
    }

}

async function startPeerConnection(user,conns) {
     
      let  yourOffer = await conns.yourConnection.createOffer();
      send({type: "offer", offer: offer});
      await conns.yourConnection.setLocalDescription(yourOffer);
    
}

async function onOffer(offer, conns, name) {
    let yourAnswer;
    connectedUser = name;
    conns.yourConnection.setRemoteDescription(new RTCSessionDescription(offer));
    yourAnswer = await connections.yourConnection.createAnswer();
    conns.yourConnection.setLocalDescription(yourAnswer)
    send({type: "answer", answer: answer});

}

async function onAnswer(answer , conns) {
    await conns.yourConnection.setRemoteDescription(answer);
}

function onCandidate(candidate, conns) {
  conns.yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

///p.92