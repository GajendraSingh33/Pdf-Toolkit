import { useState, useEffect } from "react";
import {
  mergePDFs,
  splitPDF,
  imagesToPDF,
  editPDF,
} from "./utils/pdfActions";
import {
  Upload,
  FileText,
  Scissors,
  Images,
  Edit3,
  Sun,
  Moon,
} from "lucide-react";

type Tool = "upload" | "merge" | "split" | "imageToPdf" | "edit";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>("upload");
  const [files, setFiles] = useState<File[]>([]); // 🔹 Store uploaded files here

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // 🔹 Render tool-specific content inside the white card
  const renderToolContent = () => {
    switch (activeTool) {
      case "merge":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
              Merge PDFs
            </h2>
            <button
              onClick={() => mergePDFs(files)}
              disabled={files.length < 2}
              className="mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transform hover:scale-105 transition"
            >
              Merge PDFs
            </button>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Upload multiple PDFs to combine them into one file.
            </p>
            <UploadSection setFiles={setFiles} files={files} />
          </>
        );

      case "split":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
              Split PDF
            </h2>
            <button
              onClick={() =>
                files.length > 0 && splitPDF(files[0], [0, 1]) // Example: first 2 pages
              }
              disabled={files.length === 0}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg transform hover:scale-105 transition"
            >
              Split PDF
            </button>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Upload a PDF and choose page ranges to split.
            </p>
            <UploadSection setFiles={setFiles} files={files} />
          </>
        );

      case "imageToPdf":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
              Image → PDF
            </h2>
            <button
              onClick={() => imagesToPDF(files)}
              disabled={files.length === 0}
              className="mt-4 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transform hover:scale-105 transition"
            >
              Convert Images
            </button>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Upload images to convert them into a single PDF.
            </p>
            <UploadSection setFiles={setFiles} files={files} />
          </>
        );

      case "edit":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
              Edit PDF
            </h2>
            <button
              onClick={() => files.length > 0 && editPDF(files[0])}
              disabled={files.length === 0}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transform hover:scale-105 transition"
            >
              Edit PDF
            </button>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Upload a PDF to rotate, reorder, or remove pages.
            </p>
            <UploadSection setFiles={setFiles} files={files} />
          </>
        );

      default:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
              Upload PDF / Images
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop your files here, or click below.
            </p>
            <UploadSection setFiles={setFiles} files={files} />
          </>
        );
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } transition`}
    >
      {/* ✅ Options Toolbar ABOVE the white box */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTool("merge")}
          className="option-btn bg-green-600 hover:bg-green-700"
        >
          <FileText size={18} /> Merge
        </button>
        <button
          onClick={() => setActiveTool("split")}
          className="option-btn bg-yellow-500 hover:bg-yellow-600"
        >
          <Scissors size={18} /> Split
        </button>
        <button
          onClick={() => setActiveTool("imageToPdf")}
          className="option-btn bg-pink-600 hover:bg-pink-700"
        >
          <Images size={18} /> Image → PDF
        </button>
        <button
          onClick={() => setActiveTool("edit")}
          className="option-btn bg-blue-600 hover:bg-blue-700"
        >
          <Edit3 size={18} /> Edit PDF
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="option-btn bg-gray-600 hover:bg-gray-700"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* White Card */}
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-10 max-w-2xl w-full text-center">
        {/* Title */}
        <div className="flex flex-col items-center mb-6">
          <FileText className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
            PDF Toolkit
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Merge, split, rotate, and manage your PDF files
          </p>
        </div>

        {/* ✅ Dynamic Tool Content */}
        {renderToolContent()}

        {/* Show uploaded files */}
        {files.length === 0 && (
          <div className="mt-6 text-gray-500 dark:text-gray-400">
            <FileText className="w-6 h-6 mx-auto mb-2" />
            <p>No files uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔹 Separate Upload Section for Reuse */
export function UploadSection({
  setFiles,
  files,
}: {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  files: File[];
}) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
      <Upload className="w-10 h-10 mx-auto text-indigo-500" />
      <label className="cursor-pointer inline-block bg-indigo-600 text-white px-6 py-2 mt-4 rounded-xl font-medium hover:bg-indigo-700 transform hover:scale-105 transition">
        Choose Files
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* ✅ Show uploaded files list */}
      {files.length > 0 && (
        <div className="mt-4 text-left">
          <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-2">
            Uploaded Files:
          </h3>
          <ul className="space-y-1 text-sm">
            {files.map((file, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md"
              >
                <FileText size={16} className="text-indigo-500" />
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
