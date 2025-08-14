/* AI utilities: Mistral hooks, ElevenLabs TTS, YouTube transcript */
export type TranscriptItem = { text: string; duration?: number; offset?: number };
export const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY as string | undefined;
export const ELEVEN_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;
export const ELEVEN_VOICE_ID = (import.meta.env.VITE_ELEVENLABS_VOICE_ID as string | undefined) ?? "21m00Tcm4TlvDq8ikWAM";

export async function mistralHookIdeas(goal: string): Promise<string[]> {
  if (!MISTRAL_API_KEY) throw new Error("Missing VITE_MISTRAL_API_KEY");
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: "You generate short, catchy TikTok/UGC hook lines." },
        { role: "user", content: `Give me 5 distinct short hook ideas for this goal: ${goal}. Return as numbered list.` },
      ],
      temperature: 0.8,
    }),
  });
  if (!res.ok) throw new Error(`Mistral error ${res.status}`);
  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content ?? "";
  return text
    .split(/\n+/)
    .map((l: string) => l.replace(/^\d+\.|^-\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function fetchYouTubeTranscript(videoUrl: string): Promise<string> {
  if (!videoUrl) throw new Error("Please provide a YouTube video URL");
  const res = await fetch(`/api/transcript?url=${encodeURIComponent(videoUrl)}`);
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `Transcript error ${res.status}`);
  }
  const data = (await res.json()) as { text?: string };
  const text = (data.text || "").trim();
  if (!text) throw new Error("No transcript found for this video");
  return text;
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function elevenLabsTTS(text: string): Promise<string> {
  if (!ELEVEN_API_KEY) throw new Error("Missing VITE_ELEVENLABS_API_KEY");
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
      "xi-api-key": ELEVEN_API_KEY,
    },
    body: JSON.stringify({ text, model_id: "eleven_monolingual_v1", voice_settings: { stability: 0.4, similarity_boost: 0.7 } }),
  });
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}`);
  const buf = await res.arrayBuffer();
  const blob = new Blob([buf], { type: "audio/mpeg" });
  return URL.createObjectURL(blob);
}
