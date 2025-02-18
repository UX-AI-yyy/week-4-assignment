let capture;
let w = 640, h = 480;
let waiting = false;
let emoji = [];
let emo = [
  "angry", "embarrassed", "scared", "happy", "confused", 
  "satisfaction", "sad", "bored", "excited", "disgusted"
];
let emoType = -1;
let photo;
let capturedPhoto = null; // 存储拍摄的图片

function preload() {
  for (let i = 0; i < emo.length; i++) {
    emoji.push(loadImage("assets/" + emo[i] + ".png"));
  }
  photo = loadImage("assets/photo.png");
}

function encodeImg(img) {
  let copy = img.get();
  copy.loadPixels();
  return copy.canvas.toDataURL("image/jpeg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  w = width * 0.4;
  h = w * 0.75;
  photo.resize(80, 80);
  for (let i = 0; i < emo.length; i++) {
    emoji[i].resize(160, 160);
  }
  capture = createCapture(VIDEO);
  capture.hide();
  textSize(20);
}

let mCaption = "";
let word = "Please choose one of these words to describe the emotion I express in the image: angry, embarrassed, scared, happy, confused, satisfied, sad, bored, excited, or disgusted? (You only can use the vocabulary I provided, do not make any changes to the part of speech, just use the original vocabulary) Then use one sentence to describe my emotion and give me an advise on my emotion.";

function draw() {
  background(200);

  // 显示实时摄像头画面（左侧）
  image(capture, width / 2 - w / 2, 0, w, h);

  // 显示拍照按钮
  if (mouseX > width / 2 - 40 && mouseX < width / 2 + 40 && mouseY > h + 80 && mouseY < h + 160) {
    tint(255, 100);
  }
  image(photo, width / 2 - 40, h + 80);
  noTint();

  // 显示 AI 生成的文本
  text(mCaption, 0, h + 200, width, 200);

  // 显示等待动画
  if (waiting) {
    waitingAnimation();
  }

  // 显示情绪表情（下方）
  if (emoType != -1) {
    image(emoji[emoType], width / 2 - emoji[0].width / 2 + 150, height - 380);
  }

  // 显示拍摄的照片（右侧，等比缩小）
  if (capturedPhoto) {
    let maxPhotoWidth = width * 0.3; // 右侧最大宽度
    let maxPhotoHeight = height * 0.5; // 右侧最大高度

    let photoW = capturedPhoto.width;
    let photoH = capturedPhoto.height;

    // 计算缩放比例，确保照片等比例缩小，不超出最大范围
    let scaleFactor = min(maxPhotoWidth / photoW, maxPhotoHeight / photoH);
    photoW *= scaleFactor;
    photoH *= scaleFactor;

    // 设置照片的显示位置（右侧）
    let photoX = width * 0.7; // 让照片在右侧
    let photoY = (height - photoH) / 2; // 垂直居中

    image(capturedPhoto, photoX, photoY, photoW, photoH);
  }
}

async function mousePressed() {
  if (mouseX > width / 2 - 40 && mouseX < width / 2 + 40 && mouseY > h + 80 && mouseY < h + 160) {
    // 确保摄像头已经就绪
    if (capture.loadedmetadata) {
      capturedPhoto = capture.get();
      console.log("Captured Image Size:", capturedPhoto.width, capturedPhoto.height);
    } else {
      console.log("Camera not ready yet!");
      return;
    }

    waiting = true;
    let mMessages = [{
      role: "user",
      content: [
        { type: "text", text: word },
        { type: "image_url", image_url: { url: encodeImg(capture) } },
      ],
    }];
    mCaption = await qwenchatCompletion(mMessages);
    parseEmotion(mCaption);
    print(mCaption);
    waiting = false;
  }
}

function waitingAnimation() {
  push();
  translate(width / 2, h + 120);
  rotate(frameCount * 0.08);
  for (let i = 0; i < 10; i++) {
    rotate(TWO_PI / 12);
    fill(0, 100);
    noStroke();
    ellipse(0, 50, 12);
  }
  pop();
}

function parseEmotion(text) {
  emoType = -1;
  let lowerText = text.toLowerCase();
  for (let i = 0; i < emo.length; i++) {
    if (lowerText.includes(emo[i])) {
      emoType = i;
      break;
    }
  }
  print(emoType);
}