export const mdText = `# How to perform a neural style transfer on a website using onnx.js

Neural networks are becoming more powerful. In this tutorial I explore the possibilities of neural networks running in a browser. I chose to use a fast neural style transfer that was implemented in the PyTorch examples. Sadly it had to be modified to be compatible with onnx.js. This modified network is trained using Google Colab and the resulting model exported as a onnx model. This model is used on a simple website using svelte and hosted using netlify. Therefore every step in this tutorial can be repeated by everyone without any costs or special hardware requirements.
 In the end I'll point out the problems and limitations of onnx.js.
This tutorial is for developers that know PyTorch and neural style transfer, but want to learn how to present these results in the browser.
If you just want to work with the finished code:

- [Here](https://github.com/kleinicke/onnx_small_style) is the code to train the model.
- Use [this colab notebook](https://colab.research.google.com/drive/15Uo8C-maoLmOJdOC54_rTo_lORNHZ29P?usp=sharing) to train a model
- Add the trained model to [this website](https://github.com/kleinicke/fast_web_style_transfer)
- publish the website on [netlify](https://www.netlify.com)
`;

// A fast neural style transfer is implemented in the [pytorch examples](https://github.com/pytorch/examples/tree/master/fast_neural_style).
// Following this implementation, a model is trained. The finished model can be exported as a onnx model using
// torch.onnx.\_export( style_model, content_image, path, opset_version=11)
// Here the opset_version describes the instruction set the onnx model is familiar with. Each instruction of PyTorch and Tensorflow and other frameworks had to be reimplemented in onnx. Which function is supported in which version is described here.
// Sadly onnx.js is still in an early stage (for years now) and doesn't support all important features. Their current version 0.18 supports mainly opset_version 7. The complete list of compatible instructions is listed here. Especially there are problems with upsampling, which is usually used for a fast neural style transfer. Therefore we have no other option than to change the style transfer model to not use upsampling. The finished new model [can be found here](https://github.com/kleinicke/onnx_small_style).

// After the modifications, the model is trained. An easy way to train such a model is to use Google Colab. The training takes about 4 hours to get good results. [Here is a notebook](https://colab.research.google.com/drive/15Uo8C-maoLmOJdOC54_rTo_lORNHZ29P?usp=sharing), ready to use with all modifications. The style, the model is trained of is chosen by the parameter `--style-image onnx_small_style/images/style-images/Van_Gogh.jpg`. This style image could be replaced by you with any other image. The training for two epochs takes about four hours. Afterwards the model is trained well.
// The full command to run the model is:

// ```bash
// python neural_style/neural_style.py train --dataset dataset --style-image images/style-images/candy.jpg --save-model-dir model --epochs 2 --cuda 1
// ```

// The model need to be downloaded before the notebook is suspended. Therefore regularly check the process and be come back shortly after the training ended.
// In the next step the model needs to be converted to an onnx model. This can also be done locally with the following command.

// ```bash
// python neural_style/neural_style.py eval --content-image images/content-images/amber.jpg  --model model/epoch_2_Wed_Dec_30_03\:34\:46_2020_100000.0_10000000000.0.model --output-image results/firsteval.jpg --cuda 0 --export_onnx model/style32.onnx
// ```"
