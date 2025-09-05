import { PDFDocument, rgb, degrees } from 'pdf-lib';

export class PDFProcessor {
  static async mergePDFs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    
    for (const buffer of pdfBuffers) {
      const pdf = await PDFDocument.load(buffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }
    
    return await mergedPdf.save();
  }
  
  static async splitPDF(
    pdfBuffer: ArrayBuffer, 
    pageRanges: Array<[number, number]>
  ): Promise<Uint8Array[]> {
    const sourcePdf = await PDFDocument.load(pdfBuffer);
    const results: Uint8Array[] = [];
    
    for (const [start, end] of pageRanges) {
      const newPdf = await PDFDocument.create();
      const pageIndices = Array.from(
        { length: end - start + 1 }, 
        (_, i) => start - 1 + i
      );
      const pages = await newPdf.copyPages(sourcePdf, pageIndices);
      pages.forEach(page => newPdf.addPage(page));
      results.push(await newPdf.save());
    }
    
    return results;
  }
  
  static async imagesToPDF(
    imageFiles: File[], 
    onProgress?: (progress: number) => void
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const imageBytes = await file.arrayBuffer();
      
      let image;
      if (file.type.includes('png')) {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (file.type.includes('jpg') || file.type.includes('jpeg')) {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        throw new Error(`Unsupported image type: ${file.type}`);
      }
      
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      
      if (onProgress) {
        onProgress(((i + 1) / imageFiles.length) * 100);
      }
    }
    
    return await pdfDoc.save();
  }

  static async addWatermark(
    pdfBuffer: ArrayBuffer, 
    watermarkText: string
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    
    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: width / 2 - 50,
        y: height / 2,
        size: 50,
        color: rgb(0.7, 0.7, 0.7),
        rotate: degrees(45),
      });
    });
    
    return await pdfDoc.save();
  }

  static async getPDFInfo(pdfBuffer: ArrayBuffer) {
    const pdf = await PDFDocument.load(pdfBuffer);
    return {
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle() || 'Untitled',
      author: pdf.getAuthor() || 'Unknown',
      subject: pdf.getSubject() || '',
      creator: pdf.getCreator() || 'Unknown'
    };
  }
}