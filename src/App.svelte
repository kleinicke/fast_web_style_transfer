<script>
  import { prepare_n_run_style, draw_canvas } from "./run_style.js";

  function toFloat(image) {
    console.log("toFloat");
    console.log(image);
    ctx.drawImage(img, 0, 0);
    var imgData = ctx.getImageData(x, y, width, height).data;
    floatImage = new Float32Array(image);
    console.log(floatImage);
  }
  var image_size = 135;
  function init() {
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
          }
        });
    });
  }
  document.addEventListener("DOMContentLoaded", init, false);
</script>

<main>
  <h2>Lets perform a Style transfer on a pre-selected image</h2>
  <br />

  <canvas id="fixedCanvas" width={image_size} height={image_size} />
  <canvas id="fixedStyleCanvas" width={image_size} height={image_size} />

  <h2>Now it's your turn. Choose your own image and see the result</h2>
  <br />

  <input type="file" />
  <br />

  <canvas id="selectCanvas" width={image_size} height={image_size} />
  <canvas id="selectStyleCanvas" width={image_size} height={image_size} />
</main>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>
