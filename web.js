// const video = document.querySelector(".webcam");
// const canvas = document.querySelector(".video");
// const faceCanvas = document.querySelector(".face");

const video = document.querySelector(".webcam");

const canvas = document.querySelector(".video").transferControlToOffscreen();
const ctx = canvas.getContext("2d");

const faceCanvas = document.querySelector(".face").transferControlToOffscreen();
const faceCtx = faceCanvas.getContext("2d");

// const worker = new Worker('worker.js');

// worker.postMessage({
//     canvas,
//     faceCanvas
// }, [canvas, faceCanvas]);

canvas.width =  1280;
canvas.height = 720;
faceCanvas.width = 1280;
faceCanvas.height = 720;

const SIZE = 10;
const SCALE = 1.5;

const faceDetector = new FaceDetector();

async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
    });
    video.srcObject = stream;

    await video.play();
}

function censor(boundingBox) {
    faceCtx.imageSmoothingEnabled = false;

    faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height)

    // draw the small face
    faceCtx.drawImage(
        // 5 source args
        video, // where does the source come from?
        boundingBox.x, // where do we start the source pull from?
        boundingBox.y,
        boundingBox.width,
        boundingBox.height,
        // 4 draw args
        boundingBox.x, // where should we start drawing the x and y?
        boundingBox.y,
        SIZE,
        SIZE
    )
    // take that face back out and draw it back normal size
    // draw the small face back on, but scaled up
    const width = boundingBox.width * SCALE;
    const height = boundingBox.height * SCALE;
    faceCtx.drawImage(
        faceCanvas, // source
        boundingBox.x, // where do we start the source pull from?
        boundingBox.y,
        SIZE,
        SIZE,
        //drawing args
        boundingBox.x,
        boundingBox.y,
        width,
        height
    );
}

function drawFace({boundingBox}) {
    const { width, height, top, left } = boundingBox;
    ctx.strokeStyle = "#ffc600";
    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    censor(boundingBox);
    ctx.strokeRect(left, top, width, height);
}

async function detect() {
    const faces = await faceDetector.detect(video);
    faces.forEach(drawFace);
    requestAnimationFrame(detect);
}

populateVideo().then(detect);
onmessage = ({data}) => {
    // const canvas = new OffscreenCanvas(100, 1);
    // const ctx = canvas.getContext('2d');

    console.log(data)
};