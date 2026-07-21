# 🐉 Data Engineer Grammar & Communication Game

Welcome to the **Data Engineer Grammar & Communication Game**! This is a specialized, interactive web application designed specifically for Data Engineers, Data Architects, and Engineering Managers who want to improve their professional English communication skills.

## 🎯 Purpose of the Project
In the modern tech industry, technical skills are only half the battle. Explaining complex data pipelines, negotiating with stakeholders, giving standup updates, and writing documentation all require sharp, confident English communication. 

This project was built to provide a **gamified, immersive training environment** for data professionals to practice real-world communication scenarios rather than generic vocabulary. 

## 🚀 Key Features & Uses

### 1. 🎙️ AI Manager 1-on-1 (Voice Practice)
- **What it is:** A live, spoken conversation module powered by AI.
- **Use Case:** Practice your spoken English in a realistic 1-on-1 meeting setting. Connect a free API key (from Google Gemini or Groq/Llama), speak into your microphone, and the AI Manager will listen and respond aloud. Perfect for interview prep or practicing conversational flow.

### 2. ⏱️ Standup Rush
- **What it is:** A timed speaking drill.
- **Use Case:** You are given 30 seconds and bullet points (e.g., what you did yesterday, what you are doing today, blockers). You must speak your daily standup update out loud before the timer runs out. Builds confidence and eliminates rambling during agile ceremonies.

### 3. 🤝 Client Reaction (RPG)
- **What it is:** A roleplaying text game.
- **Use Case:** You are presented with difficult scenarios (e.g., a data pipeline failed, a stakeholder is angry about missing data). You must choose the most professional, empathetic, and clear English response to defuse the situation. 

### 4. 📖 Pipeline Storyteller
- **What it is:** A logical sequencing exercise.
- **Use Case:** Learn how to explain a complex technical process step-by-step using proper transition words (First, Next, Consequently, Ultimately).

### 5. 🏗️ Sentence Builder & Grammar Foundation
- **What it is:** Jumbled sentences and fill-in-the-blank drills.
- **Use Case:** Focuses entirely on vocabulary used by Data Engineers (e.g., "orchestration," "idempotent," "latency," "ETL"). Fix your tenses, verbs, and adjectives so your technical documentation is flawless.

## 🛠️ Built With
- **Frontend:** React + Vite
- **Styling:** Custom Glassmorphic CSS Engine
- **Voice Technology:** Web Speech API (Speech-to-Text & Text-to-Speech)
- **AI Integrations:** Unified AI provider system supporting Google Gemini, Meta Llama (via Groq), and OpenAI ChatGPT.

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kumar2928p/de-grammar-game.git
   ```
2. **Navigate into the folder:**
   ```bash
   cd de-grammar-game
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`.

## 🔑 How to use the AI Voice Manager
Because this app runs entirely locally and respects your privacy, **it does not come with a built-in API key**. 

To use the live AI Manager voice feature, you must provide your own free API key:
1. Go to [Google AI Studio](https://aistudio.google.com/) (for Gemini) or [Groq Console](https://console.groq.com/) (for Llama 3).
2. Generate a free API key.
3. Open the app, scroll down to the **⚙️ AI Model Settings**, and paste your key.
4. Click the "AI MANAGER 1-on-1" button to start talking!

---
*Built with ❤️ for the global Data Engineering community.*
