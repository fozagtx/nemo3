import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "./ui/button";

// Initial workflow nodes and edges
const initialNodes: Node[] = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Generate Voice Over" }, type: "default" },
  { id: "2", position: { x: 250, y: 100 }, data: { label: "Generate Hook" }, type: "default" },
  { id: "3", position: { x: 500, y: 0 }, data: { label: "Upload Image" }, type: "default" }
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" }
];

export default function Dashboard() {
  // React Flow state
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // UGC workflow states
  const [currentStep, setCurrentStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [hookIdeas, setHookIdeas] = useState<string[]>([]);
  const [selectedHook, setSelectedHook] = useState("");
  const [finalHook, setFinalHook] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);

  // Mock actions
  const generateHookIdeasFromGoal = () => setHookIdeas(["Hook 1", "Hook 2", "Hook 3"]);
  const proceedToVoiceover = () => setCurrentStep(4);
  const convertHookToVoiceover = () => {
    setIsConverting(true);
    setTimeout(() => {
      setAudioUrl("/mock-voice.mp3");
      setIsConverting(false);
      setCurrentStep(5);
    }, 1500);
  };
  const renderHookOnImage = () => setRenderedImageUrl("/mock-image.png");
  const downloadImage = () => console.log("Downloading image...");
  const downloadAudio = () => console.log("Downloading audio...");

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-zinc-950 flex flex-col items-center justify-start p-4 overflow-y-auto">
      {/* React Flow Canvas */}
      <div className="w-full max-w-4xl h-[400px] bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap className="!bg-zinc-800" nodeColor={() => "#facc15"} />
          <Controls />
          <Background gap={16} color="#44403c" />
        </ReactFlow>
      </div>
      <div className="mt-4 text-zinc-400 text-sm text-center">
        <span className="font-semibold text-yellow-400">nemo3</span> dashboard – Drag, zoom, and interact with your workflow!
      </div>

      {/* UGC Creation Steps */}
      <div className="w-full max-w-2xl mt-8 space-y-6">
        {currentStep === 1 && (
          <div className="text-white">Step 1: Upload your UGC image here.</div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <label className="block text-white mb-2">Your Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Get more followers, promote a product..."
              className="w-full bg-zinc-800 border-zinc-700 text-white px-3 py-2 rounded"
            />
            <Button onClick={generateHookIdeasFromGoal} className="bg-yellow-400 text-black hover:bg-yellow-500">
              Get Hook Ideas
            </Button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid gap-2">
              {hookIdeas.map((idea, idx) => (
                <label
                  key={idx}
                  className={`p-3 rounded border ${selectedHook === idea ? "border-yellow-400 bg-zinc-800" : "border-zinc-700 bg-zinc-900"}`}
                >
                  <input
                    type="radio"
                    name="hook"
                    className="mr-2"
                    checked={selectedHook === idea}
                    onChange={() => setSelectedHook(idea)}
                  />
                  <span className="text-white">{idea}</span>
                </label>
              ))}
            </div>
            <label className="block text-white mb-2">Refine or write your own</label>
            <input
              type="text"
              value={finalHook}
              onChange={(e) => setFinalHook(e.target.value)}
              placeholder={selectedHook || "Type your hook..."}
              className="w-full bg-zinc-800 border-zinc-700 text-white px-3 py-2 rounded"
            />
            <div className="flex gap-2">
              <Button onClick={() => setCurrentStep(2)} variant="outline" className="border-zinc-700 text-white">
                Back
              </Button>
              <Button onClick={proceedToVoiceover} className="bg-yellow-400 text-black hover:bg-yellow-500">
                Continue
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="text-white">Generate voiceover for:</div>
            <div className="p-3 rounded bg-zinc-900 text-white border border-zinc-700">
              {finalHook || selectedHook}
            </div>
            <Button onClick={convertHookToVoiceover} disabled={isConverting} className="bg-yellow-400 text-black hover:bg-yellow-500">
              {isConverting ? "Generating..." : "Generate Voiceover"}
            </Button>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="text-white">Voiceover ready.</div>
            {audioUrl && <audio src={audioUrl} controls className="w-full" />}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={renderHookOnImage} className="bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700">
                Render Hook on Image
              </Button>
              {renderedImageUrl && (
                <Button onClick={downloadImage} className="bg-green-600 text-white hover:bg-green-700">
                  Download Image
                </Button>
              )}
              {audioUrl && (
                <Button onClick={downloadAudio} className="bg-blue-600 text-white hover:bg-blue-700">
                  Download Audio
                </Button>
              )}
            </div>
            {renderedImageUrl && (
              <div className="mt-2 flex justify-center">
                <img src={renderedImageUrl} alt="Rendered" className="w-40 rounded" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
