import React from 'react';
import { 
  DocumentDuplicateIcon, 
  ScissorsIcon, 
  PhotoIcon, 
  PencilIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  minFiles: number;
  maxFiles?: number;
  fileTypes?: string[];
}

const tools: Tool[] = [
  {
    id: 'merge',
    name: 'Merge PDFs',
    description: 'Combine multiple PDFs into one document',
    icon: <DocumentDuplicateIcon className="h-8 w-8" />,
    color: 'blue',
    minFiles: 2,
    fileTypes: ['pdf']
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Extract specific pages or ranges from PDF',
    icon: <ScissorsIcon className="h-8 w-8" />,
    color: 'green',
    minFiles: 1,
    maxFiles: 1,
    fileTypes: ['pdf']
  },
  {
    id: 'convert',
    name: 'Images to PDF',
    description: 'Convert multiple images to PDF format',
    icon: <PhotoIcon className="h-8 w-8" />,
    color: 'purple',
    minFiles: 1,
    fileTypes: ['image']
  },
  {
    id: 'edit',
    name: 'Edit PDF',
    description: 'Add annotations, text, and drawings',
    icon: <PencilIcon className="h-8 w-8" />,
    color: 'orange',
    minFiles: 1,
    maxFiles: 1,
    fileTypes: ['pdf']
  }
];

export const ToolPanel: React.FC = () => {
  const { currentTool, setCurrentTool, selectedFiles, files } = useAppStore();
  const selectedCount = selectedFiles.length;

  const isToolAvailable = (tool: Tool) => {
    if (selectedCount < tool.minFiles) return false;
    if (tool.maxFiles && selectedCount > tool.maxFiles) return false;
    
    // Check file types if specified
    if (tool.fileTypes) {
      const selectedFileTypes = selectedFiles.map(fileId => {
        const file = files.find(f => f.id === fileId);
        return file?.file.type.startsWith('image/') ? 'image' : 'pdf';
      });
      
      const requiredType = tool.fileTypes[0];
      return selectedFileTypes.every(type => type === requiredType);
    }
    
    return true;
  };

  const getUnavailableReason = (tool: Tool) => {
    if (selectedCount < tool.minFiles) {
      return `Select ${tool.minFiles - selectedCount} more file${tool.minFiles - selectedCount > 1 ? 's' : ''}`;
    }
    if (tool.maxFiles && selectedCount > tool.maxFiles) {
      return `Too many files selected (max ${tool.maxFiles})`;
    }
    if (tool.fileTypes) {
      const selectedFileTypes = selectedFiles.map(fileId => {
        const file = files.find(f => f.id === fileId);
        return file?.file.type.startsWith('image/') ? 'image' : 'pdf';
      });
      
      const requiredType = tool.fileTypes[0];
      if (!selectedFileTypes.every(type => type === requiredType)) {
        return `Only ${requiredType} files supported`;
      }
    }
    return '';
  };

  const getColorClasses = (color: string, isActive: boolean, isAvailable: boolean) => {
    if (!isAvailable) {
      return 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-2 border-gray-200 dark:border-gray-700';
    }
    
    if (isActive) {
      const activeColors = {
        blue: 'bg-blue-500 text-white shadow-lg border-2 border-blue-500 transform scale-105',
        green: 'bg-green-500 text-white shadow-lg border-2 border-green-500 transform scale-105',
        purple: 'bg-purple-500 text-white shadow-lg border-2 border-purple-500 transform scale-105',
        orange: 'bg-orange-500 text-white shadow-lg border-2 border-orange-500 transform scale-105'
      };
      return activeColors[color as keyof typeof activeColors];
    }
    
    const hoverColors = {
      blue: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md',
      green: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-md',
      purple: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-md',
      orange: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:shadow-md'
    };
    return hoverColors[color as keyof typeof hoverColors];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            PDF Tools
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select files from the sidebar to enable tools
          </p>
        </div>
        
        {/* Tool Status */}
        {currentTool && (
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300 capitalize">
              {currentTool} Tool Active
            </span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => {
          const isActive = currentTool === tool.id;
          const isAvailable = isToolAvailable(tool);
          const unavailableReason = isAvailable ? '' : getUnavailableReason(tool);
          
          return (
            <button
              key={tool.id}
              onClick={() => isAvailable && setCurrentTool(tool.id as any)}
              disabled={!isAvailable}
              className={`
                tool-button p-6 rounded-xl transition-all duration-300 text-left group
                ${getColorClasses(tool.color, isActive, isAvailable)}
                ${isAvailable ? 'transform hover:scale-105 hover:shadow-lg' : ''}
              `}
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className={`mb-3 transition-transform duration-200 ${isAvailable ? 'group-hover:scale-110' : ''}`}>
                  {tool.icon}
                </div>
                
                {/* Title */}
                <h3 className="font-semibold text-lg mb-2">
                  {tool.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm opacity-80 mb-3">
                  {tool.description}
                </p>
                
                {/* Status */}
                {!isAvailable ? (
                  <div className="mt-auto">
                    <p className="text-xs opacity-60 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {unavailableReason}
                    </p>
                  </div>
                ) : isActive ? (
                  <div className="mt-auto">
                    <div className="flex items-center space-x-1 text-xs">
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                      <span>Active</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs">Click to select</p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Selection Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {files.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Files
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {selectedCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Selected
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {tools.filter(tool => isToolAvailable(tool)).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Available Tools
          </div>
        </div>
      </div>
      
      {/* Help Text */}
      {selectedCount === 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Getting Started
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Upload files using the upload area above, then select them from the sidebar to enable PDF tools.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};