import { useCallback, useMemo, useRef, useEffect } from 'react';
import type { DragEvent } from 'react';
import ReactFlow, {
  Background,
  Controls as FlowControls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import type { Connection, Edge, OnConnect, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';

import { Palette } from './components/Palette';
import { Controls } from './components/Controls';
import { ValidationPanel } from './components/ValidationPanel';
import { FunnelNode } from './components/FunnelNode';
import type { NodeType, FunnelNode as FunnelNodeType } from './types';
import { NODE_TEMPLATES } from './constants';
import { validateFunnel } from './utils/validation';
import { saveFunnel, loadFunnel, exportFunnel, importFunnel } from './utils/storage';
import { useUndoRedo } from './hooks/useUndoRedo';

const nodeTypes: NodeTypes = {
  funnelNode: FunnelNode,
};

let nodeIdCounter = 1;

function App() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const { state, setState, undo, redo, canUndo, canRedo, reset } = useUndoRedo({
    nodes: [],
    edges: [],
  });

    const nodeCounters = useRef<Record<NodeType, number>>({
    sales: 1,
    order: 1,
    upsell: 1,
    downsell: 1,
    thankyou: 1,
  });

  useEffect(() => {
    setNodes(state.nodes);
    setEdges(state.edges);
  }, [state, setNodes, setEdges]);

  const validationErrors = useMemo(
    () => validateFunnel(nodes, edges),
    [nodes, edges]
  );

  const getNodeLabel = useCallback((type: NodeType): string => {
    const template = NODE_TEMPLATES.find((t) => t.type === type);
    if (!template) return 'Unknown';

    if (type === 'upsell') {
      return `Upsell ${nodeCounters.current.upsell}`;
    } else if (type === 'downsell') {
      return `Downsell ${nodeCounters.current.downsell}`;
    } else {
      return template.label;
    }
  }, []);

  const createNode = useCallback(
    (type: NodeType, position: { x: number; y: number }): FunnelNodeType => {
      const label = getNodeLabel(type);
      
      if (type === 'upsell') {
        nodeCounters.current.upsell++;
      } else if (type === 'downsell') {
        nodeCounters.current.downsell++;
      }

      return {
        id: `node-${nodeIdCounter++}`,
        type: 'funnelNode',
        position,
        data: {
          label,
          type,
        },
      };
    },
    [getNodeLabel]
  );

  const onAddNode = useCallback(
    (type: NodeType) => {
      const position = {
        x: Math.random() * 300 + 250,
        y: Math.random() * 300 + 150,
      };
      
      const newNode = createNode(type, position);
      const newNodes = [...nodes, newNode];
      setState({ nodes: newNodes, edges });
    },
    [nodes, edges, createNode, setState]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 90,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode = createNode(type, position);
      const newNodes = [...nodes, newNode];
      setState({ nodes: newNodes, edges });
    },
    [nodes, edges, createNode, setState]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
        },
        edges
      );
      setState({ nodes, edges: newEdges });
    },
    [nodes, edges, setState]
  );

  const onNodesDelete = useCallback(
    (deleted: FunnelNodeType[]) => {
      const deletedIds = new Set(deleted.map((n) => n.id));
      const newEdges = edges.filter(
        (e) => !deletedIds.has(e.source) && !deletedIds.has(e.target)
      );
      setState({ nodes: nodes.filter((n) => !deletedIds.has(n.id)), edges: newEdges });
    },
    [nodes, edges, setState]
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      const deletedIds = new Set(deleted.map((e) => e.id));
      setState({ nodes, edges: edges.filter((e) => !deletedIds.has(e.id)) });
    },
    [nodes, edges, setState]
  );

  const handleSave = useCallback(() => {
    try {
      saveFunnel({ nodes, edges });
      alert('Funnel saved to localStorage!');
    } catch (error) {
      alert('Failed to save funnel');
    }
  }, [nodes, edges]);

  const handleLoad = useCallback(() => {
    const loaded = loadFunnel();
    if (loaded) {
      reset(loaded);
      alert('Funnel loaded from localStorage!');
    } else {
      alert('No saved funnel found');
    }
  }, [reset]);

  const handleExport = useCallback(() => {
    exportFunnel({ nodes, edges });
  }, [nodes, edges]);

  const handleImport = useCallback(async () => {
    try {
      const imported = await importFunnel();
      reset(imported);
      alert('Funnel imported successfully!');
    } catch (error) {
      alert('Failed to import funnel');
    }
  }, [reset]);

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex h-screen w-screen" ref={reactFlowWrapper}>
      <Palette onAddNode={onAddNode} />
      
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onNodeDragStop={() => {
               setState({ nodes, edges });
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <FlowControls />
          <MiniMap
            nodeColor={(node) => {
              const template = NODE_TEMPLATES.find((t) => t.type === node.data.type);
              return template?.color.replace('bg-', '#') || '#94a3b8';
            }}
            className="!bg-white !border !border-gray-300"
          />
          
          <Panel position="top-left" className="!m-4">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                Upsell Funnel Builder
              </h1>
              <p className="text-sm text-gray-600">
                Drag nodes from the palette or click to add them
              </p>
            </div>
          </Panel>
        </ReactFlow>

        <Controls
          onSave={handleSave}
          onLoad={handleLoad}
          onExport={handleExport}
          onImport={handleImport}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />

        <ValidationPanel errors={validationErrors} />
      </div>
    </div>
  );
}

export default App;
