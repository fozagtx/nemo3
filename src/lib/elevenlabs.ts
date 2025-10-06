// ElevenLabs API utility functions
export interface ElevenLabsConfig {
  apiKey: string;
  voiceId?: string;
  modelId?: string;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export interface TextToSpeechOptions {
  text: string;
  voiceSettings?: Partial<VoiceSettings>;
  modelId?: string;
}

export interface ElevenLabsError {
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}

// Default voice settings
const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.6,
  similarity_boost: 0.9,
  style: 0.0,
  use_speaker_boost: true,
};

// Default configuration
const DEFAULT_CONFIG: ElevenLabsConfig = {
  apiKey: "",
  voiceId: "XrExE9yKIg1WjnnlVkGX", // Default voice ID
  modelId: "eleven_turbo_v2_5",
};

/**
 * Validates ElevenLabs API key format
 */
export function validateApiKey(apiKey: string): boolean {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  if (!apiKey.startsWith("sk_")) {
    throw new Error('Invalid API key format. Key should start with "sk_"');
  }

  return true;
}

/**
 * Validates text content for TTS conversion
 */
export function validateTextContent(text: string): boolean {
  const trimmedText = text.trim();

  if (!trimmedText) {
    throw new Error("Text content is required");
  }

  const wordCount = trimmedText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  if (wordCount > 3000) {
    throw new Error("Content must not exceed 3000 words");
  }

  return true;
}

/**
 * Converts text to speech using ElevenLabs API
 */
export async function textToSpeech(
  text: string,
  config: Partial<ElevenLabsConfig> = {},
): Promise<Blob> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Validate API key
  validateApiKey(finalConfig.apiKey);

  // Validate text content
  validateTextContent(text);

  // Prepare request body
  const requestBody = {
    text: text,
    model_id: finalConfig.modelId,
    voice_settings: DEFAULT_VOICE_SETTINGS,
  };

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${finalConfig.voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": finalConfig.apiKey,
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage =
          errorData.detail?.message || errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse the error response, use the status
      }

      const error: ElevenLabsError = {
        message: errorMessage,
        status: response.status,
        details: {
          statusText: response.statusText,
          url: response.url,
        },
      };

      throw error;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const errorData = await response.json();
      const errorMessage =
        errorData.detail?.message ||
        "API returned an unexpected JSON response instead of audio.";
      throw {
        message: errorMessage,
        status: response.status,
        details: errorData.detail,
      };
    }

    return await response.blob();
  } catch (error: unknown) {
    const errorObj = error as ElevenLabsError;

    if (errorObj.status === 401) {
      throw new Error("Invalid API key. Please check your ElevenLabs API key.");
    }
    if (errorObj.status === 429) {
      throw new Error(
        "API quota exceeded. Please check your ElevenLabs account limits.",
      );
    }
    if (
      error instanceof Error &&
      (error.message.includes("network") || error.message.includes("fetch"))
    ) {
      throw new Error("Network error. Please check your internet connection.");
    }

    // Re-throw the original error to preserve its properties for upstream handlers
    throw error;
  }
}

/**
 * Creates an audio URL from a blob
 */
export function createAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Downloads audio file
 */
export function downloadAudio(
  audioUrl: string,
  filename: string = "podcast-episode.mp3",
): void {
  const link = document.createElement("a");
  link.href = audioUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Cleanup audio URL to prevent memory leaks
 */
export function revokeAudioUrl(audioUrl: string): void {
  URL.revokeObjectURL(audioUrl);
}
