import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { FunnelNodeData } from '../types';
import { NODE_TEMPLATES } from '../constants';

export const FunnelNode = memo(({ data, selected }: NodeProps<FunnelNodeData>) => {
  const template = NODE_TEMPLATES.find((t) => t.type === data.type);
  
  if (!template) return null;

  const showTargetHandle = data.type !== 'sales';
  const showSourceHandle = data.type !== 'thankyou';

  return (
    <div
      className={`
        relative px-4 py-3 rounded-lg shadow-lg border-2 min-w-[180px]
        ${selected ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300'}
        bg-white transition-all duration-200 hover:shadow-xl
      `}
      role="button"
      tabIndex={0}
      aria-label={`${data.label} node`}
    >
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
          aria-label="Connection input"
        />
      )}
      
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl" role="img" aria-label={template.label}>
          {template.icon}
        </span>
        <div className="flex-1">
          <div className="font-semibold text-gray-800 text-sm">{data.label}</div>
          <div className={`text-xs px-2 py-0.5 rounded ${template.color} text-white inline-block mt-0.5`}>
            {template.label}
          </div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-200">
        <button
          className="w-full text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </button>
      </div>

      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
          aria-label="Connection output"
        />
      )}
    </div>
  );
});

FunnelNode.displayName = 'FunnelNode';
