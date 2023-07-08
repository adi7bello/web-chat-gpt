const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const apiKeyForm = document.getElementById("apiKeyForm");
const apiKeyInput = document.getElementById("apiKeyInput");
const commandForm = document.getElementById("commandForm");
const commandInput = document.getElementById("commandInput");
let apiKey = "";

// Cek apakah ada referensi perintah yang disimpan di localStorage
const storedCommand = localStorage.getItem("commandReference");
if (storedCommand) {
  commandInput.value = storedCommand;
}

function appendMessage(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerHTML = `<p>${message}</p>`;
  chatbox.appendChild(messageDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function toggleAccordion(event) {
  const accordionItem = event.target.closest('.accordion-item');
  const accordionContent = accordionItem.querySelector('.accordion-content');
  accordionItem.classList.toggle('open');
  accordionContent.style.display = accordionItem.classList.contains('open') ? 'block' : 'none';
}

apiKeyForm.addEventListener("submit", function(event) {
  event.preventDefault();
  apiKey = apiKeyInput.value;
  apiKeyInput.value = "";
  apiKeyInput.disabled = true;
  apiKeyInput.placeholder = "Terhubung dengan API Anda";
});

commandForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const commandReference = commandInput.value.trim();
  commandInput.value = "";

  // Simpan referensi perintah ke dalam localStorage
  localStorage.setItem("commandReference", commandReference);
});

userInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    const userMessage = userInput.value;
    userInput.value = "";
    appendMessage(userMessage, "sent");

    if (!apiKey) {
      const errorMessage = "API Key belum terhubung. Silakan masukkan API Key.";
      appendMessage(errorMessage, "received");
      return;
    }

    if (commandInput.value !== "") {
      appendMessage(`Referensi Perintah:<br>${commandInput.value}`, "received");
      return;
    }

    const selectedModel = "gpt-3.5-turbo";

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        "model": selectedModel,
        "messages": [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": userMessage}
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
      const chatResponse = data.choices[0].message.content;
      appendMessage(chatResponse, "received");
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
});
