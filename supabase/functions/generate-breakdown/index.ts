const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const prompt = `You are an expert coach who breaks down ambitious goals into tiny, specific, motivating daily tasks.

Rules:
- Each task takes 15–30 minutes.
- Each task is concrete and actionable (start with a verb).
- Tasks build progressively: foundations → practice → refinement → reflection.
- Keep titles short (max ~80 chars). No numbering, no "Day X" prefix.
- Tailor every task to the user's specific goal and context.

Goal: ${title}
${description ? `Why it matters: ${description}\n` : ""}Duration: ${days} days

Generate exactly ${days} daily tasks, one per day.
Respond with ONLY a valid JSON object in this exact format, no markdown, no explanation:
{"tasks":[{"day":1,"title":"task title here"},{"day":2,"title":"task title here"}]}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("Gemini API error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let tasks: { day: number; title: string }[] = [];
    try {
      const parsed = JSON.parse(cleaned);
      tasks = parsed.tasks ?? [];
    } catch {
      console.error("Failed to parse Gemini response:", rawText);
      throw new Error("AI returned invalid response format");
    }

    // Normalize: ensure exactly `days` tasks, sequential days, non-empty titles
    tasks = tasks
      .filter((t) => t && typeof t.title === "string" && t.title.trim())
      .slice(0, days)
      .map((t, i) => ({ day: i + 1, title: t.title.trim() }));

    // Pad if model returned fewer tasks than requested
    if (tasks.length < days) {
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
