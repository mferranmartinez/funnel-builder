import type { FunnelNode, FunnelEdge, ValidationError } from '../types';

export const validateFunnel = (
  nodes: FunnelNode[],
  edges: FunnelEdge[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const nodesWithOutgoing = new Set(edges.map((e) => e.source));
  const nodesWithIncoming = new Set(edges.map((e) => e.target));

  nodes.forEach((node) => {
    const hasOutgoing = nodesWithOutgoing.has(node.id);
    const hasIncoming = nodesWithIncoming.has(node.id);
    const outgoingCount = edges.filter((e) => e.source === node.id).length;

    if (node.data.type === 'thankyou' && hasOutgoing) {
      errors.push({
        type: 'error',
        message: `"${node.data.label}" (Thank You page) should not have outgoing connections`,
        nodeId: node.id,
      });
    }

    if (node.data.type === 'sales') {
      if (outgoingCount === 0) {
        errors.push({
          type: 'warning',
          message: `"${node.data.label}" (Sales Page) should connect to an Order Page`,
          nodeId: node.id,
        });
      } else if (outgoingCount > 1) {
        errors.push({
          type: 'warning',
          message: `"${node.data.label}" (Sales Page) should have only one outgoing connection`,
          nodeId: node.id,
        });
      }
    }
    
    if (node.data.type === 'sales' && hasIncoming) {
      errors.push({
        type: 'warning',
        message: `"${node.data.label}" (Sales Page) should be the entry point (no incoming connections)`,
        nodeId: node.id,
      });
    }

    if (!hasIncoming && !hasOutgoing && node.data.type !== 'sales') {
      errors.push({
        type: 'warning',
        message: `"${node.data.label}" is disconnected from the funnel`,
        nodeId: node.id,
      });
    }

    if (node.data.type === 'thankyou' && !hasIncoming) {
      errors.push({
        type: 'warning',
        message: `"${node.data.label}" (Thank You page) should have at least one incoming connection`,
        nodeId: node.id,
      });
    }
  });

  const salesPages = nodes.filter((n) => n.data.type === 'sales');
  if (salesPages.length > 1) {
    errors.push({
      type: 'warning',
      message: `Found ${salesPages.length} Sales Pages. Typically, a funnel should have one entry point.`,
    });
  }

  if (nodes.length === 0) {
    errors.push({
      type: 'warning',
      message: 'Funnel is empty. Add nodes to get started.',
    });
  }

  return errors;
};
