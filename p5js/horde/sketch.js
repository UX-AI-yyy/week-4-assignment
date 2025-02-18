let mImg;
let mDim;

let mInput;
let mButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mDim = min(width / 2 - 8, (height - 32) / 2 - 8);
  textSize(20);

  mInput = createInput("A picture of a cyborg smoking a cigarette in the 1940s");
  mInput.position(4, 4);
  mInput.size(2 * mDim + 4, 24);

  mButton = createButton("Generate");
  mButton.position(2 * mDim + 12, 4);
  mButton.mousePressed(runGenerate);
}

function draw() {
  background(220);
  if (mImg) {
    image(mImg, 4, 32, mDim, mDim);
  } else {
    rect(4, 32, mDim, mDim);
  }
}

function runLoadImage(url) {
  mImg = loadImage(url);
}

function runGenerate() {
  print(mInput.value());
  generateImageAsync(mInput.value(), runLoadImage);
}
