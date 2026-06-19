window.liveAI = {
    attention_score: 100,
    stress_score: 0,
    blink_count: 0,
    blink_rate: 0,
    distraction: "LOW"
};

let blinkCount = 0;
let eyeClosed = false;
let startTime = Date.now();
let previousNoseX = null;
let movementTotal = 0;
let movementFrames = 0;

const videoElement = document.createElement("video");
videoElement.style.display = "none";
document.body.appendChild(videoElement);

const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

faceMesh.onResults((results) => {

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        window.liveAI.attention_score = 50;
        window.liveAI.distraction = "HIGH";
        return;
    }

    const landmarks = results.multiFaceLandmarks[0];

    const upperEye = landmarks[159];
    const lowerEye = landmarks[145];
    const nose = landmarks[1];

    const eyeDistance = Math.abs(upperEye.y - lowerEye.y);

    if (eyeDistance < 0.025) {
        if (!eyeClosed) {
            blinkCount++;
            eyeClosed = true;
        }
    } else {
        eyeClosed = false;
    }

    if (previousNoseX !== null) {
        const movement = Math.abs(nose.x - previousNoseX);
        movementTotal += movement;
        movementFrames++;
    }

    previousNoseX = nose.x;

    const avgMovement =
        movementFrames > 0
            ? movementTotal / movementFrames
            : 0;

    const elapsedMinutes =
        (Date.now() - startTime) / 60000;

    const blinkRate =
        elapsedMinutes > 0
            ? blinkCount / elapsedMinutes
            : 0;

    let attentionScore = Math.max(
        0,
        Math.min(
            100,
            100 - avgMovement * 1000
        )
    );

    let stressScore = Math.min(
        100,
        Math.round(avgMovement * 1000 + blinkRate)
    );

    let distraction = "LOW";

    if (attentionScore < 45) {
        distraction = "HIGH";
    } else if (attentionScore < 75) {
        distraction = "MEDIUM";
    }

    window.liveAI = {
        attention_score: Math.round(attentionScore),
        stress_score: stressScore,
        blink_count: blinkCount,
        blink_rate: Math.round(blinkRate),
        distraction: distraction
    };
});

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({
            image: videoElement
        });
    },
    width: 640,
    height: 480
});

camera.start();