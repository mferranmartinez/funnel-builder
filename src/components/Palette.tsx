import type { DragEvent } from 'react';
import { NODE_TEMPLATES } from '../constants';
import type { NodeType } from '../types';

interface PaletteProps {
  onAddNode: (type: NodeType) => void;
}

export const Palette = ({ onAddNode }: PaletteProps) => {
  const onDragStart = (event: DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside
      className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto"
      role="complementary"
      aria-label="Node palette"
    >
      <h2 className="text-lg font-bold text-gray-800 mb-4">Node Palette</h2>
      <p className="text-sm text-gray-600 mb-4">
        Drag nodes onto the canvas to build your funnel
      </p>
      
      <div className="space-y-2">
        {NODE_TEMPLATES.map((template) => (
          <div
            key={template.type}
            draggable
            onDragStart={(e) => onDragStart(e, template.type)}
            onClick={() => onAddNode(template.type)}
            className="p-3 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:border-blue-400 hover:shadow-md transition-all duration-200"
            role="button"
            tabIndex={0}
            aria-label={`Add ${template.label} node`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAddNode(template.type);
              }
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" role="img" aria-label={template.label}>
                {template.icon}
              </span>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800">
                  {template.label}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {template.description}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Quick Tips</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Drag nodes to canvas</li>
          <li>• Click to add at center</li>
          <li>• Connect via handles</li>
          <li>• Select & press Delete</li>
        </ul>
      </div>
    </aside>
  );
};
