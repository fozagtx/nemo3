import { useState } from "react";
import { Handle, Position } from "reactflow";
import { fetchYouTubeTranscript } from "../../utils/ai";

export function TranscribeYouTubeNode() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onTranscribe = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const text = await fetchYouTubeTranscript(url);
      setTranscript(text);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("failed")
    }
  };

  return (
    <div className="relative px-3 py-2 bg-zinc-900/95 border border-zinc-800 rounded-lg shadow text-white w-64 select-none">
      <div className="text-sm font-semibold leading-none mb-1">YouTube Transcription</div>
      <div className="text-[11px] text-zinc-400 mb-2">Paste a YouTube video link to fetch transcript.</div>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1 mb-2 outline-none"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={onTranscribe}
          disabled={loading || !url}
          className="text-[11px] px-2 py-1 rounded bg-yellow-400 text-black disabled:opacity-60"
        >
          {loading ? "Transcribing..." : "Transcribe"}
        </button>
        <button
          onClick={onCopy}
          disabled={!transcript}
          className="text-[11px] px-2 py-1 rounded border border-zinc-700 text-zinc-200 disabled:opacity-60"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {error && <div className="text-[11px] text-red-400 mt-2">{error}</div>}
      {transcript && (
        <textarea
          readOnly
          value={transcript}
          className="w-full h-28 text-[11px] bg-zinc-800 border border-zinc-700 rounded px-2 py-1 mt-2 outline-none resize-none"
        />
      )}
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-yellow-400" />
    </div>
  );
}
