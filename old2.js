async function runApp() {
    var videoViews = {}
    //load video elems:
    videoViews.yourVideo = document.querySelector('#yours');
    videoViews.theirVideo = document.querySelector('#theirs');
    var connections = {yourConnection:false, theirConnection:false};
    let yourStream;
    //1)getting user media
    try{    
         yourStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
         videoViews.yourVideo.srcObject = yourStream;

        }catch(e){
            alert(e);
    }
    //2) start RTCPerr Connect
    startPeerConnection(connections, yourStream, videoViews);
    console.log('RTCPeerConnnection:',connections.yourConnection);
}


const startPeerConnection = async   (connections, yourStream, videoViews)=>{
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

    connections.yourConnection =  new RTCPeerConnection(peerConfiguration)
    connections.theirConnection = new RTCPeerConnection(peerConfiguration)
    // Setup stream listening
    connections.yourConnection.addStream(yourStream);

    connections.theirConnection.onaddstream =  (e) => {
        videoViews.theirVideo.srcObject = e.stream;
    };
    // Setup ice handling: 
    
    
    connections.yourConnection.onicecandidate = (event)=>{
        //add your ICE candidat adds to their connection,
        if(event.candidate){
            console.log('YourICE add to theirConnection')
            connections.theirConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    }
    
    connections.theirConnection.onicecandidate = (event)=>{
        //add their ICE candidate to your connection
        if(event.candidate){
            console.log('theirICE add to  yourConnection')
            connections.yourConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    }
    // Begin the offer
    let yourOffer, theirAnswer;
    yourOffer = await connections.yourConnection.createOffer();
        await connections.yourConnection.setLocalDescription(yourOffer);
        await  connections.theirConnection.setRemoteDescription(yourOffer);
        console.log('your offer has been Created ..')
    theirAnswer = await connections.theirConnection.createAnswer();
        await connections.theirConnection.setLocalDescription(theirAnswer);
        await connections.yourConnection.setRemoteDescription(theirAnswer);
        console.log('  their answer has been Created..')
    ///logs
    console.log('their answer:',theirAnswer);
    console.log('your offer',yourOffer);
    
}



runApp();

///page 59