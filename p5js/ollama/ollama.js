let Ollama;

async function loadModule() {
  try {
    const module = await import("https://cdn.jsdelivr.net/npm/ollama@0.5.13/browser/+esm");
    Ollama = module.Ollama;
  } catch (error) {
    console.error("Failed to load module:", error);
  }
}

loadModule();
