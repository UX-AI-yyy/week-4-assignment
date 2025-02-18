import gc

from torch.cuda import empty_cache
from torchvision import transforms

def clear_from_gpu(pipe):
  pipe = pipe.to("cpu")
  del pipe
  gc.collect()
  empty_cache()

def StableDiffusionImageVariationProcessor(img):
  processor = transforms.Compose([
    transforms.ToTensor(),
    transforms.Resize(
      (224, 224),
      interpolation=transforms.InterpolationMode.BICUBIC,
      antialias=False),
    transforms.Normalize(
      [0.48145466, 0.4578275, 0.40821073],
      [0.26862954, 0.26130258, 0.27577711]),
  ])

  return processor(img.convert("RGB"))

