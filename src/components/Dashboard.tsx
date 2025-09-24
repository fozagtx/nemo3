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
import { Mic, Settings, Sparkles } from "lucide-react";
import { ScriptInputNode } from "./nodes/ScriptInputNode";
import { AudioOutputNode } from "./nodes/AudioOutputNode";

type WorkflowTab = "voiceover" | "ideation" | "script";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "scriptInput",
    position: { x: 100, y: 200 },
    data: { onTranscribe: () => {} },
  },
  {
    id: "2",
    type: "audioOutput",
    position: { x: 600, y: 100 },
    data: {
      audioUrl: null,
      scriptText: "",
      isGenerating: false,
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
];

const nodeTypes = {
  scriptInput: ScriptInputNode,
  audioOutput: AudioOutputNode,
};

function VoiceOverWorkflow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

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
  const [activeTab, setActiveTab] = useState<WorkflowTab>("voiceover");

  const tabs = [
    {
      id: "voiceover" as const,
      label: "Voice-Over Generator",
      icon: Mic,
      description: "Convert scripts to AI voice-overs",
    },
    {
      id: "ideation" as const,
      label: "Content Ideas",
      icon: Sparkles,
      description: "Coming soon",
    },
    {
      id: "script" as const,
      label: "Script Writer",
      icon: Settings,
      description: "Coming soon",
    },
  ];

  return (
    <div className="h-screen w-full bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Nemo3</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Workflows
            </h2>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-gray-900 bg-gray-100 border border-gray-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-500">
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <UserMenu />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {tabs.find((tab) => tab.id === activeTab)?.description}
              </p>
            </div>
            {activeTab === "voiceover" && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">
                  Ready
                </span>
              </div>
            )}
          </div>
        </div>
        {activeTab === "voiceover" && <VoiceOverWorkflow />}
      </div>
    </div>
  );
}
