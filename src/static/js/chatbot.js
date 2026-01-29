// chatbot.js - VERSIÓN QUE SÍ FUNCIONA
const chatToggle = document.getElementById("chat-toggle");
const chatbot = document.getElementById("chatbot");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const chatInput = document.getElementById("chat-input");
const chatBody = document.getElementById("chat-body");

// Eventos básicos
chatToggle.addEventListener("click", () => chatbot.style.display = "flex");
closeChat.addEventListener("click", () => chatbot.style.display = "none");
sendBtn.addEventListener("click", enviarMensaje);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") enviarMensaje();
});

// ====== PARTE IMPORTANTE: API KEY DE GEMINI ======
// OBTÉN TU KEY GRATIS: https://makersuite.google.com/app/apikey
const GEMINI_KEY = "AIzaSyDA...tu_key_aqui"; // ¡REEMPLAZA ESTO!

// ====== FUNCIÓN QUE SÍ FUNCIONA ======
async function consultarGemini(mensaje) {
  // URL de proxy CORS gratuito + Gemini
  const proxyURL = "https://corsproxy.io/?";
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`;
  
  try {
    const respuesta = await fetch(proxyURL + encodeURIComponent(geminiURL), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'http://localhost' // Permite localhost
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Eres BeautyBot, asistente virtual de Beauty-Vibes Colombia, una tienda de maquillaje y cuidado personal.

INSTRUCCIONES:
1. Responde en ESPAÑOL COLOMBIANO
2. Sé amable y cálida 💕
3. Usa emojis relevantes 💄✨🇨🇴
4. Máximo 2 frases
5. Si preguntan por precios: di que están en cada producto
6. Si preguntan por envíos: a toda Colombia
7. Si preguntan por productos: tenemos maquillaje y cuidado capilar
8. Si no sabes: sugiere contactar en Instagram @beauty.vibes.co

PREGUNTA DEL CLIENTE: ${mensaje}

RESPUESTA DE BEAUTYBOT:`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7
        }
      })
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const data = await respuesta.json();
    
    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "¡Hola! 💕 ¿En qué puedo ayudarte hoy?";
    }
    
  } catch (error) {
    console.error("Error con Gemini:", error);
    return obtenerRespuestaLocal(mensaje);
  }
}

