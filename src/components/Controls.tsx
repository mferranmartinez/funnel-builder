import { Download, Upload, Save, FolderOpen, Undo2, Redo2 } from 'lucide-react';

interface ControlsProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onImport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Controls = ({
  onSave,
  onLoad,
  onExport,
  onImport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ControlsProps) => {
  return (
    <div
      className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-2 z-10"
      role="toolbar"
      aria-label="Funnel controls"
    >
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        <Undo2 size={20} />
      </button>
      
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
      >
        <Redo2 size={20} />
      </button>

      <div className="w-px bg-gray-300" role="separator" />
      
      <button
        onClick={onSave}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Save to localStorage"
        aria-label="Save funnel"
      >
        <Save size={20} />
      </button>
      
      <button
        onClick={onLoad}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Load from localStorage"
        aria-label="Load funnel"
      >
        <FolderOpen size={20} />
      </button>

      <div className="w-px bg-gray-300" role="separator" />
      
      <button
        onClick={onExport}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Export as JSON"
        aria-label="Export funnel"
      >
        <Download size={20} />
      </button>
      
      <button
        onClick={onImport}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Import from JSON"
        aria-label="Import funnel"
      >
        <Upload size={20} />
      </button>
    </div>
  );
};
