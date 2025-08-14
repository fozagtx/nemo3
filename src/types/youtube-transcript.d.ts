declare module "youtube-transcript" {
  export type TranscriptItem = {
    text: string;
    duration?: number;
    offset?: number;
  };

  export const YoutubeTranscript: {
    fetchTranscript: (
      videoIdOrUrl: string,
      options?: { lang?: string | string[] }
    ) => Promise<TranscriptItem[]>;
  };
}
