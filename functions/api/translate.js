// Cloudflare Pages Function: POST /api/translate
// Translates an Armenian (hy) source string into the requested target
// languages using Google Gemini. Reuses the same GEMINI_API_KEY / GEMINI_MODEL
// environment variables as the main server, so no extra secrets are needed.
//
// Request body:  { "text": "...", "targets": ["en", "ru"], "context": "optional hint" }
// Response body: { "translations": { "en": "...", "ru": "..." } }

const SUPPORTED = { en: "English", ru: "Russian", hy: "Armenian" };
const DEFAULT_TARGETS = ["en", "ru"];
const MAX_INPUT = 4000;

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function cleanText(value) {
  return String(value == null ? "" : value).replace(/\s+/g, " ").trim().slice(0, MAX_INPUT);
}

function buildPrompt(text, targets) {
  const targetList = targets.map((code) => `${code} (${SUPPORTED[code]})`).join(", ");
  return [
    "You are a professional translator for SmartTech LLC, an engineering and security systems company.",
    "Translate the following Armenian source text into these languages: " + targetList + ".",
    "Rules:",
    "- Keep the meaning, tone and professional style.",
    '- Never translate the brand name "Smart Tech" / "SmartTech".',
    "- Keep technical terms (CCTV, BMS, IP, NVR, Wi-Fi, KNX, etc.) as-is.",
    "- Do not add explanations or notes.",
    '- Return ONLY a strict JSON object whose keys are the language codes (' + targets.join(", ") + ") and values are the translated strings.",
    "",
    "Armenian source text:",
    text
  ].join("\n");
}

function extractJson(rawText) {
  if (!rawText) return null;
  // Strip ```json fences if present, then grab the first {...} block.
  const withoutFences = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(withoutFences.slice(start, end + 1));
  } catch (error) {
    return null;
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const apiKey = env.GEMINI_API_KEY || env.GOOGLE_GEMINI_API_KEY || env.GOOGLE_API_KEY;
  if (!apiKey) {
    return json({ error: "Translation is not configured. Add GEMINI_API_KEY in Cloudflare Pages settings." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const text = cleanText(body && body.text);
  if (!text) {
    return json({ error: "Field 'text' is required." }, 400);
  }

  let targets = Array.isArray(body && body.targets) ? body.targets : DEFAULT_TARGETS;
  targets = targets.filter((code) => SUPPORTED[code] && code !== "hy");
  if (!targets.length) targets = DEFAULT_TARGETS;

  const model = env.GEMINI_MODEL || env.GOOGLE_GEMINI_MODEL || "gemini-2.5-flash";
  const endpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    encodeURIComponent(model) +
    ":generateContent?key=" +
    encodeURIComponent(apiKey);

  const payload = {
    contents: [{ role: "user", parts: [{ text: buildPrompt(text, targets) }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1200,
      responseMimeType: "application/json"
    }
  };

  let geminiResponse;
  try {
    geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    return json({ error: "Could not reach the translation service." }, 502);
  }

  if (!geminiResponse.ok) {
    const status = geminiResponse.status === 429 ? 429 : 502;
    return json({ error: "Translation service error (" + geminiResponse.status + ")." }, status);
  }

  let data;
  try {
    data = await geminiResponse.json();
  } catch (error) {
    return json({ error: "Invalid response from translation service." }, 502);
  }

  const rawText =
    data &&
    data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts &&
    data.candidates[0].content.parts[0] &&
    data.candidates[0].content.parts[0].text;

  const parsed = extractJson(rawText);
  if (!parsed) {
    return json({ error: "Could not parse translations." }, 502);
  }

  const translations = {};
  targets.forEach((code) => {
    if (parsed[code]) translations[code] = String(parsed[code]).trim();
  });

  if (!Object.keys(translations).length) {
    return json({ error: "No translations were produced." }, 502);
  }

  return json({ translations });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type"
    }
  });
}
