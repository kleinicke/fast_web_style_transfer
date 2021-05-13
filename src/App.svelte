<script>
  import { prepareAndRunStyle, drawCanvas } from "./runStyle.js";
  import Tutorial from "./Tutorial.svelte";
  import { onMount } from "svelte";

  let hasLoaded = false;
  let fileSelected = false;
  let selectedImg = "";
  let canvasSize = 135;
  let style = "gogh"; //"candy" "rain"
  let contentImage = "birds";
  let selectSize = 135;
  let selectStyle = "gogh"; //"candy" "rain"
  // $: if (typeof window !== 'undefined') {
  $: drawCanvas(contentImage + ".jpg", "contentCanvas", canvasSize, hasLoaded);
  $: drawCanvas(style + ".jpg", "styleCanvas", 200, hasLoaded);

  $: prepareAndRunStyle(
    contentImage + ".jpg",
    "resultCanvas",
    canvasSize,
    style,
    hasLoaded
  );
  $: prepareAndRunStyle(
    selectedImg,
    "selectResultCanvas",
    selectSize,
    selectStyle,
    fileSelected
  );
  $: drawCanvas(selectedImg, "selectContentCanvas", selectSize, fileSelected);
  $: drawCanvas(selectStyle + ".jpg", "selectStyleCanvas", 200, hasLoaded);

  onMount(async () => {
    hasLoaded = true;
    console.log("loaded");
    document
      .querySelector('input[type="file"]')
      .addEventListener("change", function () {
        if (this.files && this.files[0]) {
          selectedImg = URL.createObjectURL(this.files[0]);
          fileSelected = true;
        }
      });
  });
</script>

<!-- <Nav/> -->
<main>
  <h2>Lets perform a style transfer on a few of my images</h2>
  <canvas id="styleCanvas" width={200} height={200} />
  <h3>You can change style and size:</h3>
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
  Size:
  {#each [135, 200, 300, 350, 500] as value}
    <input type="radio" bind:group={canvasSize} {value} />&emsp;{value}&emsp;
  {/each}
  px in both dimensions.
  <!-- <br /> -->
  <h4>
    The maximum possible size depends on your device. Large sizes might lead to
    problems.
  </h4>
  <!-- <br /> -->
  <label>
    Content image:
    <input type="radio" bind:group={contentImage} value="birds" />
    Birds
    <input type="radio" bind:group={contentImage} value="neckar" />
    Neckar
    <input type="radio" bind:group={contentImage} value="castle" />
    Castle
    <input type="radio" bind:group={contentImage} value="neckarfront" />
    Neckarfront
  </label>
  <br /><br />

  <canvas id="contentCanvas" width={canvasSize} height={canvasSize} />
  <canvas id="resultCanvas" width={canvasSize} height={canvasSize} />

  <h2>The complete style transfer is run locally on your computer.</h2>
  <h4>
    Sadly the style is applied on a very small level, so the bigger elements of
    the original style are not applied.
  </h4>
  <h2>
    Now it's your turn. Choose a style and your own content image and see the
    result:
  </h2>
  <canvas id="selectStyleCanvas" width={200} height={200} />
  <label>
    Style:
    <input type="radio" bind:group={selectStyle} value="gogh" />
    Van Gogh
    <input type="radio" bind:group={selectStyle} value="candy" />
    Candy
    <input type="radio" bind:group={selectStyle} value="rain" />
    Rain Princess
  </label>
  <br />
  Size:
  {#each [135, 200, 300, 350, 500] as value}
    <input type="radio" bind:group={selectSize} {value} />&emsp;{value}&emsp;
  {/each}
  px in both dimensions. <br />
  Content image: <input type="file" />
  <br />
  The maximum possible size depends on your device. Large sizes might lead to problems.
  <br /><br />

  <canvas id="selectContentCanvas" width={canvasSize} height={canvasSize} />
  <canvas id="selectResultCanvas" width={canvasSize} height={canvasSize} />

  <h2>
    The code of this website is available <a
      href="https://github.com/kleinicke/fast_web_style_transfer">on GitHub</a
    >.
  </h2>
  <h2>
    A tutorial how to build this site and train the corresponding website is
    available
    <a
      href="https://github.com/kleinicke/fast_web_style_transfer/blob/master/src/tutorial.md"
      >on GitHub</a
    >
    and
    <a
      href="https://kleinicke.medium.com/how-to-perform-a-neural-style-transfer-on-a-website-using-onnx-js-85b8dbb745d8"
      >on medium</a
    >.
  </h2>
</main>

<style>
  main {
    text-align: center;
    padding-bottom: 100px;
  }
</style>
