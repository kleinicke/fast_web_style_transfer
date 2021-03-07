<script>
  import { prepareAndRunStyle, draw_canvas } from "./runStyle.js";

  const initialSize = 200;
  let imageSize = initialSize; // options are 135, 270, 360 and 540

  // function toFloat(image) {
  //   ctx.drawImage(img, 0, 0);
  //   let imgData = ctx.getImageData(x, y, width, height).data;
  //   floatImage = new Float32Array(image);
  // }

  let style = "gogh"; // gogh
  function init() {
    draw_canvas("birds.jpg", "fixedCanvas", initialSize);
    prepareAndRunStyle("birds.jpg", "fixedStyleCanvas", initialSize, style);
    window.addEventListener("load", function () {
      document
        .querySelector('input[type="file"]')
        .addEventListener("change", function () {
          if (this.files && this.files[0]) {
            let selectedImg = URL.createObjectURL(this.files[0]);
            draw_canvas(selectedImg, "selectCanvas", imageSize);
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
</script>

<main>
  <datalist id="image_size_options">
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
      <!--list="image_size_options"-->
      <!-- <input type="range" bind:value={image_size} list="image_size_options" /> -->
    </label>
  {:else if style === `gogh`}
    {#each [200, 300, 350, 400, 500, 1000, 1500, 4000] as value}
      <input type="radio" bind:group={imageSize} {value} />&emsp;{value}&emsp;
    {/each}
  {/if}

  <h2>
    The code is available <a
      href="https://github.com/kleinicke/fast_web_style_transfer">on GitHub</a
    > and a tutorial is in the works.
  </h2>
</main>

<style>
  main {
    text-align: center;
  }
</style>
