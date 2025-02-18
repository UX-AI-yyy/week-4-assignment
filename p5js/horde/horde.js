let API_URL = "https://aihorde.net/api/v2/generate";

const hordeParams = {
  prompt: "prompt",
  params: {
    sampler_name: "k_euler",
    cfg_scale: 4,
    denoising_strength: 1,
    seed: `${Math.random().toFixed(10)}`,
    height: 512,
    width: 512,
    seed_variation: 1,
    post_processing: [],
    post_processing_order: "facefixers_first",
    karras: true,
    tiling: false,
    hires_fix: false,
    clip_skip: 1,
    loras: [
      {
        name: "GlowingRunesAI",
        model: 1,
        clip: 1,
        inject_trigger: "any",
        is_version: false
      }
    ],
    use_nsfw_censor: false,
    steps: 30,
    n: 1
  },
  nsfw: false,
  trusted_workers: false,
  slow_workers: true,
  extra_slow_workers: false,
  censor_nsfw: false,
  workers: [],
  worker_blacklist: false,
  models: [
    "AlbedoBase XL (SDXL)"
  ],
  source_processing: "img2img",
  r2: true,
  shared: false,
  replacement_filter: true,
  dry_run: false
}

const hordeHeaders = {
  "accept": "application/json",
  "apikey": "0000000000",
  "Client-Agent": "unknown:0:unknown",
  "Content-Type": "application/json; charset=UTF-8",
}

async function imageStatus(id, cb) {
  let res = await fetch(`${API_URL}/status/${id}`, {
    method: "GET",
    headers: hordeHeaders,
  });
  let json = await res.json();

  cb(json.generations[0].img);
}

async function imageCheck(id, cb) {
  print("checking....");
  let res = await fetch(`${API_URL}/check/${id}`, {
    method: "GET",
    headers: hordeHeaders,
  });
  let json = await res.json();

  if (("done" in json) && json.done) {
    imageStatus(id, cb);
  } else {
    setTimeout(() => imageCheck(id, cb), 2000);
  }
}

async function generateImageAsync(prompt, cb, model = "AlbedoBase XL (SDXL)", n_images = 1, size = 512) {
  hordeParams.prompt = prompt;
  hordeParams.models = [model];
  hordeParams.params.n = n_images;
  hordeParams.params.width = size;
  hordeParams.params.height = size;
  hordeParams.params.seed = `${Math.random().toFixed(10)}`;

  let res = await fetch(`${API_URL}/async`, {
    method: "POST",
    body: JSON.stringify(hordeParams),
    headers: hordeHeaders,
  });
  let json = await res.json();

  if ("id" in json) {
    imageCheck(json.id, cb);
  } else {
    print("ERROR: no request id was generated");
  }
}
