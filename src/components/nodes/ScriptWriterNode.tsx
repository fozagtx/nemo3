import { useState } from "react";
import { Handle, Position } from "reactflow";
import { mistralScriptFromHook } from "../../utils/ai";

export function ScriptWriterNode() {
  const [hook, setHook] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const s = await mistralScriptFromHook(
        hook || "Stop scrolling. This one change 10x your results.",
      );
      setScript(s);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative px-3 py-2 bg-zinc-900/95 border border-zinc-800 rounded-lg shadow text-white w-64 select-none">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-yellow-400"
      />
      <div className="text-sm font-semibold leading-none mb-1">
        15s Script Writer
      </div>
      <div className="text-[11px] text-zinc-400 mb-2">
        Paste a hook, get a concise UGC script.
      </div>
      <textarea
        value={hook}
        onChange={(e) => setHook(e.target.value)}
        placeholder="Paste hook here..."
        className="w-full h-14 text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1 mb-2 outline-none resize-none"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={onGenerate}
          disabled={loading || !hook.trim()}
          className="text-[11px] px-2 py-1 rounded bg-yellow-400 text-black disabled:opacity-60"
        >
          {loading ? "Generating..." : "Write Script"}
        </button>
        <button
          onClick={onCopy}
          disabled={!script}
          className="text-[11px] px-2 py-1 rounded border border-zinc-700 text-zinc-200 disabled:opacity-60"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {error && <div className="text-[11px] text-red-400 mt-2">{error}</div>}
      {script && (
        <textarea
          readOnly
          value={script}
          className="w-full h-28 text-[11px] bg-zinc-800 border border-zinc-700 rounded px-2 py-1 mt-2 outline-none resize-none"
        />
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-yellow-400"
      />
    </div>
  );
}
