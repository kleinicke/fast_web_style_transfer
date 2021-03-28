# How to perform a neural style transfer on a website using ONNX.js

Neural networks are becoming more powerful. In this tutorial I explore the possibilities of neural networks running in a browser. I chose to use a fast neural style transfer that was implemented in the PyTorch examples. Sadly it had to be modified to be compatible with ONNX.js. This modified network is trained using Google Colab and the resulting model exported as a ONNX model. This model is used on a simple website using Svelte and hosted using netlify. Therefore every step in this tutorial can be repeated by everyone without any costs or special hardware requirements.
 In the end I'll point out the problems and limitations of ONNX.js.
This tutorial is for developers that know PyTorch and neural style transfer, but want to learn how to present these results in the browser.
If you just want to work with the finished code:

- [Here](https://github.com/kleinicke/onnx_small_style) is the code to train the model.
- Use [this colab notebook](https://colab.research.google.com/drive/15Uo8C-maoLmOJdOC54_rTo_lORNHZ29P?usp=sharing) to train a model
- Add the trained model to [this website](https://github.com/kleinicke/fast_web_style_transfer)
- publish the website on [netlify](https://www.netlify.com)

## Creating a model

A fast neural style transfer is implemented in the [pytorch examples](https://github.com/pytorch/examples/tree/master/fast_neural_style).
Following this implementation, a model is trained. The finished model can be exported as a ONNX model using
`torch.onnx._export( style_model, content_image, path, opset_version=11`)
Here the `opset_version` describes the instruction set the ONNX model is familiar with. Each instruction of PyTorch and Tensorflow and other frameworks had to be reimplemented in ONNX. Which function is supported in which version is described here.
Sadly ONNX.js is still in an early stage (for years now) and doesn't support all important features. Their current version 0.18 supports mainly `opset_version` 7. The complete list of compatible instructions is listed here. Especially there are problems with upsampling, which is usually used for a fast neural style transfer. Therefore we have no other option than to change the style transfer model to not use upsampling. The finished new model [can be found here](https://github.com/kleinicke/onnx_small_style).

After the modifications, the model is trained. An easy way to train such a model is to use Google Colab. The training takes about 4 hours to get good results. [Here is a notebook](https://colab.research.google.com/drive/15Uo8C-maoLmOJdOC54_rTo_lORNHZ29P?usp=sharing), ready to use with all modifications. In the first step the dataset of normal images has to be downloaded. I use the coco dataset from 2014 which can be downloaded using:
`wget http://images.cocodataset.org/zips/train2014.zip` and unzipped using:
`unzip train2014.zip -d dataset`.
The style, the model is trained of is chosen by the parameter `--style-image onnx_small_style/images/style-images/Van_Gogh.jpg`. This style image could be replaced by you with any other image. The training for two epochs takes about four hours. Afterwards the model is trained well.
The full command to run the model is:

```bash
python neural_style/neural_style.py train --dataset dataset --style-image images/style-images/candy.jpg --save-model-dir model --epochs 2 --cuda 1
```

The model need to be downloaded before the notebook is suspended. Therefore regularly check the process and be come back shortly after the training ended.  
In the next step the model needs to be converted to an ONNX model. This can also be done locally with the following command.

```bash
python neural_style/neural_style.py eval --content-image images/content-images/amber.jpg  --model model/epoch_2_Wed_Dec_30_03\:34\:46_2020_100000.0_10000000000.0.model --output-image results/firsteval.jpg --cuda 0 --export_onnx model/style32.onnx
```

The problem is that the ONNX model will only accept one resolution, even through the original model can deal with multiple resolutions. Therefore the created ONNX model expects and input in the size of the given content image. To create multiple ONNX models, expecting multiple resolutions, content images of multiple resolutions can be used, or the keyword `--content-scale=8` can be used to scale down the resolution of the content image.
The created ONNX models can now be used on the website.

## Building the website

Therefore we use Svelte. This is a modern framework which can be used to build static websites. On their website they describe how to download a demo template version of a Svelte website. After downloading and installing the prerequisites, the website using ONNX.js can be build.
When yarn is installed, the packages of the websites are downloaded and installed when you navigate to the folder of the project in the terminal and enter `yarn`. After these are installed you enter `yarn dev` to build the website. Afterwards it is available to browse on a given port. Whenever you change something in the text file it is almost immediately updated on the website.
The Svelte project contains of multiple folders. Most important are the for this tutorial are the folders `public`, where you can store all files that should be accessed on the website (images, ONNX.js model, …) and `src` which contains the file `App.svelte`. In this file, the content of the website is written.
In the `main` section of the Svelte file a image selector and two canvas where images can be shown are created like this.

```js
<input type="file" />
<br />
<canvas id="selectCanvas" width={imageSize} height={imageSize} />
<canvas id="selectStyleCanvas" width={imageSize} height={imageSize} />
```

A canvas reserves a place with a given resolution (in this case of the size `imageSize`). This object can be used to show the image, but is also handy to get the data of each single pixel. To show the selected image, the function `drawCanvas` can be used.

```js
function drawCanvas(imageSrc, canvasName, imageSize) {
  const canvas = document.getElementById(canvasName);
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
```

To get the pixel wise data of the selected image, the function `getData` is used.

```js
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
```

For the next step a few libaries need to be installed and imported.
Therefore install ONNX.js and two other libaries entering `yarn add ndarray`, `yarn add ndarray-ops` and `yarn add onnxjs` in the terminal, while beeing in the project folder. Afterwards these can be imported.

```js
import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor, InferenceSession } from "onnxjs";
```

The `Float32Array` of the image data can now be further transformed to match the required input dimensions.

```js
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
const inputTensor = new Tensor(
  new Float32Array(3 * imageSize * imageSize),
  "float32",
  [1, 3, imageSize, imageSize]
);
inputTensor.data.set(dataProcessed.data);
```

In the next step, the ONNX model is loaded and the `inputTensor` is used to perform the style transfer.

```js
let session = new InferenceSession({
  backendHint: "webgl",
});
await session.loadModel("gogh" + imageSize + ".onnx");
const outputMap = await session.run([inputTensor]);
let outputData = outputMap.values().next().value.data;
```

The resulting data is backtransformed to match the dataformat of an image:

```js
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
```

The `dataForImage` can be displayed on a canvas with the name `canvasName` using:

```js
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
```

All this is implemented [in this repro](https://github.com/kleinicke/fast_web_style_transfer) in the files `src/App.svelte` and `src/runStyle.js`

## Limitations

The limitations of this implementation is that in most browsers are temporal limits to compute the results. When it takes too long, a black image is returned. Since the runtime depends on the computer of the user, this is a hard to predict problem.
An additional problem is the usage of memory. While this is usually no problem on a computer, phones have harder rules on this. On iOS, an app is only allowed to use half of the total memory. Since the neural network is run in the browser app, the network can only allocate an even smaller fraction of the total memory. In devices with 4 GB of memory, it's somewhere around 1 to 1.5 GB. In this setup this is enough for a style transfer of an image with the resolution 200 times 200 pixels. Still older iPhones with 4 GB of Memory reload the website when an image with such an resolution is processed.
The solution to this problem might be to use TensorFlow.js instead of ONNX.js. This framework seems to be more advanced by now.

## Sources

I used several tutorials to help pages to build this solution.
How to use the ONNX model is explained in this [stackexchange answer](https://stackoverflow.com/questions/60281255/create-tensors-from-image-for-onnx-js/60301666#60301666).  
To optimize analyze the problem of the ONNX model [this](https://github.com/microsoft/onnxjs/issues/168) issue was helpful.

Some overall background was provided with [this very nice tutorial on youtube](https://www.youtube.com/watch?v=Vs730jsRgO8) and [this tutorial on medium](https://heartbeat.fritz.ai/building-an-image-recognition-app-using-onnx-js-c7147f4f291b).

Also thanks a lot to [Janosh Riebesell](https://github.com/janosh) for his help regarding web development.

## Contact

This website was created by Florian Kleinicke. Feel free to contact me [on Github](https://github.com/kleinicke) for questions and suggestions.
