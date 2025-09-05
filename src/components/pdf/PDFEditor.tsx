import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PDFViewer } from './PDFViewer';

interface PDFEditorProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string | null;
}

interface EditorTool {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const PDFEditor: React.FC<PDFEditorProps> = ({
  isOpen,
  onClose,
  fileId
}) => {
  const [activeTool, setActiveTool] = useState<string>('text');
  const [color, setColor] = useState<string>('#ff0000');
  const [fontSize, setFontSize] = useState<number>(12);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);

  const tools: EditorTool[] = [
    { id: 'text', name: 'Text', icon: '📝', description: 'Add text annotations' },
    { id: 'highlight', name: 'Highlight', icon: '🖍️', description: 'Highlight text' },
    { id: 'draw', name: 'Draw', icon: '✏️', description: 'Draw freehand' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜', description: 'Draw rectangles' },
    { id: 'circle', name: 'Circle', icon: '⭕', description: 'Draw circles' },
    { id: 'arrow', name: 'Arrow', icon: '➡️', description: 'Draw arrows' }
  ];

  const colors = [
    { name: 'Red', value: '#ff0000' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Green', value: '#00ff00' },
    { name: 'Yellow', value: '#ffff00' },
    { name: 'Purple', value: '#800080' },
    { name: 'Orange', value: '#ffa500' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#ffffff' }
  ];

  const handleSave = () => {
    // In a real implementation, this would save the annotations
    console.log('Saving PDF annotations...');
    onClose();
  };

  if (!fileId) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="PDF Editor" size="xl">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg gap-4">
          {/* Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Tools:
            </span>
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTool(tool.id)}
                title={tool.description}
                className="flex items-center space-x-1"
              >
                <span>{tool.icon}</span>
                <span className="hidden sm:inline">{tool.name}</span>
              </Button>
            ))}
          </div>
          
          {/* Properties */}
          <div className="flex items-center space-x-4">
            {/* Color Picker */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Color:
              </span>
              <div className="flex space-x-1">
                {colors.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    onClick={() => setColor(colorOption.value)}
                    className={`
                      w-6 h-6 rounded-full border-2 transition-all
                      ${color === colorOption.value 
                        ? 'border-gray-900 dark:border-white scale-110' 
                        : 'border-gray-300 hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: colorOption.value }}
                    title={colorOption.name}
                  />
                ))}
              </div>
            </div>
            
            {/* Font Size (for text tool) */}
            {activeTool === 'text' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Size:
                </span>
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}
            
            {/* Stroke Width (for drawing tools) */}
            {['draw', 'rectangle', 'circle', 'arrow'].includes(activeTool) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Width:
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                  className="w-16"
                />
                <span className="text-sm text-gray-500 w-4">{strokeWidth}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Current Tool Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{tools.find(t => t.id === activeTool)?.icon}</span>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                {tools.find(t => t.id === activeTool)?.name} Tool Selected
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {tools.find(t => t.id === activeTool)?.description}
              </p>
            </div>
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className="min-h-[500px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <PDFViewer fileId={fileId} />
        </div>
        
        {/* Instructions */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Instructions:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Click on the PDF to add annotations with the selected tool</li>
            <li>• Use arrow keys to navigate between pages</li>
            <li>• Use +/- keys or zoom buttons to adjust the view</li>
            <li>• Press Escape to exit fullscreen mode</li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setActiveTool('text')}>
              Reset Tools
            </Button>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};