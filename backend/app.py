from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)
CORS(app)

# Load model and tokenizer
model_name = "Qwen/Qwen2-1.5B"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name, 
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto"  
)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "").strip()
    if not user_message:
        return jsonify({"reply": "Please enter a message."})

    # Build prompt for a single-turn Q&A
    prompt = f"""
You are PlantBuddy, a friendly and knowledgeable plant assistant.
Answer the user's question clearly and concisely in a warm, approachable, and conversational style.

Question: {user_message}
Answer:"""

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=150,
        do_sample=True,
        temperature=0.7,
        top_p=0.9
    )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    # Extract only the model’s answer after "Answer:"
    reply = response.split("Answer:")[-1].strip()

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)