// ====== RESPUESTAS LOCALES DE RESPALDO ======
function obtenerRespuestaLocal(mensaje) {
  const texto = mensaje.toLowerCase();
  
  const respuestas = {
    "hola": "¡Hola! 💕 Soy BeautyBot de Beauty-Vibes. ¿En qué puedo ayudarte hoy?",
    "hi": "¡Hello! 💕 Welcome to Beauty-Vibes Colombia. How can I help you?",
    "buenas": "¡Buenas! ✨ ¿Buscas maquillaje o productos para el cabello?",
    "precio": "Los precios están visibles en cada producto 💄 ¡Tenemos excelentes precios!",
    "cuánto cuesta": "Cada producto muestra su precio. ¿Te interesa alguno en particular?",
    "envío": "¡Enviamos a TODA Colombia! 🇨🇴 Entre 2-5 días hábiles.",
    "envían": "Sí, hacemos envíos nacionales. ¿De qué ciudad eres?",
    "maquillaje": "Tenemos bases, labiales, rubores, sombras y más ✨",
    "labial": "¡Tenemos labiales mate, brillo y líquidos! ¿Qué color te gusta? 💄",
    "base": "Tenemos bases para todo tipo de piel. ¿Necesitas cobertura ligera o completa?",
    "cabello": "Shampoo, acondicionador, mascarillas, aceites 💆‍♀️",
    "shampoo": "Tenemos para cabello seco, graso, con frizz y coloreado.",
    "ofertas": "¡Síguenos en Instagram @beauty.vibes.co! Allí publicamos todas las promociones 💖",
    "descuento": "Tenemos descuentos por compras mayores a $100k y en fechas especiales 🎁",
    "contacto": "Escríbenos a: contacto@beauty-vibes.co o por nuestras redes sociales 📱",
    "instagram": "Síguenos en @beauty.vibes.co 💕 Subimos tips y promociones",
    "medellín": "¡Sí, enviamos a Medellín! 🇨🇴 2-3 días hábiles.",
    "bogotá": "¡A Bogotá llegamos en 1-2 días! 🇨🇴",
    "cali": "¡A Cali también enviamos! 🇨🇴 3-4 días hábiles.",
    "barranquilla": "¡Sí, a Barranquilla! 🇨🇴 4-5 días hábiles.",
    "gracias": "¡De nada! 😊 ¿Hay algo más en lo que pueda ayudarte?",
    "thanks": "You're welcome! 😊 Is there anything else I can help you with?",
    "adiós": "¡Hasta luego! 💖 Que tengas un lindo día.",
    "bye": "Goodbye! 💖 Have a beautiful day.",
    "horario": "Atendemos online 24/7 🕛 Tienda física: L-V 9am-7pm, S 10am-2pm",
    "pago": "Aceptamos tarjetas, Nequi, Daviplata y efectivo en puntos 💳",
    "devolución": "Aceptamos devoluciones en 15 días si el producto está sellado 🔄",
    "garantía": "Todos nuestros productos tienen garantía de originalidad y calidad ⭐"
  };

  // Buscar palabra clave
  for (const [palabra, respuesta] of Object.entries(respuestas)) {
    if (texto.includes(palabra)) {
      return respuesta;
    }
  }

  // Si no encuentra, respuesta genérica
  const genericas = [
    "Interesante pregunta 💭 Te recomiendo visitar nuestra página o escribirnos por Instagram para más detalles.",
    "Buena consulta ✨ Para darte la información más precisa, te sugiero contactarnos directamente.",
    "Vaya, no estoy 100% segura de eso 💻 ¿Te importa si te ayudo con información sobre productos, precios o envíos?"
  ];
  
  return genericas[Math.floor(Math.random() * genericas.length)];
}

// ====== FUNCIÓN PRINCIPAL ======
async function enviarMensaje() {
  const texto = chatInput.value.trim();
  if (!texto) return;

  // 1. Mostrar mensaje del usuario
  const userDiv = document.createElement("div");
  userDiv.className = "user-msg";
  userDiv.textContent = texto;
  chatBody.appendChild(userDiv);

  // 2. Limpiar input
  chatInput.value = "";
  chatInput.disabled = true;
  sendBtn.disabled = true;

  // 3. Mostrar "escribiendo..."
  const typingDiv = document.createElement("div");
  typingDiv.className = "bot-msg";
  typingDiv.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <em>BeautyBot está pensando...</em>
  `;
  chatBody.appendChild(typingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  // 4. Obtener respuesta (IA o local)
  let respuesta;
  
  // Decidir si usar IA o respuesta local
  const textoLower = texto.toLowerCase();
  const usarIA = textoLower.length > 20 || // Preguntas largas
                 !obtenerRespuestaLocal(texto).includes("Interesante"); // Si no hay respuesta local específica
  
  if (usarIA && GEMINI_KEY.startsWith("AIza")) {
    // Usar Gemini AI
    respuesta = await consultarGemini(texto);
  } else {
    // Usar respuesta local (instantánea)
    setTimeout(() => {
      respuesta = obtenerRespuestaLocal(texto);
    }, 600);
  }

  // 5. Esperar un poco y mostrar respuesta
    setTimeout(() => {
    // Remover indicador de "escribiendo"
    chatBody.removeChild(typingDiv);
    
    // Mostrar respuesta
    const botDiv = document.createElement("div");
    botDiv.className = "bot-msg";
    botDiv.textContent = respuesta || obtenerRespuestaLocal(texto);
    chatBody.appendChild(botDiv);
    
    // Habilitar input de nuevo
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.focus();
    
    // Scroll al final
    chatBody.scrollTop = chatBody.scrollHeight;
  }, usarIA ? 1500 : 800);
}