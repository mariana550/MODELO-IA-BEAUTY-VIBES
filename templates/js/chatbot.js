// ELEMENTOS
const chatToggle = document.getElementById("chat-toggle");
const chatbot = document.getElementById("chatbot");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const chatInput = document.getElementById("chat-input");
const chatBody = document.getElementById("chat-body");

// ABRIR CHAT
chatToggle.addEventListener("click", () => {
  chatbot.style.display = "flex";
});

// CERRAR CHAT
closeChat.addEventListener("click", () => {
  chatbot.style.display = "none";
});

// ENVIAR MENSAJE
sendBtn.addEventListener("click", enviarMensaje);

// ENTER TAMBIÉN ENVÍA
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    enviarMensaje();
  }
});

function enviarMensaje() {
  const mensaje = chatInput.value.trim();
  if (mensaje === "") return;

  // MENSAJE USUARIO
  chatBody.innerHTML += `
    <div class="user-msg">${mensaje}</div>
  `;

  chatInput.value = "";

  // RESPUESTA BOT (simulada)
  setTimeout(() => {
    let respuesta = "Hola 💕 ¿En qué puedo ayudarte?";

    if (mensaje.toLowerCase().includes("precio")) {
      respuesta = "Todos nuestros precios están visibles en cada producto 💄";
    } 
    else if (mensaje.toLowerCase().includes("envío")) {
      respuesta = "Hacemos envíos a todo Colombia 🇨🇴";
    } 
    else if (mensaje.toLowerCase().includes("maquillaje")) {
      respuesta = "Tenemos maquillaje, cuidado capilar y más ✨";
    }

    chatBody.innerHTML += `
      <div class="bot-msg">${respuesta}</div>
    `;
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}

