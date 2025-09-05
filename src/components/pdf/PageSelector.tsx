import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface PageRange {
  start: number;
  end: number;
  label: string;
  id: string;
}

interface PageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  onConfirm: (ranges: Array<[number, number]>) => void;
}

export const PageSelector: React.FC<PageSelectorProps> = ({
  isOpen,
  onClose,
  totalPages,
  onConfirm
}) => {
  const [ranges, setRanges] = useState<PageRange[]>([]);
  const [customStart, setCustomStart] = useState<number>(1);
  const [customEnd, setCustomEnd] = useState<number>(totalPages);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setRanges([]);
      setCustomStart(1);
      setCustomEnd(totalPages);
      setError('');
    }
  }, [isOpen, totalPages]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const validateRange = (start: number, end: number): string | null => {
    if (start < 1 || start > totalPages) {
      return `Start page must be between 1 and ${totalPages}`;
    }
    if (end < 1 || end > totalPages) {
      return `End page must be between 1 and ${totalPages}`;
    }
    if (start > end) {
      return 'Start page cannot be greater than end page';
    }
    return null;
  };

  const addRange = () => {
    const validationError = validateRange(customStart, customEnd);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newRange: PageRange = {
      id: generateId(),
      start: customStart,
      end: customEnd,
      label: customStart === customEnd 
        ? `Page ${customStart}` 
        : `Pages ${customStart}-${customEnd}`
    };
    
    setRanges(prev => [...prev, newRange]);
    setCustomStart(1);
    setCustomEnd(totalPages);
    setError('');
  };

  const removeRange = (id: string) => {
    setRanges(prev => prev.filter(range => range.id !== id));
  };

  const addQuickRange = (type: 'all' | 'first' | 'last' | 'odd' | 'even') => {
    let newRange: PageRange;
    
    switch (type) {
      case 'all':
        newRange = {
          id: generateId(),
          start: 1,
          end: totalPages,
          label: 'All Pages'
        };
        break;
      case 'first':
        newRange = {
          id: generateId(),
          start: 1,
          end: Math.min(5, totalPages),
          label: `First ${Math.min(5, totalPages)} Pages`
        };
        break;
      case 'last':
        newRange = {
          id: generateId(),
          start: Math.max(1, totalPages - 4),
          end: totalPages,
          label: `Last ${Math.min(5, totalPages)} Pages`
        };
        break;
      case 'odd':
        newRange = {
          id: generateId(),
          start: 1,
          end: totalPages,
          label: 'Odd Pages'
        };
        break;
      case 'even':
        newRange = {
          id: generateId(),
          start: 2,
          end: totalPages,
          label: 'Even Pages'
        };
        break;
      default:
        return;
    }
    
    setRanges(prev => [...prev, newRange]);
  };

  const handleConfirm = () => {
    if (ranges.length === 0) {
      setError('Please select at least one page range');
      return;
    }

    const pageRanges: Array<[number, number]> = ranges.map(range => [range.start, range.end]);
    onConfirm(pageRanges);
    onClose();
  };

  const getTotalSelectedPages = () => {
    return ranges.reduce((total, range) => total + (range.end - range.start + 1), 0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Pages to Extract" size="lg">
      <div className="space-y-6">
        {/* Quick Selection Buttons */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick Selection:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Button variant="outline" size="sm" onClick={() => addQuickRange('all')}>
              All Pages
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuickRange('first')}>
              First 5
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuickRange('last')}>
              Last 5
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuickRange('odd')}>
              Odd Pages
            </Button>
            <Button variant="outline" size="sm" onClick={() => addQuickRange('even')}>
              Even Pages
            </Button>
          </div>
        </div>

        {/* Custom Range Input */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Custom Range:
          </h4>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Start Page
              </label>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={customStart}
                onChange={(e) => setCustomStart(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                End Page
              </label>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={customEnd}
                onChange={(e) => setCustomEnd(parseInt(e.target.value) || totalPages)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <Button onClick={addRange} className="flex items-center space-x-1">
              <PlusIcon className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </div>
          
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
        
        {/* Selected Ranges */}
        {ranges.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Ranges ({ranges.length}):
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total: {getTotalSelectedPages()} pages
              </p>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {ranges.map((range) => (
                <div 
                  key={range.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {range.label}
                    </span>
                    {range.label.includes('Odd') || range.label.includes('Even') ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {range.label.includes('Odd') ? 'Pages: 1, 3, 5...' : 'Pages: 2, 4, 6...'}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {range.end - range.start + 1} page{range.end - range.start + 1 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRange(range.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1"
                    title="Remove range"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Preview */}
        {ranges.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Preview:
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This will create {ranges.length} separate PDF file{ranges.length > 1 ? 's' : ''} 
              with a total of {getTotalSelectedPages()} page{getTotalSelectedPages() > 1 ? 's' : ''}.
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={() => setRanges([])}
            disabled={ranges.length === 0}
          >
            Clear All
          </Button>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={ranges.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Extract Pages ({getTotalSelectedPages()})
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};