let mImg;

function preload() {
  mImg = loadImage("../../imgs/GDTM.jpg");
}

function encodeImg(img) {
  img.loadPixels();
  return img.canvas.toDataURL("image/jpeg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(20);
}

let mCaption = "";
function draw() {
  background(220);
  image(mImg, 0, 0);
  text(mCaption, 0, mImg.height + 4, width, 200);
}

async function mousePressed() {
  let mMessages = [{
    role: "user",
    content: [
      { type: "text", text: "图中描绘了什么景象？" },
      { type: "image_url", image_url: { url: encodeImg(mImg) } },
    ],
  }];
  mCaption = await qwenchatCompletion(mMessages);
}
