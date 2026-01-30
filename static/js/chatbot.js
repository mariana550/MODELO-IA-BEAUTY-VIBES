const chatToggle = document.getElementById("chat-toggle");
const chatbot = document.getElementById("chatbot");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const chatInput = document.getElementById("chat-input");
const chatBody = document.getElementById("chat-body");

// Abrir / cerrar
chatToggle.addEventListener("click", () => chatbot.style.display = "flex");
closeChat.addEventListener("click", () => chatbot.style.display = "none");

sendBtn.addEventListener("click", enviarMensaje);
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") enviarMensaje();
});

let enviando = false;

async function enviarMensaje() {
  if (enviando) return;

  const texto = chatInput.value.trim();
  if (!texto) return;

  enviando = true;

  // Mensaje usuario
  const userDiv = document.createElement("div");
  userDiv.className = "user-msg";
  userDiv.textContent = texto;
  chatBody.appendChild(userDiv);

  chatInput.value = "";
  chatInput.disabled = true;
  sendBtn.disabled = true;

  // Indicador animado
  const typingDiv = document.createElement("div");
  typingDiv.className = "bot-msg typing";
  typingDiv.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;
  chatBody.appendChild(typingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    const response = await fetch("/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: texto })
    });

    const data = await response.json();

    chatBody.removeChild(typingDiv);

    const botDiv = document.createElement("div");
    botDiv.className = "bot-msg";
    botDiv.textContent = data.reply || "Ups 😥 intenta de nuevo.";
    chatBody.appendChild(botDiv);

  } catch (error) {
    chatBody.removeChild(typingDiv);

    const errorDiv = document.createElement("div");
    errorDiv.className = "bot-msg";
    errorDiv.textContent = "Ups 😢 hubo un problema. Intenta de nuevo.";
    chatBody.appendChild(errorDiv);
  }

  enviando = false;
  chatInput.disabled = false;
  sendBtn.disabled = false;
  chatInput.focus();
  chatBody.scrollTop = chatBody.scrollHeight;
}
