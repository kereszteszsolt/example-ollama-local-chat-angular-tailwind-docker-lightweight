# example-ollama-local-chat-angular-tailwind-docker-lightweight

A lightweight **Ollama local chat application**, built with **Angular**, **Angular Material**, **Tailwind**, and **Docker**.  
It allows you to chat with locally installed Ollama models, keeping context during the conversation but without permanently storing messages.  

---

## ✨ Features

- Local chat with Ollama-installed models  
- Context is preserved during the conversation  
- System commands can be saved in the browser’s local storage and deleted anytime  
- Basic chat features:
  - Start a new chat  
  - Regenerate responses  
  - Copy answers or code snippets  
  - Stop response generation  
- Supports:
  - **Markdown** (bold, italics, headings, lists, tables, etc.)  
  - **Mermaid diagrams**  
  - **Mathematical formulas** (KaTeX syntax)  
  - **Formatted code blocks** with syntax highlighting and copy support  
- Detects installed Ollama models and lets you switch between them  

---

## ⚙️ How context works

The Ollama API supports two main modes:

1. **Chat mode** – sends all previous messages with every request in JSON format, keeping track of user, model, and system messages.  
2. **Generate mode** – only sends the current prompt, with context handled as a token list.  

👉 This app uses **chat mode** for better contextual tracking.  

---

## 🚀 Run locally

```bash
npm install
npm start
```

Then open in your browser:  
👉 [http://localhost:4200](http://localhost:4200)

---

## 🐳 Run with Docker

```bash
docker-compose up --build
```

Then open in your browser:  
👉 [http://localhost:4201](http://localhost:4201)

---

## ⚠️ Important

Make sure you have the **Ollama server** running locally at:  
👉 [http://localhost:11434](http://localhost:11434) (default port)

---

## 📸 Screenshots

<img src="readme-assets/Capture1.png" alt="Screenshot 1" width="800"/>  

---

## 🔗 Linktree

👉 [https://linktr.ee/kereszteszsolt](https://linktr.ee/kereszteszsolt)

---

## ☕ Support

Found this helpful? You can support me on **BuyMeACoffee**.  
Contributions are optional and simply a way to show appreciation for this work, not a payment for services.

<a href="https://www.buymeacoffee.com/kereszteszsolt" target="_blank">
  <img src="readme-assets/orange-button.png" alt="Buy Me A Coffee" width="180"/>
</a>
