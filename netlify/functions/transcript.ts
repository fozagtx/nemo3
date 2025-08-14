import { YoutubeTranscript } from "youtube-transcript";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  const url = event.queryStringParameters?.url as string | undefined;
  if (!url) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing 'url' query param" }),
    };
  }

  try {
    const items = await YoutubeTranscript.fetchTranscript(url);
    const text = items.map((i) => i.text).join(" ");
    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ text, items }),
    };
  } catch (e: any) {
    const message = e?.message || "Failed to fetch transcript";
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: message }),
    };
  }
};
