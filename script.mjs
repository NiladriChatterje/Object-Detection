const webcam = document.getElementById("webcamStream");
const webCamBtn = document.getElementById("startCam");
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
            console.log(prediction)
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