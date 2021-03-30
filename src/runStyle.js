import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor, InferenceSession } from "onnxjs";
// import { ImageLoader } from "./image-loader.js";

async function runOnnx(inputTensor, canvasName, imageSize, style) {
  // Creat the session and load the pre-trained model
  let session = new InferenceSession({
    backendHint: "webgl",
  });

  await session.loadModel(style + imageSize + ".onnx");

  // Run model with Tensor inputs and get the result.
  // console.log("input_pre!!!",preprocessedData)
  // const inputTensor = new onnx.Tensor(preprocessedData, 'float32');
  const outputMap = await session.run([inputTensor]);
  session = null;
  let outputData = outputMap.values().next().value.data;
  // console.log(
  //   "result!!!",
  //   outputMap,
  //   outputData,
  //   inputTensor,
  //   outputMap.values().next().value
  // );
  // outputData=inputTensor.data // ignores model

  // let test = new Float32Array(outputData);

  const dataFromImage = ndarray(new Float32Array(imageSize * imageSize * 4), [
    imageSize,
    imageSize,
    4,
  ]);
  const dataProcessed = ndarray(new Float32Array(outputData), [
    1,
    3,
    imageSize,
    imageSize,
  ]);
  // ops.assign(dataFromImage.pick(null, null, 3),255);//todo change!
  ops.assign(
    dataFromImage.pick(null, null, 0),
    dataProcessed.pick(0, 0, null, null)
  );
  ops.assign(
    dataFromImage.pick(null, null, 1),
    dataProcessed.pick(0, 1, null, null)
  );
  ops.assign(
    dataFromImage.pick(null, null, 2),
    dataProcessed.pick(0, 2, null, null)
  );
  let dataForImage = dataFromImage.data;
  for (let y = 0; y < imageSize; y++) {
    for (let x = 0; x < imageSize; x++) {
      let pos = (y * imageSize + x) * 4; // position in buffer based on x and y
      dataForImage[pos + 3] = 255; // set alpha channel
    }
  }
  console.log("result", outputMap, dataFromImage, dataProcessed, dataForImage);

  // buffer = new Uint8ClampedArray(imageSize * imageSize * 4);
  // let canvas = document.createElement('canvas'),
  let canvas = document.getElementById(canvasName);

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
  style
) {
  // const canvas = document.getElementById('beforeCanvas');
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
  const tensor = new Tensor(
    new Float32Array(3 * imageSize * imageSize),
    "float32",
    [1, 3, imageSize, imageSize]
  );
  // (tensor.data as Float32Array).set(dataProcessed.data);
  tensor.data.set(dataProcessed.data);
  console.log("preprocessed data", floatData, dataFromImage, dataProcessed);
  dataFromImage = null;
  dataProcessed = null;

  runOnnx(tensor, resultCanvas, imageSize, style);
}
