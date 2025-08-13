import { useCallback, useState, type ComponentType } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
} from "reactflow";
import { UserButton } from "@civic/auth/react";
import "reactflow/dist/style.css";

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY as string | undefined;
const ELEVEN_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;
const ELEVEN_VOICE_ID = (import.meta.env.VITE_ELEVENLABS_VOICE_ID as string | undefined) ?? "21m00Tcm4TlvDq8ikWAM"; // Adam as sensible default

function UploadImageNode() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg shadow text-white w-64">
      <div className="font-semibold">Upload Image</div>
      <div className="text-xs text-zinc-400 mb-2">Drop or select an image to start</div>
      <input type="file" accept="image/*" onChange={onFile} className="block w-full text-xs text-zinc-300" />
      {loading && (
        <div className="mt-2 text-xs text-yellow-400 animate-pulse">Loading preview...</div>
      )}
      {preview && (
        <div className="mt-3">
          <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-md border border-zinc-700" />
        </div>
      )}
    </div>
  );
}

async function mistralHookIdeas(goal: string): Promise<string[]> {
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

function HookNode() {
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
    <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg shadow text-white w-72">
      <div className="font-semibold mb-2">Generate Hook</div>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Your goal..."
        className="w-full text-sm bg-zinc-800 border border-zinc-700 rounded px-2 py-1 mb-2 outline-none"
      />
      <button
        onClick={onGenerate}
        disabled={loading}
        className="text-xs px-2 py-1 rounded bg-yellow-400 text-black disabled:opacity-60"
      >
        {loading ? "Generating..." : "Get Hook Ideas"}
      </button>
      {loading && (
        <div className="mt-2 text-xs text-yellow-400 animate-pulse">Generating hook ideas...</div>
      )}
      {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
      <ul className="mt-2 space-y-1 list-disc pl-4 text-xs text-zinc-300">
        {ideas.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}

async function elevenLabsTTS(text: string): Promise<string> {
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

function VoiceOverNode() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onTTS = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await elevenLabsTTS(text || "This is a sample voice over generated by nemo3.");
      setAudioUrl(url);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg shadow text-white w-72">
      <div className="font-semibold mb-2">Generate Voice Over</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Text to speak..."
        className="w-full h-20 text-sm bg-zinc-800 border border-zinc-700 rounded px-2 py-1 mb-2 outline-none resize-none"
      />
      <button
        onClick={onTTS}
        disabled={loading}
        className="text-xs px-2 py-1 rounded bg-yellow-400 text-black disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Voice"}
      </button>
      {loading && (
        <div className="mt-2 text-xs text-yellow-400 animate-pulse">Generating audio...</div>
      )}
      {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
      {audioUrl && (
        <audio src={audioUrl} controls className="mt-2 w-full" />
      )}
    </div>
  );
}

const nodeTypes = {
  uploadImage: UploadImageNode,
  generateHook: HookNode,
  voiceOver: VoiceOverNode,
} satisfies Record<string, ComponentType<any>>;

// Initial nodes/edges
const initialNodes: Node[] = [
  { id: "1", position: { x: 0, y: 0 }, data: {}, type: "voiceOver" },
  { id: "2", position: { x: 260, y: 120 }, data: {}, type: "generateHook" },
  { id: "3", position: { x: 520, y: 0 }, data: {}, type: "uploadImage" },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

export default function Dashboard() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div className="relative h-[calc(100vh-64px)] w-full bg-zinc-950">
      {/* Civic user button overlay */}
      <div className="absolute top-3 right-3 z-10">
        <UserButton className="bg-zinc-900 text-white border border-zinc-800" />
      </div>

      {/* React Flow fills the dashboard */}
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap className="!bg-zinc-900" nodeColor={() => "#facc15"} />
          <Controls />
          <Background gap={16} color="#44403c" />
        </ReactFlow>
      </div>
    </div>
  );
}
