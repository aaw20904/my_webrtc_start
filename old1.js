 

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
  ///21.08
    const apiPeerConnection =   () =>{
          let peerConnection =  new RTCPeerConnection(peerConfiguration);
          console.log(peerConnection);
          return peerConnection
    }





    

 const takePicureFromVideo = async () =>{
    let peerConnection = false;
    let streaming = false;
    var canvas = document.querySelector('canvas');
     var video = document.querySelector('video');
   
   
    var takePictureButton =  document.querySelector("#capture");

  
        const takePicture = () =>{
                if (streaming) {
                    canvas.width = video.clientWidth;
                    canvas.height = video.clientHeight;
                    var context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0);
                }
            }

   takePictureButton.addEventListener('click',takePicture);

   

    try{    
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            video.srcObject = stream;
            streaming = true;

    }catch(e){
        alert(e);
    }
  
 }

 takePicureFromVideo();
 apiPeerConnection()
 
 ///page 40