let API_URL = "https://api.openai.com/v1/images/generations";

async function imageGeneration(prompt, model = "dall-e-2", n_images = 1, size = 1024) {
  let res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      model,
      prompt,
      n: n_images,
      size: `${size}x${size}`,
      response_format: "b64_json",
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
  });
  let json = await res.json();
  return json.data;
}
