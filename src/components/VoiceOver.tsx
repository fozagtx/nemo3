import React, { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { ScriptInputNode } from "./nodes/ScriptInputNode";
import { AudioOutputNode } from "./nodes/AudioOutputNode";
import { elevenLabsTTS } from "../utils/ai";
import { toast } from "sonner";

interface ScriptNodeData {
  onTranscribe: (text: string) => void;
}

interface AudioNodeData {
  audioUrl: string | null;
  audioBlob: Blob | null;
  scriptText: string;
  isGenerating: boolean;
  onRegenerate?: () => void;
  onClear?: () => void;
}

const nodeTypes = {
  scriptInput: (props: NodeProps<ScriptNodeData>) => (
    <ScriptInputNode {...props} />
  ),
  audioOutput: (props: NodeProps<AudioNodeData>) => (
    <AudioOutputNode {...props} />
  ),
};

export function VoiceOver() {
  const [currentScript, setCurrentScript] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTranscribe = useCallback(async (text: string) => {
    setCurrentScript(text);
    setIsGenerating(true);
    setAudioUrl(null);
    setAudioBlob(null);

    try {
      const url = await elevenLabsTTS(text);
      const response = await fetch(url);
      const blob = await response.blob();

      setAudioUrl(url);
      setAudioBlob(blob);

      toast.success("Voice-over generated successfully!");
    } catch (error) {
      console.error("Voice-over generation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to generate voice-over: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleRegenerate = useCallback(() => {
    if (currentScript) {
      handleTranscribe(currentScript);
    }
  }, [currentScript, handleTranscribe]);

  const handleClear = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setCurrentScript("");
    toast.info("Audio cleared");
  }, [audioUrl]);

  // Initial nodes with data
  const initialNodes: Node[] = [
    {
      id: "script-input",
      type: "scriptInput",
      position: { x: 100, y: 200 },
      data: {
        onTranscribe: handleTranscribe,
      },
    },
    {
      id: "audio-output",
      type: "audioOutput",
      position: { x: 600, y: 200 },
      data: {
        audioUrl,
        audioBlob,
        scriptText: currentScript,
        isGenerating,
        onRegenerate: handleRegenerate,
        onClear: handleClear,
      },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: "script-to-audio",
      source: "script-input",
      target: "audio-output",
      type: "smoothstep",
      style: { stroke: "#10b981", strokeWidth: 3 },
      animated: isGenerating,
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "audio-output") {
          return {
            ...node,
            data: {
              audioUrl,
              audioBlob,
              scriptText: currentScript,
              isGenerating,
              onRegenerate: handleRegenerate,
              onClear: handleClear,
            },
          };
        }
        return node;
      }),
    );
  }, [
    audioUrl,
    audioBlob,
    currentScript,
    isGenerating,
    handleRegenerate,
    handleClear,
    setNodes,
  ]);

  // Update edge animation based on generating state
  React.useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: isGenerating,
        style: {
          stroke: isGenerating ? "#3b82f6" : "#10b981",
          strokeWidth: 3,
        },
      })),
    );
  }, [isGenerating, setEdges]);

  return (
    <div className="w-full h-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.3}
        maxZoom={1.5}
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Background gap={20} size={1} color="#e5e7eb" />
        <Controls
          className="!bg-white !border !border-gray-200 !rounded-lg !shadow-lg"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
