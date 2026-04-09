# Project 8: Build a L'Oreal Chatbot

In this project, you will build a branded chatbot for L'Oreal.

Your chatbot should:

- Answer questions about L'Oreal products (makeup, skincare, haircare, fragrance).
- Give helpful routine and product recommendations.
- Stay on topic and politely refuse unrelated questions.

## Project Goal

Practice the core skills from this unit:

- JavaScript DOM updates
- `fetch` with `async/await`
- OpenAI Chat Completions API
- Basic prompt design (system message)
- Secure API usage with a Cloudflare Worker

## Start in Codespaces

1. Open the repo on GitHub.
2. Click **Code**.
3. Choose **Open with Codespaces**.
4. Create a new codespace.
5. Open `index.html` in Live Preview.

## What You Need to Implement

1. Add L'Oreal branding

- Add the logo image.
- Update colors and styling to match the brand.

2. Build chatbot behavior in `script.js`

- Read user input.
- Send the input to your backend endpoint.
- Show the assistant reply in the chat UI.

3. Keep responses relevant

- Use a system message that keeps answers focused on L'Oreal and beauty topics.
- Politely refuse off-topic questions.

4. Secure your key with Cloudflare

- Do not call OpenAI directly from the browser with a secret key.
- Route requests through your Cloudflare Worker.

## API Format Reminder

Use a `messages` array (not `prompt`) in your request body.

Read the assistant response from:

`data.choices[0].message.content`

## Optional LevelUp Ideas

- Save conversation history for multi-turn context.
- Show the user's latest question above each response.
- Use separate message bubbles for user and assistant.

## Submission Checklist

- Chatbot works end to end.
- Branding is visible and consistent.
- Off-topic filtering is working.
- API key is protected through Cloudflare Worker.
- UI is readable on desktop and mobile.
