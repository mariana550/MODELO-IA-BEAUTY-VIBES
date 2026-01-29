from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from groq import Groq
import os

load_dotenv()
app = Flask(
    __name__,
    template_folder="../templates",
    static_folder="../static"
)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# HOME
@app.route("/")
def index():
    return render_template("index.html")
# =========================
# CHATBOT CON IA (GROQ)
# =========================
@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").strip()
    
    if not user_message:
        return jsonify({"reply": "¿Puedes repetir tu mensaje? 💕"})

    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192", #es un modelo rapido y economico
            messages=[
                {
                "role": "system",
                "content": (
                "Eres BeautyBot 💄, asistente virtual de Beauty-Vibes Colombia. "
                "Habla en español colombiano, tono cálido y cercano. "
                "Responde en máximo 2 frases cortas. "
                "Usa emojis sutiles (💕✨💄). "
                "Si preguntan por precios, indica que están visibles en cada producto. "
                "Envíos a toda Colombia. "
                    )
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            temperature=0.7,
            max_tokens=120
        )

        reply = completion.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print("Error Groq:", e)
        return jsonify({
            "reply": "Ups 😥 tuve un problema. Intenta de nuevo más tarde."
        })
#EJECUCION
if __name__ == "__main__":
    app.run(debug=True)
