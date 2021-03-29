<script>
  import { prepareAndRunStyle, drawCanvas } from "./runStyle.js";
  import SvelteMarkdown from 'svelte-markdown';
  // import Nav from './Nav.svelte'
  import Tutorial from './Tutorial.svelte'
  const initialSize = 135;
  let imageSize = initialSize; // options are 135, 270, 360 and 540
  let exampleSize = initialSize;

  const initialStyle =  "gogh" //"candy" "rain"
  let style = initialStyle
  let exampleStyle = initialStyle

  // function toFloat(image) {
  //   ctx.drawImage(img, 0, 0);
  //   let imgData = ctx.getImageData(x, y, width, height).data;
  //   floatImage = new Float32Array(image);
  // }
  $: prepareAndRunStyle("birds.jpg", "fixedStyleCanvas", exampleSize, exampleStyle);
  function init() {
    drawCanvas("birds.jpg", "fixedCanvas", 300);
    // prepareAndRunStyle("birds.jpg", "fixedStyleCanvas", exampleSize, exampleStyle);
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

</script>
<!-- <Nav/> -->
<main>
  <datalist id="imageSizeOptions">
    <option value="135" /><option value="270" /><option value="360" /><option
      value="540"
    /></datalist
  >

  <h2>Lets perform a style transfer on a pre-selected image</h2>
  <h3>You can change style and size:</h3>
  <label>
    Style:
    <input type="radio" bind:group={exampleStyle} value="gogh" />
    Van Gogh
    <input type="radio" bind:group={exampleStyle} value="candy" />
    Candy
    <input type="radio" bind:group={exampleStyle} value="rain" />
    Rain Princess
  </label>
  {#each [135,200, 300, 350] as value}
      <input type="radio" bind:group={exampleSize} {value} />&emsp;{value}&emsp;
    {/each}
  <br />

  <canvas id="fixedCanvas" width={300} height={300} />
  <canvas id="fixedStyleCanvas" width={initialSize} height={exampleSize} />

  <h2>
    Now it's your turn. Choose a style and your own content image and see the result
  </h2>
  <label>
    Style:
    <input type="radio" bind:group={style} value="gogh" />
    Van Gogh
    <input type="radio" bind:group={style} value="candy" />
    Candy
    <input type="radio" bind:group={style} value="rain" />
    Rain Princess
  </label>
  <br />

  <input type="file" />
  <br />
  <canvas id="selectCanvas" width={imageSize} height={imageSize} />
  <canvas id="selectStyleCanvas" width={imageSize} height={imageSize} />

  <h2>You can also modify the size of the images</h2>
  <br />
  <h2>
    (enter size and choose a different image
    afterwards. Large sizes might lead to problems.)
  </h2>

  {#if style === `candy`}
    <label>
      Small size (for phones):
      <input type="radio" bind:group={imageSize} value={135} />
      135
      <input type="radio" bind:group={imageSize} value={200} />
      200
    </label>
    <label>
      Good size (works on most computers):
      <input type="radio" bind:group={imageSize} value={270} />
      270
      <input type="radio" bind:group={imageSize} value={300} />
      300
    </label>
    <label>
      Large (requires some performance):
      <input type="radio" bind:group={imageSize} value={350} />
      350
      <input type="radio" bind:group={imageSize} value={540} />
      540
    </label>
    <!-- <label>
      <input type="number" bind:value={imageSize} />
    </label> -->
  {:else if style === `gogh` || style === `rain`}
    {#each [135,200, 300, 350, 400, 500, 1000] as value}
      <input type="radio" bind:group={imageSize} {value} />&emsp;{value}&emsp;
    {/each}
  {/if}

  <h2>
    The code of this website is available <a
      href="https://github.com/kleinicke/fast_web_style_transfer">on GitHub</a
    > and a first version of the tutorial is below.
  </h2>  
</main>
<Tutorial/>

<style>
  main {
    text-align: center;
  }
</style>
