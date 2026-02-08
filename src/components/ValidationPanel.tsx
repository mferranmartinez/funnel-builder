import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import type { ValidationError } from '../types';
import { useState } from 'react';

interface ValidationPanelProps {
  errors: ValidationError[];
}

export const ValidationPanel = ({ errors }: ValidationPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (errors.length === 0) {
    return (
      <div
        className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-green-200 p-4 max-w-md z-10"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle size={20} />
          <span className="font-medium">Funnel is valid!</span>
        </div>
      </div>
    );
  }

  const errorCount = errors.filter((e) => e.type === 'error').length;
  const warningCount = errors.filter((e) => e.type === 'warning').length;

  return (
    <div
      className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md z-10"
      role="alert"
      aria-live="assertive"
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <AlertCircle size={20} className="text-red-500" />
          <span className="font-medium text-gray-800">
            Validation Issues ({errorCount} errors, {warningCount} warnings)
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '+' : '−'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="border-t border-gray-200 p-4 pt-3 max-h-64 overflow-y-auto">
          <ul className="space-y-2">
            {errors.map((error, index) => (
              <li
                key={index}
                className={`flex items-start gap-2 p-2 rounded ${
                  error.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'
                }`}
              >
                {error.type === 'error' ? (
                  <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    error.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                  }`}
                >
                  {error.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
