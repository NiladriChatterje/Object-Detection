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

const addStreamToVideoEle = async () => {
    const mediaStream = await fetchVideoStream();
    console.log(mediaStream)
    webcam.srcObject = mediaStream;
}

webCamBtn.addEventListener('click', addStreamToVideoEle)