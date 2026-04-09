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

    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const userInput = await request.json().catch(() => null);

    if (!userInput || !Array.isArray(userInput.messages)) {
      return new Response(
        JSON.stringify({
          error: "Request body must include a messages array.",
        }),
        { status: 400, headers: corsHeaders },
      );
    }

    const requestBody = {
      model: userInput.model || "gpt-4o",
      messages: userInput.messages,
      max_completion_tokens: 300,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error?.message || "OpenAI request failed.";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(data), { headers: corsHeaders });
  },
};
