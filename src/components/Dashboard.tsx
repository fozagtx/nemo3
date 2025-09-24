import { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

import { UserMenu } from "./UserMenu";
import { ScriptInputNode } from "./nodes/ScriptInputNode";
import { AudioOutputNode } from "./nodes/AudioOutputNode";
import { textToSpeech, createAudioUrl } from "../lib/elevenlabs";
import { toast } from "sonner";

const nodeTypes = {
  scriptInput: ScriptInputNode,
  audioOutput: AudioOutputNode,
};

function VoiceOverWorkflow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleTranscribe = useCallback(async (scriptText: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "2") {
          return {
            ...node,
            data: {
              ...node.data,
              isGenerating: true,
              scriptText: scriptText,
            },
          };
        }
        return node;
      }),
    );

    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error("ElevenLabs API key not found");
      }

      const audioBlob = await textToSpeech(scriptText, { apiKey });
      const audioUrl = createAudioUrl(audioBlob);

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === "2") {
            return {
              ...node,
              data: {
                ...node.data,
                audioUrl: audioUrl,
                audioBlob: audioBlob,
                isGenerating: false,
              },
            };
          }
          return node;
        }),
      );
    } catch (error) {
      console.error("Transcription failed:", error);
      toast.error("Failed to generate audio");
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === "2") {
            return {
              ...node,
              data: {
                ...node.data,
                isGenerating: false,
              },
            };
          }
          return node;
        }),
      );
    }
  }, []);

  const handleClearAudio = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "2") {
          return {
            ...node,
            data: {
              ...node.data,
              audioUrl: null,
              audioBlob: null,
              scriptText: "",
            },
          };
        }
        return node;
      }),
    );
    toast.info("Audio cleared");
  }, []);

  const handleRegenerate = useCallback(() => {
    const scriptNode = nodes.find((node) => node.type === "scriptInput");
    if (scriptNode && scriptNode.data.scriptText) {
      handleTranscribe(scriptNode.data.scriptText);
    }
  }, [nodes, handleTranscribe]);

  useState(() => {
    const initialNodes: Node[] = [
      {
        id: "1",
        type: "scriptInput",
        position: { x: 100, y: 200 },
        data: { onTranscribe: handleTranscribe },
      },
      {
        id: "2",
        type: "audioOutput",
        position: { x: 600, y: 100 },
        data: {
          audioUrl: null,
          scriptText: "",
          isGenerating: false,
          onClear: handleClearAudio,
          onRegenerate: handleRegenerate,
        },
      },
    ];
    const initialEdges: Edge[] = [
      { id: "e1-2", source: "1", target: "2", animated: true },
    ];
    setNodes(initialNodes);
    setEdges(initialEdges);
  });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Nemo3</h1>
            </div>
          </div>
          <UserMenu />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <VoiceOverWorkflow />
      </div>
    </div>
  );
}
