import type { Node, Edge } from 'reactflow';

export type NodeType = 'sales' | 'order' | 'upsell' | 'downsell' | 'thankyou';

export interface FunnelNodeData {
  label: string;
  type: NodeType;
  description?: string;
}

export type FunnelNode = Node<FunnelNodeData>;
export type FunnelEdge = Edge;

export interface FunnelState {
  nodes: FunnelNode[];
  edges: FunnelEdge[];
}

export interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  nodeId?: string;
}

export interface NodeTemplate {
  type: NodeType;
  label: string;
  icon: string;
  description: string;
  color: string;
}
