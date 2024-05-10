const webcam = document.getElementById("webcamStream");
const webCamBtn = document.getElementById("startCam");
const toggleBtn = document.getElementById("toggleBtn");
const liveView = document.getElementById("container");

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

    if (toggle && isMobile) webcam.style.transform = ` translate(-50%, -50%) scaleX(1)`
    else if (!toggle && isMobile) webcam.style.transform = ` translate(-50%, -50%) scaleX(-1)`
    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
            frameRate: { max: 60 },
            facingMode: isMobile ? (toggle ? 'environment' : 'user') : 'environment'
        }
    });
    return mediaStream;
}

const children = []
function predictObject() {
    model.detect(webcam, 10/*10 boxes*/, 0.50).then(
        prediction => {
            for (let i = 0; i < children.length; i++)
                liveView.removeChild(children[i]);
            children.length = 0;
            prediction.forEach(pred => {
                const paragraph = document.createElement('p');
                paragraph.innerText = `${pred.class} -----> ${pred.score.toFixed(2) * 100}% confidence`
                paragraph.style.marginLeft = `${pred.bbox[0]}px`;
                paragraph.style.marginTop = `${pred.bbox[1]}px`
                paragraph.style.width = `${pred.bbox[2] - 280}px`;
                paragraph.style.top = `0`;
                paragraph.style.left = `0`;

                const highLighter = document.createElement('div');
                highLighter.setAttribute('class', 'highlighter');

                highLighter.style = `left:${pred.bbox[0] + 80}px;
                top:${pred.bbox[1] + 100}px;
                width:${pred.bbox[2] - 280}px;
                height:${pred.bbox[3] - 200}px`;

                liveView.appendChild(highLighter);
                liveView.appendChild(paragraph);
                children.push(highLighter);
                children.push(paragraph);
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