const webcam = document.getElementById("webcamStream");
const webCamBtn = document.getElementById("startCam");
const toggleBtn = document.getElementById("toggleBtn");
const classfication = document.getElementById('class')
const score = document.getElementById('score');
const bbox = document.getElementById('bounding-box');
let isMobile = false;
let toggle = true;
webCamBtn.disabled = true;
let model;
cocoSsd.load().then(function (loadedModel) {
    model = loadedModel;
    console.log(model)
    webCamBtn.disabled = false;
    toggleBtn.addEventListener('click', (e) => {
        toggle = !toggle
        addStreamToVideoEle(e)
    })
    console.log(webCamBtn.disabled)
});



const fetchVideoStream = async () => {
    if (window.innerWidth < 1200)
        isMobile = true;

    if (toggle) webcam.style.transform = ` translate(-50%, -50%) scaleX(1)`
    else webcam.style.transform = ` translate(-50%, -50%) scaleX(-1)`
    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
            frameRate: { ideal: 30, max: 60 },
            facingMode: isMobile ? (toggle ? 'environment' : 'user') : 'environment'
        }
    });
    return mediaStream;
}


function predictObject() {
    model.detect(webcam, 10/*10 boxes*/, 0.50).then(
        prediction => {
            prediction.forEach(pred => {
                classfication.textContent = pred.class + ', '
                score.textContent = (pred.score * 100).toPrecision(6) + '%' + ' ,'
                bbox.textContent = JSON.stringify(pred.bbox.map(item => item.toPrecision(5))) + ' ,\n'
            })

        }
    );
    window.requestAnimationFrame(predictObject)
}

const addStreamToVideoEle = async (event) => {
    if (!model) return;
    const mediaStream = await fetchVideoStream();
    console.log(mediaStream)
    webcam.srcObject = mediaStream;
    webCamBtn.style.opacity = 0;

    webcam.addEventListener('loadeddata', predictObject)
}

webCamBtn.addEventListener('click', addStreamToVideoEle)