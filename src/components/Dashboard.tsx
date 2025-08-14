import { useCallback, type ComponentType } from "react";
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
import { HookNode } from "./nodes/HookNode";
import { VoiceOverNode } from "./nodes/VoiceOverNode";
import { TranscribeYouTubeNode } from "./nodes/TranscribeYouTubeNode";

const nodeTypes = {
  transcribeYoutube: TranscribeYouTubeNode,
  generateHook: HookNode,
  voiceOver: VoiceOverNode,
} satisfies Record<string, ComponentType<any>>;

const initialNodes: Node[] = [
  { id: "1", position: { x: 0, y: 40 }, data: {}, type: "transcribeYoutube" },
  { id: "2", position: { x: 260, y: 40 }, data: {}, type: "generateHook" },
  { id: "3", position: { x: 520, y: 40 }, data: {}, type: "voiceOver" },
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
      <div className="absolute top-3 right-3 z-10">
        <UserButton className="bg-zinc-900 text-white border border-zinc-800" />
      </div>

      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{ animated: true, style: { stroke: "#facc15", strokeWidth: 2 } }}
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
