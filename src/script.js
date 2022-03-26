const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const overlayElement = document.getElementsByClassName('overlay')[0];
const canvasCtx = canvasElement.getContext('2d');

let model = undefined;

async function onResults(results) {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (model) {
        // Now let's start classifying a frame in the stream.
        model.segmentPerson(canvasElement).then(function (predictions) {
            const coloredPartImage = bodyPix.toMask(predictions);
            const opacity = 1;
            const flipHorizontal = false;
            const maskBlurAmount = 0;
            // Draw the mask image on top of the original image onto a canvas.
            // The colored part image will be drawn semi-transparent, with an opacity of
            // 0.7, allowing for the original image to be visible under.
            bodyPix.drawMask(
                overlayElement, canvasElement, coloredPartImage, opacity, maskBlurAmount,
            flipHorizontal);
        });
    } else {
        bodyPix.load().then(function (loadedModel) {
          model = loadedModel;
        });
    }
}


const camera = new Camera(videoElement, {
    onFrame: async () => {
        await onResults({image: videoElement});
    },
    width: 1280,
    height: 720
});

camera.start();