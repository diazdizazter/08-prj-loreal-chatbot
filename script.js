/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");

// Replace this with your deployed Cloudflare Worker URL.
const CLOUDFLARE_WORKER_URL =
  "https://your-worker-name.your-subdomain.workers.dev";

// The system message keeps the chatbot focused on beauty and L'Oreal topics.
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
  typingEl.textContent = "Assistant is typing...";
  chatWindow.appendChild(typingEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTypingIndicator() {
  const typingEl = document.getElementById("typingIndicator");
  if (typingEl) {
    typingEl.remove();
  }
}

// Set initial message
addMessage("Hello! Ask me about L'Oreal products or beauty routines.", "ai");

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();
  if (!question) return;

  addMessage(`You: ${question}`, "user");
  userInput.value = "";

  // Add the latest user message to the conversation history.
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
    addMessage(`Assistant: ${aiReply}`, "ai");

    // Save the assistant response too, so future replies keep context.
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
