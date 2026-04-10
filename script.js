const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");

const CLOUDFLARE_WORKER_URL =
  "https://08-prj-loreal-chatbot.edwin-kelsi54.workers.dev/";
const MIN_REQUEST_GAP_MS = 1500;

let isRequestInFlight = false;
let lastRequestAt = 0;

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

  if (isRequestInFlight) {
    return;
  }

  const now = Date.now();
  if (now - lastRequestAt < MIN_REQUEST_GAP_MS) {
    addMessage("Please wait a moment before sending another message.", "ai");
    return;
  }

  const question = userInput.value.trim();
  if (!question) return;

  addMessage(question, "user");
  userInput.value = "";

  messages.push({ role: "user", content: question });

  isRequestInFlight = true;
  lastRequestAt = now;
  sendBtn.disabled = true;
  userInput.disabled = true;
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
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || "Request failed.";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    removeTypingIndicator();
    addMessage(aiReply, "ai");

    messages.push({ role: "assistant", content: aiReply });
  } catch (error) {
    removeTypingIndicator();
    addMessage(
      `Sorry, I could not complete the request: ${error.message}`,
      "ai",
    );
  } finally {
    isRequestInFlight = false;
    sendBtn.disabled = false;
    userInput.disabled = false;
    userInput.focus();
  }
});
