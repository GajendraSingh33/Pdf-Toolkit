import React, { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ZoomInIcon, 
  ZoomOutIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon 
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useAppStore } from '../../stores/appStore';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  fileId: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ fileId }) => {
  const { files } = useAppStore();
  const file = files.find(f => f.id === fileId);
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError('');
    
    // Update page count in store
    const { files } = useAppStore.getState();
    const updatedFiles = files.map(f => 
      f.id === fileId ? { ...f, pages: numPages } : f
    );
    useAppStore.setState({ files: updatedFiles });
  }, [fileId]);

  const onDocumentLoadError = useCallback((error: Error) => {
    setLoading(false);
    setError('Failed to load PDF: ' + error.message);
  }, []);

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          goToPrevPage();
          break;
        case 'ArrowRight':
          goToNextPage();
          break;
        case 'Escape':
          if (isFullscreen) setIsFullscreen(false);
          break;
        case '+':
        case '=':
          event.preventDefault();
          zoomIn();
          break;
        case '-':
          event.preventDefault();
          zoomOut();
          break;
        case '0':
          event.preventDefault();
          resetZoom();
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isFullscreen, numPages]);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No file selected</p>
      </div>
    );
  }

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col"
    : "bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden";

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 ${isFullscreen ? 'bg-gray-900 text-white' : ''}`}>
        <div className="flex items-center space-x-2">
          <Button
            variant={isFullscreen ? "ghost" : "outline"}
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-center"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              / {numPages}
            </span>
          </div>
          
          <Button
            variant={isFullscreen ? "ghost" : "outline"}
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant={isFullscreen ? "ghost" : "ghost"} size="sm" onClick={zoomOut}>
            <ZoomOutIcon className="h-4 w-4" />
          </Button>
          
          <Button variant={isFullscreen ? "ghost" : "ghost"} size="sm" onClick={resetZoom}>
            {Math.round(scale * 100)}%
          </Button>
          
          <Button variant={isFullscreen ? "ghost" : "ghost"} size="sm" onClick={zoomIn}>
            <ZoomInIcon className="h-4 w-4" />
          </Button>
          
          <Button variant={isFullscreen ? "ghost" : "ghost"} size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <ArrowsPointingInIcon className="h-4 w-4" />
            ) : (
              <ArrowsPointingOutIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* PDF Display */}
      <div className={`overflow-auto bg-gray-100 dark:bg-gray-900 custom-scrollbar ${isFullscreen ? 'flex-1' : 'max-h-[600px]'}`}>
        <div className="flex justify-center p-4">
          {error ? (
            <div className="flex items-center justify-center h-96 text-red-500">
              <div className="text-center">
                <p className="text-lg font-medium">Error loading PDF</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            </div>
          ) : (
            <Document
              file={file.url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading PDF...</p>
                  </div>
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
              />
            </Document>
          )}
        </div>
      </div>
      
      {/* Footer with file info */}
      <div className={`p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 ${isFullscreen ? 'bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}`}>
        <div className="flex justify-between items-center">
          <span>{file.name}</span>
          <span>Page {pageNumber} of {numPages}</span>
        </div>
      </div>
    </div>
  );
};