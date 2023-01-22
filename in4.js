document.addEventListener("DOMContentLoaded", function(event) {
window.onload = () => {
    detect();
  };
  
  async function detect() {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");
    const faceDetector = new FaceDetector({ fastMode: true });
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
  
    const video = document.createElement("video");
    video.srcObject = mediaStream;
    video.autoplay = true;
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };
  
    function render() {
      faceDetector
        .detect(video)
        .then((faces) => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          context.strokeStyle = "#FFFF00";
          context.lineWidth = 5;
          faces.forEach((face) => {
            const { top, left, width, height } = face.boundingBox;
            context.beginPath();
            context.rect(left, top, width, height);
            context.stroke();
          });
        })
        .catch(console.error);
    }
  
    (function renderLoop() {
      requestAnimationFrame(renderLoop);
      render();
    })();
  }
  
  var video = document.querySelector("#videoElement");
            var stopVideo = document.querySelector("#stop");
            var startVideo = document.querySelector("#start");
 
 
            stopVideo.addEventListener("click", stop, false);
            startVideo.addEventListener("click", startWebCam, false);
 
 
            function startWebCam() {
                if (navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({video: true})
                            .then(function (stream) {
                                video.srcObject = stream;
                            })
                            .catch(function (err0r) {
                                console.log("Something went wrong!");
                            });
                }
            }
 
            function stop(e) {
                var stream = video.srcObject;
                var tracks = stream.getTracks();
 
                for (var i = 0; i < tracks.length; i++) {
                    var track = tracks[i];
                    track.stop();
                }
 
                video.srcObject = null;
            }
        })