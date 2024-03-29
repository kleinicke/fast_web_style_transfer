# Fast neural style transfer svelte website

[![Netlify Status](https://api.netlify.com/api/v1/badges/d0e692a2-1cf8-444d-a5e2-383b6103222d/deploy-status)](https://app.netlify.com/sites/fast-web-style-transfer/deploys)

This website uses onnx.js to apply a fast neural style transfer. It is used on <https://fast-web-style-transfer.netlify.app>. On that website a tutorial to build this website is provided.

The used model was created using the model I created [here](https://github.com/kleinicke/onnx_small_style). This can be run using [this google colab notebook](https://colab.research.google.com/drive/15Uo8C-maoLmOJdOC54_rTo_lORNHZ29P?usp=sharing).

The project is explained at: https://github.com/kleinicke/fast_web_style_transfer/blob/master/src/tutorial.md

## Setup

Running this site locally requires [`git`](https://git-scm.com) and [`yarn`](https://yarnpkg.com) (or [`npm`](https://npmjs.com)). With those installed, do:

1. Clone the repo and change into its directory.

   ```sh
   git clone https://github.com/kleinicke/fast_web_style_transfer && cd fast_web_style_transfer
   ```

2. Install dependencies.

   ```sh
   yarn
   ```

3. Start the dev server.

   ```sh
   yarn dev
   ```

## Svelte app

This is a project uses the template for [Svelte](https://svelte.dev) apps which lives at <https://github.com/sveltejs/template>.

<!-- ## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Using TypeScript

This template comes with a script to set up a TypeScript development environment, you can run it immediately after cloning the template with:

```bash
node scripts/setupTypeScript.js
```

Or remove the script via:

```bash
rm scripts/setupTypeScript.js
```

## Deploying to the web

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
``` -->
