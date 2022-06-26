import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor, InferenceSession } from "onnxruntime-web";

export function drawCanvas(
  imageSrc,
  canvasName,
  imageSize,
  initFinished = true
) {
  if (initFinished) {
    const canvas = document.getElementById(canvasName);
    // console.log("c",canvas)
    const ctx = canvas.getContext("2d");
    const image = new Image(imageSize, imageSize);
    image.src = imageSrc;
    function drawImageActualSize() {
      canvas.width = imageSize; //this.naturalWidth;
      canvas.height = imageSize; //this.naturalHeight;
      ctx.drawImage(this, 0, 0, this.width, this.height);
    }
    image.onload = drawImageActualSize;
  }
}

async function getData(imageSrc, imageSize) {
  let canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const image = new Image(imageSize, imageSize);
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = () => resolve(image.height);
    image.onerror = reject;
    image.src = imageSrc;
  });
  canvas.width = imageSize;
  canvas.height = imageSize;
  ctx.drawImage(image, 0, 0, image.width, image.height);
  const imgData = ctx.getImageData(0, 0, imageSize, imageSize).data;
  return new Float32Array(imgData);
}

export async function prepareAndRunStyle(
  imageSrc,
  resultCanvas,
  imageSize,
  style,
  hasLoaded = true
) {
  if (hasLoaded) {
    let floatData = await getData(imageSrc, imageSize);
    let dataFromImage = ndarray(floatData, [imageSize, imageSize, 4]);
    let dataProcessed = ndarray(new Float32Array(imageSize * imageSize * 3), [
      1,
      3,
      imageSize,
      imageSize,
    ]);
    ops.assign(
      dataProcessed.pick(0, 2, null, null),
      dataFromImage.pick(null, null, 2)
    );
    ops.assign(
      dataProcessed.pick(0, 1, null, null),
      dataFromImage.pick(null, null, 1)
    );
    ops.assign(
      dataProcessed.pick(0, 0, null, null),
      dataFromImage.pick(null, null, 0)
    );
    console.log("preprocessed data", floatData, dataFromImage, dataProcessed);

    const inputTensor = new Tensor(
      "float32",
      new Float32Array(3 * imageSize * imageSize),
      [1, 3, imageSize, imageSize]
    );
    inputTensor.data.set(dataProcessed.data);
    dataFromImage = null;
    dataProcessed = null;
    // Creat the session and load the pre-trained model
    let modelName = "";
    if (imageSize == 224) {
      modelName = "mosaic-9.onnx";
    } else {
      modelName = style + imageSize + ".onnx";
    }
    console.log("modelName", modelName);
    let session = await InferenceSession.create(modelName, {
      executionProviders: ["webgl"],
    });

    const inputName = session.inputNames[0];
    const outputName = session.outputNames[0];

    // console.log("session.inputNames", session.inputNames);
    // console.log("session.inputNames", session.outputNames);
    // let session = await InferenceSession.create(
    //   "https://github.com/onnx/models/raw/main/vision/style_transfer/fast_neural_style/model/mosaic-9.onnx",
    //   {
    //     executionProviders: ["webgl"],
    //   }
    // );
    // let session = new InferenceSession({
    //   backendHint: "webgl",
    // });
    console.log("loading onnx:", style + imageSize + ".onnx");
    // await session.loadModel(style + imageSize + ".onnx");
    // Run model with Tensor inputs and get the result.
    // console.log("inputTensor: ", inputTensor);

    // const outputMap = await session.run({ "input.1": inputTensor });
    let outputMap = {};

    outputMap = await session.run({ [inputName]: inputTensor });

    session = null;
    // for (var key in outputMap) {
    //   console.log("key: ", key);
    // }
    // console.log("key: ", outputMap[1]);
    // console.log("data", Object.values(outputMap)[0].data);

    // console.log("outputMap: ", outputMap);
    // console.log("outputMap76: ", outputMap.values);
    // console.log("outputMap0val: ", outputMap[76].data);
    console.log("outputMap: ", outputMap);

    // let outputData = Object.values(outputMap)[0].data;
    let outputData = outputMap[outputName].data;
    const dataFromImageBack = ndarray(
      new Float32Array(imageSize * imageSize * 4),
      [imageSize, imageSize, 4]
    );
    const dataProcessedBack = ndarray(new Float32Array(outputData), [
      1,
      3,
      imageSize,
      imageSize,
    ]);
    ops.assign(
      dataFromImageBack.pick(null, null, 0),
      dataProcessedBack.pick(0, 0, null, null)
    );
    ops.assign(
      dataFromImageBack.pick(null, null, 1),
      dataProcessedBack.pick(0, 1, null, null)
    );
    ops.assign(
      dataFromImageBack.pick(null, null, 2),
      dataProcessedBack.pick(0, 2, null, null)
    );
    let dataForImage = dataFromImageBack.data;
    for (let y = 0; y < imageSize; y++) {
      for (let x = 0; x < imageSize; x++) {
        let pos = (y * imageSize + x) * 4; // position in buffer based on x and y
        dataForImage[pos + 3] = 255; // set alpha channel
      }
    }
    console.log(
      "result",
      outputMap,
      dataFromImageBack,
      dataProcessedBack,
      dataForImage
    );
    let canvas = document.getElementById(resultCanvas);
    let ctx = canvas.getContext("2d");
    canvas.width = imageSize;
    canvas.height = imageSize;
    // create imageData object
    let idata = ctx.createImageData(imageSize, imageSize);
    // set our buffer as source
    idata.data.set(dataForImage);
    // update canvas with new data
    ctx.putImageData(idata, 0, 0);
  }
}
