// src/utils/pdfActions.ts
import { PDFDocument } from "pdf-lib";

const downloadBlob = (data: Uint8Array, filename: string) => {
    const arrayBuffer: ArrayBuffer = data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength
  );
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// 1. Merge PDFs
export const mergePDFs = async (files: File[]) => {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  const mergedBytes = await mergedPdf.save();
  downloadBlob(mergedBytes, "merged.pdf");
};

// 2. Split PDF
export const splitPDF = async (file: File, pageNumbers: number[]) => {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);

  for (const pageNum of pageNumbers) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [pageNum]);
    newPdf.addPage(page);
    const pdfBytes = await newPdf.save();
    downloadBlob(pdfBytes, `page-${pageNum + 1}.pdf`);
  }
};

// 3. Image → PDF
export const imagesToPDF = async (files: File[]) => {
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const img = file.type.includes("png")
      ? await pdfDoc.embedPng(bytes)
      : await pdfDoc.embedJpg(bytes);
    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  const pdfBytes = await pdfDoc.save();
  downloadBlob(pdfBytes, "images.pdf");
};

// 4. Edit PDF (basic example)
export const editPDF = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const page = pdfDoc.getPages()[0];
  page.drawText("Edited with PDF Toolkit!", { x: 50, y: 700, size: 20 });
  const editedBytes = await pdfDoc.save();
  downloadBlob(editedBytes, "edited.pdf");
};
