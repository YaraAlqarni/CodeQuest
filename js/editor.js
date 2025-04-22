let editor;

require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' } });
require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: 'print("Hello, World!")',
    language: 'python',
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 24
  });
});

async function runCode() {
  const code = editor.getValue();
  const languageId = document.getElementById("language").value;

  const payload = {
    source_code: code,
    language_id: parseInt(languageId),
    stdin: "",
  };

  document.getElementById("output").textContent = "Running...";

  try {
    const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "dc9a650d89msh466d2517247f182p13b888jsnd477e804ad4f", // Replace with your working RapidAPI key
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const output = result.stdout || result.stderr || result.compile_output || "No output.";
    document.getElementById("output").textContent = output;
  } catch (err) {
    document.getElementById("output").textContent = "Error: " + err.message;
  }
}
