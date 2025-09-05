import { useState, useCallback } from 'react';
import { useAppStore } from '../stores/appStore';
import { PDFProcessor } from '../utils/pdfUtils';
import { ProcessingOptions } from '../types';

export const usePDFOperations = () => {
  const { files, selectedFiles, setProcessing, setProgress } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const getSelectedFiles = useCallback(() => {
    return files.filter(f => selectedFiles.includes(f.id));
  }, [files, selectedFiles]);

  const mergePDFs = useCallback(async (): Promise<Uint8Array | null> => {
    const selectedPDFs = getSelectedFiles();
    if (selectedPDFs.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return null;
    }

    try {
      setProcessing(true);
      setError(null);
      
      const buffers = await Promise.all(
        selectedPDFs.map(async (pdf, index) => {
          setProgress((index / selectedPDFs.length) * 50);
          return await pdf.file.arrayBuffer();
        })
      );

      setProgress(75);
      const result = await PDFProcessor.mergePDFs(buffers);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError('Failed to merge PDFs: ' + (err as Error).message);
      return null;
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }, [getSelectedFiles, setProcessing, setProgress]);

  const splitPDF = useCallback(async (
    fileId: string, 
    pageRanges: Array<[number, number]>
  ): Promise<Uint8Array[] | null> => {
    const file = files.find(f => f.id === fileId);
    if (!file) {
      setError('File not found');
      return null;
    }

    try {
      setProcessing(true);
      setError(null);
      
      const buffer = await file.file.arrayBuffer();
      setProgress(50);
      
      const results = await PDFProcessor.splitPDF(buffer, pageRanges);
      setProgress(100);
      
      return results;
    } catch (err) {
      setError('Failed to split PDF: ' + (err as Error).message);
      return null;
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }, [files, setProcessing, setProgress]);

  const imagesToPDF = useCallback(async (imageFiles: File[]): Promise<Uint8Array | null> => {
    try {
      setProcessing(true);
      setError(null);
      
      const result = await PDFProcessor.imagesToPDF(imageFiles, (progress) => {
        setProgress(progress);
      });
      
      return result;
    } catch (err) {
      setError('Failed to convert images to PDF: ' + (err as Error).message);
      return null;
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }, [setProcessing, setProgress]);

  return {
    mergePDFs,
    splitPDF,
    imagesToPDF,
    error,
    clearError: () => setError(null)
  };
};