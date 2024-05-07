const webcam = document.getElementById("webcamStream");
const webCamBtn = document.getElementById("startCam");
const classfication = document.getElementById('class')
const score = document.getElementById('score');
const bbox = document.getElementById('bounding-box');

webCamBtn.disabled = true;
let model;
cocoSsd.load().then(function (loadedModel) {
    model = loadedModel;
    console.log(model)
    webCamBtn.disabled = false;
    console.log(webCamBtn.disabled)
})
const fetchVideoStream = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
            frameRate: { ideal: 30, max: 60 },
            facingMode: 'environment' || 'user'
        }
    });
    return mediaStream;
}


function predictObject() {
    model.detect(webcam, 10/*10 boxes*/, 0.50).then(
        prediction => {
            console.log(prediction);
            classfication.textContent = prediction[0].class
            score.textContent = (prediction[0].score * 100).toPrecision(6) + '%'

            bbox.textContent = JSON.stringify(prediction[0].bbox.map(item => item.toPrecision(5)))

        }
    )
}

const addStreamToVideoEle = async (event) => {
    if (!model) return;
    const mediaStream = await fetchVideoStream();
    console.log(mediaStream)
    webcam.srcObject = mediaStream;
    event.target.style.opacity = 0;

    webcam.addEventListener('loadeddata', predictObject)
}


webCamBtn.addEventListener('click', addStreamToVideoEle)