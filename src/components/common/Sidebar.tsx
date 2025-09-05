import React from 'react';
import { useAppStore } from '../../stores/appStore';
import { formatFileSize } from '../../utils/fileUtils';
import { Button } from '../ui/Button';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';

export const Sidebar: React.FC = () => {
  const { files, selectedFiles, selectFile, deselectFile, removeFile } = useAppStore();

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto custom-scrollbar">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Files ({files.length})
        </h2>
        
        {files.length === 0 ? (
          <div className="text-center py-8">
            <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No files uploaded yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => {
              const isSelected = selectedFiles.includes(file.id);
              
              return (
                <div
                  key={file.id}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                  onClick={() => isSelected ? deselectFile(file.id) : selectFile(file.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatFileSize(file.size)} • {file.pages} pages
                      </p>
                      {isSelected && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                            Selected
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="p-1 ml-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                      title="Remove file"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* File Stats */}
        {files.length > 0 && (
          <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between items-center mb-1">
                <span>Total Files:</span>
                <span className="font-medium">{files.length}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span>Selected:</span>
                <span className="font-medium">{selectedFiles.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Size:</span>
                <span className="font-medium">
                  {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Clear All Button */}
        {files.length > 0 && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                files.forEach(file => removeFile(file.id));
              }}
              className="w-full text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Clear All Files
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};