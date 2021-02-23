import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import { Tensor, InferenceSession } from "onnxjs";


async function runOnnx(inputTensor,canvas_name,image_size) {
    // Creat the session and load the pre-trained model
    const session = new InferenceSession({
        backendHint: 'webgl'
    });
    if (image_size == 135){
        await session.loadModel("small135.onnx");
    }else if (image_size == 200){
        await session.loadModel("small200.onnx");
    }else if (image_size == 270){
        await session.loadModel("small270.onnx");
    }else if (image_size == 300){
        await session.loadModel("small300.onnx");
    }else if (image_size == 350){
        await session.loadModel("small350.onnx");
    }else if (image_size == 540){
        await session.loadModel("small540.onnx");//small_135
    }

    // Run model with Tensor inputs and get the result.
        // console.log("input_pre!!!",preprocessedData)
        // const inputTensor = new onnx.Tensor(preprocessedData, 'float32');
        console.log("input!!!",inputTensor)
        const outputMap = await session.run([inputTensor]);
        var outputData = outputMap.values().next().value.data;
        console.log("result!!!",outputMap,outputData,inputTensor,outputMap.values().next().value)
        // outputData=inputTensor.data // ignores model

        var test = new Float32Array(outputData);
        console.log("test",test)

        const dataFromImage = ndarray(new Float32Array(image_size * image_size * 4), [image_size, image_size, 4]);
        const dataProcessed = ndarray(new Float32Array(outputData), [1, 3, image_size, image_size]);
        console.log("data2",dataFromImage,dataProcessed)
        // ops.assign(dataFromImage.pick(null, null, 3),255);//todo change!
        ops.assign(dataFromImage.pick(null, null, 0),dataProcessed.pick(0, 0, null, null));
        ops.assign(dataFromImage.pick(null, null, 1),dataProcessed.pick(0, 1, null, null));
        ops.assign(dataFromImage.pick(null, null, 2),dataProcessed.pick(0, 2, null, null));
        var dataForImage=dataFromImage.data
        for(var y = 0; y < image_size; y++) {
            for(var x = 0; x < image_size; x++) {
                var pos = (y * image_size + x) * 4; // position in buffer based on x and y
                dataForImage[pos+3] = 255;           // set alpha channel
            }
        }
        console.log("image",dataFromImage,dataForImage)
        
        // buffer = new Uint8ClampedArray(image_size * image_size * 4);
        // var canvas = document.createElement('canvas'),
        var canvas = document.getElementById(canvas_name);

        var ctx = canvas.getContext('2d');

        canvas.width = image_size;
        canvas.height = image_size;

        // create imageData object
        var idata = ctx.createImageData(image_size, image_size);

        // set our buffer as source
        idata.data.set(dataForImage);

        // update canvas with new data
        ctx.putImageData(idata, 0, 0);


        console.log(ctx)


        // var canvas = document.createElement("canvas");
        // const ctx = canvas.getContext('2d');
        // var imgData = ctx.createImageData(image_size, image_size); // width x height
        // var data = imgData.data;
        // // <img outputData alt="your image" width="image_size" height="image_size" />
        // for (var i = 0, len = image_size * image_size * 4; i < len; i++) {
        //     data[i] = outputData[i];
        // }

        // // now we can draw our imagedata onto the canvas
        // ctx.putImageData(imgData, 0, 0);



        }

export function draw_canvas(image_src,canvas_name,image_size){
    const canvas = document.getElementById(canvas_name);
    console.log("c",canvas)
        const ctx = canvas.getContext('2d');
        const image = new Image(image_size, image_size);
        image.src = image_src;
        function drawImageActualSize() {
            canvas.width = image_size//this.naturalWidth;
            canvas.height = image_size//this.naturalHeight;
            ctx.drawImage(this, 0, 0, this.width, this.height);

    }
    image.onload = drawImageActualSize; 
    
    

}

export function prepare_n_run_style(image_src,result_canvas,image_size){
    // const canvas = document.getElementById('beforeCanvas');
    var canvas = document.createElement("canvas");
    // console.log(canvas)
    const ctx = canvas.getContext('2d');

    const image = new Image(image_size, image_size); // Using optional size for image
    

    // Load an image of intrinsic size 300x227 in CSS pixels
    // image.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
    // image.src = 'ChristmasLogo.png';
    // image.src = 'amber.jpg';
    image.src = image_src;

    function drawImageActualSize() {
        console.log('drawImageActualSize')
        // Use the intrinsic size of image in CSS pixels for the canvas element
        canvas.width = image_size//this.naturalWidth;
        canvas.height = image_size//this.naturalHeight;

        // Will draw the image as 300x227, ignoring the custom size of 60x45
        // given in the constructor
        ctx.drawImage(this, 0, 0);

        // To use the custom size we'll have to specify the scale parameters
        // using the element's width and height properties - lets draw one
        // on top in the corner:
        ctx.drawImage(this, 0, 0, this.width, this.height);
        const imgData = ctx.getImageData(0, 0, image_size, image_size);
        var f_canvas = new Float32Array(imgData.data)
        const input = new Tensor(new Float32Array(imgData.data), "float32");

        console.log("canvas2",imgData,f_canvas,input)
        const dataFromImage = ndarray(new Float32Array(imgData.data), [canvas.width, canvas.height, 4]);
        const dataProcessed = ndarray(new Float32Array(canvas.width * canvas.height * 3), [1, 3, canvas.height, canvas.width]);
        console.log("data2",imgData.data,dataFromImage,dataProcessed)
        ops.assign(dataProcessed.pick(0, 2, null, null), dataFromImage.pick(null, null, 2));
        ops.assign(dataProcessed.pick(0, 1, null, null), dataFromImage.pick(null, null, 1));
        ops.assign(dataProcessed.pick(0, 0, null, null), dataFromImage.pick(null, null, 0));
        console.log("data3",imgData.data,dataFromImage,dataProcessed)
        const tensor = new Tensor(new Float32Array(3 * canvas.width * canvas.height), 'float32', [1, 3, canvas.width, canvas.height]);
        // (tensor.data as Float32Array).set(dataProcessed.data);
        (tensor.data).set(dataProcessed.data);
        console.log("tensor",tensor)
        runOnnx(tensor,result_canvas,image_size)
        // draw_canvas(image.src,'beforeCanvas',image_size)
        // canvas_old(image.src)
        

        
    }      
    image.onload = drawImageActualSize; // Draw when image has loaded

}