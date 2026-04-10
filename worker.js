export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST requests are allowed." }),
        { status: 405, headers: corsHeaders },
      );
    }

    const apiKey = env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY secret." }),
        { status: 500, headers: corsHeaders },
      );
    }

    const userInput = await request.json().catch(() => null);

    if (!userInput || !Array.isArray(userInput.messages)) {
      return new Response(
        JSON.stringify({
          error: "Request body must include a messages array.",
        }),
        { status: 400, headers: corsHeaders },
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: userInput.model || "gpt-4o",
        messages: userInput.messages,
        max_completion_tokens: 300,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data?.error?.message || "OpenAI request failed.",
        }),
        { status: response.status, headers: corsHeaders },
      );
    }

    return new Response(JSON.stringify(data), { headers: corsHeaders });
  },
};
