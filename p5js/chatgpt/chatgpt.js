let API_URL = "https://api.openai.com/v1/chat/completions";

async function chatCompletion(messages, model = "gpt-4o-2024-08-06", max_tokens = 200) {
  let res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      model,
      max_tokens,
      messages,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
  });
  let json = await res.json();
  return json.choices[0].message.content;
}
