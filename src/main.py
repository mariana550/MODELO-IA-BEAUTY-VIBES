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
print("GROQ KEY:", os.getenv("GROQ_API_KEY"))

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
    user_message = request.json.get("message", "")

    if not user_message:
        return jsonify({"reply": "¿Puedes repetir tu mensaje? 💕"})

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Eres BeautyBot 💄, asistente virtual de Beauty-Vibes Colombia. "
                        "Responde en español colombiano, con tono amable y cercano. "
                        "Máximo 2 frases. Usa emojis sutiles 💕✨. "
                        "Si preguntan por precios o productos respondes de forma adecuada. "
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
        if not completion.choices:
            return jsonify({"reply": "Hola 💕 ¿En qué puedo ayudarte hoy?"})

        reply = completion.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print(" ERROR GROQ:", e)
        return jsonify({
            "reply": "Ups 😥 tuve un problema técnico. Intenta de nuevo en un momento."
        })
#EJECUCION
if __name__ == "__main__":
    app.run(debug=True)
