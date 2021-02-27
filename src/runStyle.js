import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor, InferenceSession } from "onnxjs";
import { ImageLoader } from "./image-loader.js";

async function runOnnx(inputTensor, canvas_name, image_size, style) {
  // Creat the session and load the pre-trained model
  const session = new InferenceSession({
    backendHint: "webgl",
  });
  if (style == "candy") {
    await session.loadModel("small" + image_size + ".onnx");
  } else if (style == "gogh") {
    await session.loadModel("gogh" + image_size + ".onnx");
  }

  // Run model with Tensor inputs and get the result.
  // console.log("input_pre!!!",preprocessedData)
  // const inputTensor = new onnx.Tensor(preprocessedData, 'float32');
  const outputMap = await session.run([inputTensor]);
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

  const dataFromImage = ndarray(new Float32Array(image_size * image_size * 4), [
    image_size,
    image_size,
    4,
  ]);
  const dataProcessed = ndarray(new Float32Array(outputData), [
    1,
    3,
    image_size,
    image_size,
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
  for (let y = 0; y < image_size; y++) {
    for (let x = 0; x < image_size; x++) {
      let pos = (y * image_size + x) * 4; // position in buffer based on x and y
      dataForImage[pos + 3] = 255; // set alpha channel
    }
  }
  console.log("result", outputMap, dataFromImage, dataProcessed, dataForImage);

  // buffer = new Uint8ClampedArray(image_size * image_size * 4);
  // let canvas = document.createElement('canvas'),
  let canvas = document.getElementById(canvas_name);

  let ctx = canvas.getContext("2d");

  canvas.width = image_size;
  canvas.height = image_size;

  // create imageData object
  let idata = ctx.createImageData(image_size, image_size);

  // set our buffer as source
  idata.data.set(dataForImage);

  // update canvas with new data
  ctx.putImageData(idata, 0, 0);
}

export function draw_canvas(imageSrc, canvas_name, image_size) {
  const canvas = document.getElementById(canvas_name);
  // console.log("c",canvas)
  const ctx = canvas.getContext("2d");
  const image = new Image(image_size, image_size);
  image.src = imageSrc;
  function drawImageActualSize() {
    canvas.width = image_size; //this.naturalWidth;
    canvas.height = image_size; //this.naturalHeight;
    ctx.drawImage(this, 0, 0, this.width, this.height);
  }
  image.onload = drawImageActualSize;
}

function addImageProcess(src, image) {
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image.height);
    image.onerror = reject;
    image.src = src;
  });
}

async function getData(imageSrc, imageSize) {
  let canvas = document.createElement("canvas");
  // console.log(canvas)
  const ctx = canvas.getContext("2d");
  const image = new Image(imageSize, imageSize); // Using optional size for image
  addImageProcess(imageSrc, image);

  // image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = () => resolve(image.height);
    image.onerror = reject;
    image.src = imageSrc;
  });
  canvas.width = imageSize;
  canvas.height = imageSize;
  ctx.drawImage(image, 0, 0, image.width, image.height);
  const imgData = ctx.getImageData(0, 0, imageSize, imageSize).data;
  // let loader = new ImageLoader(imageSize, imageSize);
  // imgData = loader.getImageData(imageSrc);
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

  const dataFromImage = ndarray(floatData, [imageSize, imageSize, 4]);
  const dataProcessed = ndarray(new Float32Array(imageSize * imageSize * 3), [
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

  runOnnx(tensor, resultCanvas, imageSize, style);
}
