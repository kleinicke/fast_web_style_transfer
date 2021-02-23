<script>
  // let files;
  // let src;
  // let onnxFile;
  // let mnistImage;
  // let mnistPath;
  // let objectURL;
  // let floatImage;
  // import { Tensor, InferenceSession } from "onnxjs";
  // import { fastStyle } from "./run_onnx.js";
  import { prepare_n_run_style, draw_canvas } from "./ai_stuff/run_style.js";
  //import app2 from "App2";

  function toFloat(image) {
    console.log("toFloat");
    console.log(image);
    ctx.drawImage(img, 0, 0);
    var imgData = ctx.getImageData(x, y, width, height).data;
    floatImage = new Float32Array(image);
    console.log(floatImage);
  }
  // var canvas = document.createElement("canvas");
  var image_size = 135;
  function init() {
    // Run your javascript code here

    draw_canvas("amber.jpg", "fixedCanvas", image_size);
    prepare_n_run_style("amber.jpg", "fixedStyleCanvas");
    window.addEventListener("load", function () {
      document
        .querySelector('input[type="file"]')
        .addEventListener("change", function () {
          if (this.files && this.files[0]) {
            // var image = document.querySelector("img");
            var img = document.querySelector("img");
            draw_canvas(
              URL.createObjectURL(this.files[0]),
              "selectCanvas",
              image_size
            );
            prepare_n_run_style(
              URL.createObjectURL(this.files[0]),
              "selectStyleCanvas"
            );

            // const canvas = document.getElementById("selectCanvas");
            // const ctx = canvas.getContext("2d");
            // const image = new Image(image_size, image_size);
            // image.src = URL.createObjectURL(this.files[0]);
            // function drawImageActualSize() {
            //   canvas.width = image_size; //this.naturalWidth;
            //   canvas.height = image_size; //this.naturalHeight;
            //   ctx.drawImage(this, 0, 0, this.width, this.height);
            // }
            // image.onload = drawImageActualSize;
            // console.log("image", image);
            // img.onload = () => {
            //   URL.revokeObjectURL(img.src); // no longer needed, free memory
            // };

            // img.src = URL.createObjectURL(this.files[0]); // set src to blob url
          }
        });
    });
  }
  document.addEventListener("DOMContentLoaded", init, false);
</script>

<main>
  <!-- <canvas id="canvas" /> -->
  <!-- {document.getElementById("canvas")} -->
  <!-- <body onload="Test1();"> -->
  <h2>Lets perform a Style transfer on a pre-selected image</h2>
  <br />
  <canvas id="fixedCanvas" width={image_size} height={image_size} />
  <canvas id="fixedStyleCanvas" width={image_size} height={image_size} />
  <!-- </body> -->
  <h2>Now it's your turn. Choose your own image and see the result</h2>
  <!--{src = window.URL.createObjectURL(files[0])}-->
  <br />
  <input type="file" />
  <br />
  <!-- <img src="ChristmasLogo.png" alt="your image" width={image_size} height={image_size} /> -->
  <!-- <br /><img id="myImg" src="#" width={image_size} height={image_size} /> -->
  <canvas id="selectCanvas" width={image_size} height={image_size} />
  <canvas id="selectStyleCanvas" width={image_size} height={image_size} />
  <!-- {#if objectURL}
    objectURL
    {console.log("objectURL")}
    {console.log(objectURL)}
    <img src={objectURL} alt="your image" width="256" height="256" />
  {/if} -->
  <!-- {document.getElementById("canvas")} -->
</main>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>
