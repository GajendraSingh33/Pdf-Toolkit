import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PDFFile, AppState } from '../types';

interface AppStore extends AppState {
  addFiles: (files: PDFFile[]) => void;
  removeFile: (id: string) => void;
  selectFile: (id: string) => void;
  deselectFile: (id: string) => void;
  clearFiles: () => void;
  setCurrentTool: (tool: AppState['currentTool']) => void;
  setProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      files: [],
      selectedFiles: [],
      currentTool: null,
      isProcessing: false,
      progress: 0,
      theme: 'light',
      
      addFiles: (newFiles) => set((state) => ({
        files: [...state.files, ...newFiles]
      })),
      
      removeFile: (id) => set((state) => ({
        files: state.files.filter(f => f.id !== id),
        selectedFiles: state.selectedFiles.filter(fId => fId !== id)
      })),
      
      selectFile: (id) => set((state) => ({
        selectedFiles: [...state.selectedFiles, id]
      })),
      
      deselectFile: (id) => set((state) => ({
        selectedFiles: state.selectedFiles.filter(fId => fId !== id)
      })),
      
      clearFiles: () => set({ files: [], selectedFiles: [] }),
      
      setCurrentTool: (tool) => set({ currentTool: tool }),
      
      setProcessing: (isProcessing) => set({ isProcessing }),
      
      setProgress: (progress) => set({ progress }),
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      }))
    }),
    {
      name: 'pdf-app-storage',
      partialize: (state) => ({ theme: state.theme })
    }
  )
);