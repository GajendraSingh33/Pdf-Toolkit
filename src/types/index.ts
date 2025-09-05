export interface PDFFile {
  id: string;
  name: string;
  file: File;
  pages: number;
  size: number;
  url: string;
}

export interface ProcessingOptions {
  pageRanges?: Array<[number, number]>;
  quality?: number;
  compression?: boolean;
}

export interface AppState {
  files: PDFFile[];
  selectedFiles: string[];
  currentTool: 'merge' | 'split' | 'convert' | 'edit' | null;
  isProcessing: boolean;
  progress: number;
  theme: 'light' | 'dark';
}

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  acceptedTypes: string[];
  maxFiles?: number;
}