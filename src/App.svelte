<script>
  import { prepareAndRunStyle, drawCanvas } from "./runStyle.js";
  import SvelteMarkdown from 'svelte-markdown';
  import {mdText} from './tutorial.js'
  const initialSize = 135;
  let imageSize = initialSize; // options are 135, 270, 360 and 540

  // function toFloat(image) {
  //   ctx.drawImage(img, 0, 0);
  //   let imgData = ctx.getImageData(x, y, width, height).data;
  //   floatImage = new Float32Array(image);
  // }

  let style = "candy" // gogh
  function init() {
    drawCanvas("birds.jpg", "fixedCanvas", initialSize);
    prepareAndRunStyle("birds.jpg", "fixedStyleCanvas", initialSize, style);
    window.addEventListener("load", function () {
      document
        .querySelector('input[type="file"]')
        .addEventListener("change", function () {
          if (this.files && this.files[0]) {
            let selectedImg = URL.createObjectURL(this.files[0]);
            drawCanvas(selectedImg, "selectCanvas", imageSize);
            prepareAndRunStyle(
              selectedImg,
              "selectStyleCanvas",
              imageSize,
              style
            );
          }
        });
    });
  }
  document.addEventListener("DOMContentLoaded", init, false);

  const oldmdText = `# How to perform a neural style transfer on a website using onnx.js

Neural networks are becoming more powerful. In this tutorial I explore the possibilities of neural networks running in a browser. I chose to use a fast neural style transfer that was implemented in the PyTorch examples. Sadly it had to be modified to be compatible with onnx.js. This modified network is trained using Google Colab and the resulting model exported as a onnx model. This model is used on a simple website using svelte and hosted using netlify. Therefore every step in this tutorial can be repeated by everyone without any costs or special hardware requirements.
 In the end I'll point out the problems and limitations of onnx.js.
This tutorial is for developers that know PyTorch and neural style transfer, but want to learn how to present these results in the browser.
If you just want to work with the finished code:
- [Here](https://github.com/kleinicke/onnx_small_style) is the code to train the model.
- Use [this colab notebook](https://colab.research.google.com/drive/15Uo8C-maoLmOJdOC54_rTo_lORNHZ29P?usp=sharing) to train a model
- Add the trained model to [this website](https://github.com/kleinicke/fast_web_style_transfer)
- publish the website on [netlify](https://www.netlify.com)
`
</script>

<main>
  <datalist id="imageSizeOptions">
    <option value="135" /><option value="270" /><option value="360" /><option
      value="540"
    /></datalist
  >

  <h2>Lets perform a Style transfer on a pre-selected image</h2>
  <br />

  <canvas id="fixedCanvas" width={initialSize} height={initialSize} />
  <canvas id="fixedStyleCanvas" width={initialSize} height={initialSize} />

  <h2>
    Now it's your turn. Choose a style and your own image and see the result
  </h2>
  <label>
    Style:
    <input type="radio" bind:group={style} value="gogh" />
    Van Gogh
    <input type="radio" bind:group={style} value="candy" />
    Candy
  </label>
  <br />

  <input type="file" />
  <br />
  <!-- <img bind:src={selected_image} alt="your image" /> -->
  <canvas id="selectCanvas" width={imageSize} height={imageSize} />
  <canvas id="selectStyleCanvas" width={imageSize} height={imageSize} />

  <h2>You can also modify the size of the images</h2>
  <br />
  <h2>
    (enter 135, 200, 270, 300, 350 or 540 and choose a different image
    afterwards)
  </h2>

  {#if style === `candy`}
    <label>
      For iPhones (with 4GB memory):
      <input type="radio" bind:group={imageSize} value={135} />
      135
      <!-- </label>
  <label> -->
      <input type="radio" bind:group={imageSize} value={200} />
      200
    </label>
    <label>
      For some Macs without GPU:
      <input type="radio" bind:group={imageSize} value={270} />
      270
      <input type="radio" bind:group={imageSize} value={300} />
      300
    </label>
    <label>
      With more power:
      <input type="radio" bind:group={imageSize} value={350} />
      350
      <input type="radio" bind:group={imageSize} value={540} />
      540
    </label>
    <label>
      <input type="number" bind:value={imageSize} />
      <!--list="imageSizeOptions"-->
      <!-- <input type="range" bind:value={imageSize} list="imageSizeOptions" /> -->
    </label>
  {:else if style === `gogh`}
    {#each [200, 300, 350, 400, 500, 1000, 1500, 4000] as value}
      <input type="radio" bind:group={imageSize} {value} />&emsp;{value}&emsp;
    {/each}
  {/if}

  <h2>
    The code of this website is available <a
      href="https://github.com/kleinicke/fast_web_style_transfer">on GitHub</a
    > and a tutorial is in the works.
  </h2>  

</main>
<infotext>
  <SvelteMarkdown source={mdText}/>
</infotext>

<style>
  main {
    text-align: center;
  }
  infotext {
    text-align: left;
    padding: 25px 500px 75px;
  }
</style>
