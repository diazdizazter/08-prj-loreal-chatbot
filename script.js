const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");

const CLOUDFLARE_WORKER_URL =
  "https://08-prj-loreal-chatbot.edwin-kelsi54.workers.dev/";

const messages = [
  {
    role: "system",
    content:
      "You are a helpful L'Oreal beauty assistant. Answer questions about L'Oreal products, routines, makeup, skincare, haircare, and fragrance. If a question is unrelated, politely refuse and guide the user back to beauty topics.",
  },
];

function addMessage(text, role) {
  const messageEl = document.createElement("p");
  messageEl.className = `msg ${role}`;
  messageEl.textContent = text;
  chatWindow.appendChild(messageEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addTypingIndicator() {
  const typingEl = document.createElement("p");
  typingEl.id = "typingIndicator";
  typingEl.className = "msg ai";
  typingEl.textContent = "Assistant is thinking...";
  chatWindow.appendChild(typingEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTypingIndicator() {
  const typingEl = document.getElementById("typingIndicator");
  if (typingEl) {
    typingEl.remove();
  }
}

addMessage("Hi! I can help with L'Oreal products and beauty routines.", "ai");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();
  if (!question) return;

  addMessage(question, "user");
  userInput.value = "";

  messages.push({ role: "user", content: question });

  sendBtn.disabled = true;
  addTypingIndicator();

  try {
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Request failed.");
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    removeTypingIndicator();
    addMessage(aiReply, "ai");

    messages.push({ role: "assistant", content: aiReply });
  } catch (error) {
    removeTypingIndicator();
    addMessage(
      "Sorry, I could not reach the chatbot service. Please check your Worker URL and try again.",
      "ai",
    );
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
});
