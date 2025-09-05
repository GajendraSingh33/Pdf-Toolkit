import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useFileUpload } from '../../hooks/useFileUpload';
import { validateFileType } from '../../utils/fileUtils';

interface FileUploaderProps {
  acceptedTypes: string[];
  maxFiles?: number;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  acceptedTypes,
  maxFiles = 10,
  className = ''
}) => {
  const { handleFileUpload } = useFileUpload();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => 
      validateFileType(file, acceptedTypes)
    );
    
    if (validFiles.length > 0) {
      await handleFileUpload(validFiles);
    }
  }, [acceptedTypes, handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    }
  });

  const getFileTypeIcon = () => {
    if (acceptedTypes.includes('application/pdf') && acceptedTypes.includes('image/*')) {
      return <DocumentIcon className="h-16 w-16 text-gray-400 mb-4" />;
    } else if (acceptedTypes.includes('image/*')) {
      return <PhotoIcon className="h-16 w-16 text-gray-400 mb-4" />;
    }
    return <DocumentIcon className="h-16 w-16 text-gray-400 mb-4" />;
  };

  const getAcceptedTypesText = () => {
    const types = [];
    if (acceptedTypes.includes('application/pdf')) types.push('PDF');
    if (acceptedTypes.includes('image/*')) types.push('Images (PNG, JPG, JPEG, GIF, BMP, WebP)');
    return types.join(', ');
  };

  return (
    <div className={`upload-area ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center
          ${isDragActive && !isDragReject
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
            : isDragReject
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {isDragActive ? (
          isDragReject ? (
            <>
              <CloudArrowUpIcon className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-lg font-medium text-red-600 dark:text-red-400">
                File type not supported
              </p>
              <p className="text-sm text-red-500 dark:text-red-400">
                Please drop supported file types only
              </p>
            </>
          ) : (
            <>
              <CloudArrowUpIcon className="h-16 w-16 text-blue-500 mb-4 animate-bounce" />
              <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                Drop files here...
              </p>
            </>
          )
        ) : (
          <>
            {getFileTypeIcon()}
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload files
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <div className="space-y-1">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Supports: {getAcceptedTypesText()}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Maximum {maxFiles} files, up to 50MB each
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};