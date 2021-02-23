<script>
  import { prepare_n_run_style, draw_canvas } from "./run_style.js";

  let image_size = 200; // options are 135, 270, 360 and 540

  function toFloat(image) {
    console.log("toFloat");
    console.log(image);
    ctx.drawImage(img, 0, 0);
    var imgData = ctx.getImageData(x, y, width, height).data;
    floatImage = new Float32Array(image);
    console.log(floatImage);
  }
  let selected_image;
  const beginning_size = image_size;
  function init() {
    draw_canvas("amber.jpg", "fixedCanvas", beginning_size);
    prepare_n_run_style("amber.jpg", "fixedStyleCanvas", beginning_size);
    window.addEventListener("load", function () {
      document
        .querySelector('input[type="file"]')
        .addEventListener("change", function () {
          if (this.files && this.files[0]) {
            // var image = document.querySelector("img");
            var img = document.querySelector("img");
            selected_image = URL.createObjectURL(this.files[0]);
            draw_canvas(
              URL.createObjectURL(this.files[0]),
              "selectCanvas",
              image_size
            );
            prepare_n_run_style(
              URL.createObjectURL(this.files[0]),
              "selectStyleCanvas",
              image_size
            );
          }
        });
    });
  }
  document.addEventListener("DOMContentLoaded", init, false);
</script>

<main>
  <datalist id="image_size_options">
    <option value="135" /><option value="270" /><option value="360" /><option
      value="540"
    /></datalist
  >
  <h2>Lets perform a Style transfer on a pre-selected image</h2>
  <br />

  <canvas id="fixedCanvas" width={beginning_size} height={beginning_size} />
  <canvas
    id="fixedStyleCanvas"
    width={beginning_size}
    height={beginning_size}
  />

  <h2>Now it's your turn. Choose your own image and see the result</h2>
  <br />

  <input type="file" />
  <br />
  <!-- <img bind:src={selected_image} alt="your image" /> -->
  <canvas id="selectCanvas" width={image_size} height={image_size} />
  <canvas id="selectStyleCanvas" width={image_size} height={image_size} />

  <h2>You can also modify the size of the images</h2>
  <br />
  <h2>
    (enter 135, 200, 270, 300, 350 or 540 and choose a different image
    afterwards)
  </h2>

  <label>
    For iPhones:
    <input type="radio" bind:group={image_size} value={135} />
    135
    <!-- </label>
  <label> -->
    <input type="radio" bind:group={image_size} value={200} />
    200
  </label>
  <label>
    For Macs:
    <input type="radio" bind:group={image_size} value={270} />
    270
    <input type="radio" bind:group={image_size} value={300} />
    300
  </label>
  <label>
    My browser gives up on those:
    <input type="radio" bind:group={image_size} value={350} />
    350
    <input type="radio" bind:group={image_size} value={540} />
    540
  </label>
  <label>
    <input type="number" bind:value={image_size} />
    <!--list="image_size_options"-->
    <!-- <input type="range" bind:value={image_size} list="image_size_options" /> -->
  </label>

  <!-- <select name="cars" id="cars">
    <option bind:value={image_size}>135</option>
    <option bind:value={image_size}>270</option>
    <option bind:value={image_size}>360</option>
    <option bind:value={image_size}>540</option>
  </select> -->
  <h2>
    The code is available <a
      href="https://github.com/kleinicke/fast_web_style_transfer"
      >here on github</a
    > and a tutorial is in the works
  </h2>
</main>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>
