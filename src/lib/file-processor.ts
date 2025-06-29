import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { parseString } from 'xml2js';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface FileProcessingResult {
  text: string;
  wordCount: number;
  characterCount: number;
  fileName: string;
  fileType: string;
}

export interface FileProcessingError {
  message: string;
  fileName: string;
  fileType: string;
}

/**
 * Counts words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Processes a text file
 */
async function processTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}

/**
 * Processes a PDF file using PDF.js
 */
async function processPdfFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }
        
        resolve(fullText);
      } catch (error) {
        reject(new Error(`Failed to process PDF: ${error}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Processes a Word document using Mammoth
 */
async function processWordFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(new Error(`Failed to process Word document: ${error}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read Word file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Processes a PowerPoint file
 */
async function processPowerPointFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // For PowerPoint files, we'll extract text from the XML structure
        // This is a simplified approach - for more complex presentations,
        // you might want to use a more sophisticated library
        
        const uint8Array = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder('utf-8');
        const content = decoder.decode(uint8Array);
        
        // Try to extract text content using regex patterns
        // This is a basic implementation - PowerPoint files are complex
        const textMatches = content.match(/<a:t[^>]*>([^<]+)<\/a:t>/g);
        
        if (textMatches) {
          const extractedText = textMatches
            .map(match => match.replace(/<[^>]+>/g, ''))
            .join(' ');
          resolve(extractedText);
        } else {
          // Fallback: try to extract any readable text
          const cleanText = content
            .replace(/<[^>]+>/g, ' ')
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleanText.length > 50) {
            resolve(cleanText);
          } else {
            reject(new Error('No readable text found in PowerPoint file'));
          }
        }
      } catch (error) {
        reject(new Error(`Failed to process PowerPoint file: ${error}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PowerPoint file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Determines file type from file extension
 */
function getFileType(fileName: string): string {
  const extension = fileName.toLowerCase().split('.').pop();
  switch (extension) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
      return 'Word Document';
    case 'ppt':
    case 'pptx':
      return 'PowerPoint';
    case 'txt':
      return 'Text File';
    default:
      return 'Unknown';
  }
}

/**
 * Validates if file type is supported
 */
export function isSupportedFileType(file: File): boolean {
  const supportedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'];
  const extension = file.name.toLowerCase().split('.').pop();
  return supportedExtensions.includes(extension || '');
}

/**
 * Main function to process uploaded files
 */
export async function processFile(file: File): Promise<FileProcessingResult> {
  if (!isSupportedFileType(file)) {
    throw new Error(`Unsupported file type. Please upload PDF, Word, PowerPoint, or text files.`);
  }

  const fileType = getFileType(file.name);
  const extension = file.name.toLowerCase().split('.').pop();

  try {
    let extractedText = '';

    switch (extension) {
      case 'txt':
        extractedText = await processTextFile(file);
        break;
      case 'pdf':
        extractedText = await processPdfFile(file);
        break;
      case 'doc':
      case 'docx':
        extractedText = await processWordFile(file);
        break;
      case 'ppt':
      case 'pptx':
        extractedText = await processPowerPointFile(file);
        break;
      default:
        throw new Error(`Unsupported file extension: ${extension}`);
    }

    // Clean up the extracted text
    const cleanText = extractedText
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      throw new Error('No text content found in the file');
    }

    const wordCount = countWords(cleanText);
    const characterCount = cleanText.length;

    return {
      text: cleanText,
      wordCount,
      characterCount,
      fileName: file.name,
      fileType
    };
  } catch (error) {
    throw new Error(`Failed to process ${fileType}: ${error}`);
  }
}