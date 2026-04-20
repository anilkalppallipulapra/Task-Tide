import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { title, description, durationDays } = await req.json();

    if (!title || typeof title !== "string" || !durationDays || typeof durationDays !== "number") {
      return new Response(JSON.stringify({ error: "title and durationDays are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const days = Math.min(Math.max(Math.floor(durationDays), 1), 90);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert coach who breaks down ambitious goals into tiny, specific, motivating daily tasks.
Rules:
- Each task takes 15–30 minutes.
- Each task is concrete and actionable (start with a verb).
- Tasks build progressively: foundations → practice → refinement → reflection.
- Keep titles short (max ~80 chars). No numbering, no "Day X" prefix.
- Tailor every task to the user's specific goal and context.`;

    const userPrompt = `Goal: ${title}
${description ? `Why it matters: ${description}\n` : ""}Duration: ${days} days

Generate exactly ${days} daily tasks, one per day.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_plan",
              description: "Return the daily task plan",
              parameters: {
                type: "object",
                properties: {
                  tasks: {
                    type: "array",
                    minItems: days,
                    maxItems: days,
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "number" },
                        title: { type: "string" },
                      },
                      required: ["day", "title"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["tasks"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_plan" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable Cloud settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const args = JSON.parse(toolCall.function.arguments);
    let tasks: { day: number; title: string }[] = args.tasks ?? [];

    // Normalize: ensure exactly `days` tasks, sequential days, non-empty titles
    tasks = tasks
      .filter((t) => t && typeof t.title === "string" && t.title.trim())
      .slice(0, days)
      .map((t, i) => ({ day: i + 1, title: t.title.trim() }));

    if (tasks.length < days) {
      // Pad if model returned fewer
      for (let d = tasks.length + 1; d <= days; d++) {
        tasks.push({ day: d, title: `Continue working toward "${title}"` });
      }
    }

    return new Response(JSON.stringify({ tasks }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-breakdown error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
