document.addEventListener("DOMContentLoaded", function(event) {
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

