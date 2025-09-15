import { useCallback, type ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  Handle,
  Position,
} from "reactflow";
import { UserMenu } from "./UserMenu";
import "reactflow/dist/style.css";
import {
  Settings,
  Workflow,
  FolderOpen,
  Calendar,
  Save,
  Plus,
  Mic,
} from "lucide-react";
import { Button } from "./ui/button";

// Custom node component for the workflow steps
interface WorkflowNodeData {
  label: string;
  icon: LucideIcon;
  description?: string;
}

function WorkflowNode({ data }: { data: WorkflowNodeData }) {
  const IconComponent = data.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 min-w-[180px] p-4">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-orange-400 !border-2 !border-white"
      />
      <div className="flex flex-col items-center space-y-3">
        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-gray-600" />
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900 text-sm">{data.label}</div>
          {data.description && (
            <div className="text-xs text-gray-500 mt-1">{data.description}</div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-orange-400 !border-2 !border-white"
      />
    </div>
  );
}

const nodeTypes = {
  workflowStep: WorkflowNode,
} satisfies Record<string, ComponentType<{ data: WorkflowNodeData }>>;

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 100, y: 200 },
    data: {
      label: "Ideation",
      icon: Settings,
      description: "Generate creative hooks and ideas",
    },
    type: "workflowStep",
  },
  {
    id: "2",
    position: { x: 400, y: 200 },
    data: {
      label: "Script Writing",
      icon: Workflow,
      description: "Create engaging video scripts",
    },
    type: "workflowStep",
  },
  {
    id: "3",
    position: { x: 700, y: 200 },
    data: {
      label: "Voice Over",
      icon: Mic,
      description: "Generate professional voice-over",
    },
    type: "workflowStep",
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    style: { stroke: "#f97316", strokeWidth: 2 },
    animated: false,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "smoothstep",
    style: { stroke: "#f97316", strokeWidth: 2 },
    animated: false,
  },
];

export default function Dashboard() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div className="h-screen w-full bg-gradient-to-br from-pink-300 via-pink-400 to-orange-400 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/95 backdrop-blur-sm border-r border-white/20 flex flex-col">
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
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg"
            >
              <Workflow className="w-4 h-4" />
              <span>Workflows</span>
              <Plus className="w-4 h-4 ml-auto text-gray-400" />
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Collections</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900"
            >
              <Calendar className="w-4 h-4" />
              <span>Executions</span>
            </a>
          </nav>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <UserMenu />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-white/90 backdrop-blur-sm border-b border-white/20 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Workflow Builder
            </h2>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-white m-6 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
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
              minZoom={0.1}
              maxZoom={2}
              attributionPosition="bottom-left"
            >
              <Background gap={20} size={1} color="#f1f5f9" />
              <Controls
                className="!bg-white !border !border-gray-200 !rounded-lg !shadow-lg"
                showZoom={true}
                showFitView={true}
                showInteractive={false}
              />
            </ReactFlow>
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-white/30">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg font-medium">
                Execute workflow
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
