/* AI utilities: Mistral hooks and ElevenLabs TTS */
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
