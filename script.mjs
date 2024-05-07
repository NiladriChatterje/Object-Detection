const webcam = document.getElementById("webcamStream");
const webCamBtn = document.getElementById("startCam");

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