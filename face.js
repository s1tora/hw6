function setText( text ) {
    document.getElementById( "status" ).innerText = text;
}

function drawLine( ctx, x1, y1, x2, y2 ) {
    ctx.beginPath();
    ctx.moveTo( x1, y1 );
    ctx.lineTo( x2, y2 );
    ctx.stroke();
}

function drawTriangle( ctx, x1, y1, x2, y2, x3, y3 ) {
    ctx.beginPath();
    ctx.moveTo( x1, y1 );
    ctx.lineTo( x2, y2 );
    ctx.lineTo( x3, y3 );
    ctx.lineTo( x1, y1 );
    ctx.stroke();
}

let output = null;
let model = null;

async function setupWebcam() {
    return new Promise( ( resolve, reject ) => {
        const webcamElement = document.getElementById( "webcam" );
        const navigatorAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
        if( navigator.getUserMedia ) {
            navigator.getUserMedia( { video: true },
                stream => {
                    webcamElement.srcObject = stream;
                    webcamElement.addEventListener( "loadeddata", resolve, false );
                },
            error => reject());
        }
        else {
            reject();
        }
    });
}

async function trackFace() {
    const video = document.getElementById( "webcam" );
    const faces = await model.estimateFaces( {
        input: video,
        returnTensors: false,
        flipHorizontal: false,
    });
    output.drawImage(
        video,
        0, 0, video.width, video.height,
        0, 0, video.width, video.height
    );

    faces.forEach( face => {
        setText( `Face Tracking Confidence: ${face.faceInViewConfidence.toFixed( 3 )}` );

        // Draw the bounding box
        const x1 = face.boundingBox.topLeft[ 0 ];
        const y1 = face.boundingBox.topLeft[ 1 ];
        const x2 = face.boundingBox.bottomRight[ 0 ];
        const y2 = face.boundingBox.bottomRight[ 1 ];
        const bWidth = x2 - x1;
        const bHeight = y2 - y1;
        drawLine( output, x1, y1, x2, y1 );
        drawLine( output, x2, y1, x2, y2 );
        drawLine( output, x1, y2, x2, y2 );
        drawLine( output, x1, y1, x1, y2 );

        // Draw the face mesh
        const keypoints = face.scaledMesh;
        for( let i = 0; i < FaceTriangles.length / 3; i++ ) {
            let pointA = keypoints[ FaceTriangles[ i * 3 ] ];
            let pointB = keypoints[ FaceTriangles[ i * 3 + 1 ] ];
            let pointC = keypoints[ FaceTriangles[ i * 3 + 2 ] ];
            drawTriangle( output, pointA[ 0 ], pointA[ 1 ], pointB[ 0 ], pointB[ 1 ], pointC[ 0 ], pointC[ 1 ] );
        }
    });

    requestAnimationFrame( trackFace );
}

(async () => {
    await setupWebcam();
    const video = document.getElementById( "webcam" );
    video.play();
    let videoWidth = video.videoWidth;
    let videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    let canvas = document.getElementById( "output" );
    canvas.width = video.width;
    canvas.height = video.height;

    output = canvas.getContext( "2d" );
    output.translate( canvas.width, 0 );
    output.scale( -1, 1 ); // Mirror cam
    output.fillStyle = "#fdffb6";
    output.strokeStyle = "#fdffb6";
    output.lineWidth = 2;

    // Load Face Landmarks Detection
    model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );

    setText( "Loaded!" );

    trackFace();
})();