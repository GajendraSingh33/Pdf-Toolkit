import { useCallback } from 'react';
import { useAppStore } from '../stores/appStore';
import { PDFFile } from '../types';
import { generateId } from '../utils/fileUtils';

export const useFileUpload = () => {
  const { addFiles } = useAppStore();

  const processFiles = useCallback(async (files: File[]): Promise<PDFFile[]> => {
    const processedFiles: PDFFile[] = [];

    for (const file of files) {
      try {
        const url = URL.createObjectURL(file);
        const pdfFile: PDFFile = {
          id: generateId(),
          name: file.name,
          file,
          pages: 1, // Will be updated when PDF is loaded
          size: file.size,
          url
        };
        processedFiles.push(pdfFile);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    return processedFiles;
  }, []);

  const handleFileUpload = useCallback(async (files: File[]) => {
    const processedFiles = await processFiles(files);
    addFiles(processedFiles);
    return processedFiles;
  }, [processFiles, addFiles]);

  return { handleFileUpload, processFiles };
};