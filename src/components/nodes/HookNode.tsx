import { useState } from "react";
import { Handle, Position } from "reactflow";
import { mistralHookIdeas } from "../../utils/ai";

export function HookNode() {
  const [goal, setGoal] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const hooks = await mistralHookIdeas(goal || "Grow followers for fitness brand");
      setIdeas(hooks);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative px-3 py-2 bg-zinc-900/95 border border-zinc-800 rounded-lg shadow text-white w-64 select-none">
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-yellow-400" />
      <div className="text-sm font-semibold leading-none mb-1">Generate Hook</div>
      <div className="text-[11px] text-zinc-400 mb-2">Enter your goal, get short hook ideas.</div>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Your goal..."
        className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1 mb-2 outline-none"
      />
      <button
        onClick={onGenerate}
        disabled={loading}
        className="text-[11px] px-2 py-1 rounded bg-yellow-400 text-black disabled:opacity-60"
      >
        {loading ? "Generating..." : "Get Hook Ideas"}
      </button>
      {loading && (
        <div className="mt-2 text-[11px] text-yellow-400 animate-pulse">Generating hook ideas...</div>
      )}
      {error && <div className="text-[11px] text-red-400 mt-2">{error}</div>}
      <ul className="mt-2 space-y-1 list-disc pl-4 text-[11px] text-zinc-300">
        {ideas.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-yellow-400" />
    </div>
  );
}
