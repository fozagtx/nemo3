import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Upload, 
  FileText, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileImage,
  FileSpreadsheet
} from 'lucide-react';
import { processFile, isSupportedFileType, FileProcessingResult } from '../lib/file-processor';
import { toast } from 'sonner';

interface FileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
  disabled?: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: FileProcessingResult;
  error?: string;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.toLowerCase().split('.').pop();
  switch (extension) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-500" />;
    case 'doc':
    case 'docx':
      return <File className="w-5 h-5 text-blue-500" />;
    case 'ppt':
    case 'pptx':
      return <FileSpreadsheet className="w-5 h-5 text-orange-500" />;
    case 'txt':
      return <FileText className="w-5 h-5 text-gray-500" />;
    default:
      return <File className="w-5 h-5 text-gray-400" />;
  }
};

export default function FileUpload({ onTextExtracted, disabled }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const processUploadedFile = async (file: File, fileId: string) => {
    try {
      // Update status to processing
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'processing', progress: 50 }
            : f
        )
      );

      const result = await processFile(file);

      // Update with completed result
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'completed', progress: 100, result }
            : f
        )
      );

      toast.success(`Successfully extracted text from ${file.name}`);
      
      // Call the callback with extracted text
      onTextExtracted(result.text, result.fileName);

    } catch (error: any) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error', progress: 0, error: error.message }
            : f
        )
      );
      
      toast.error(`Failed to process ${file.name}: ${error.message}`);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return;

    const validFiles = acceptedFiles.filter(file => {
      if (!isSupportedFileType(file)) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Add files to state
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 25
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (const uploadedFile of newFiles) {
      await processUploadedFile(uploadedFile.file, uploadedFile.id);
    }
  }, [disabled, onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt']
    },
    multiple: true,
    disabled
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const useExtractedText = (result: FileProcessingResult) => {
    onTextExtracted(result.text, result.fileName);
    toast.success(`Using text from ${result.fileName}`);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="w-5 h-5 mr-2 text-yellow-400" />
            Upload Documents
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Upload PDF, Word, PowerPoint, or text files to extract content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
              ${isDragActive 
                ? 'border-yellow-400 bg-yellow-400/10' 
                : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
            {isDragActive ? (
              <p className="text-yellow-400 font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-white font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-zinc-400 text-sm">
                  Supports PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), and text files
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  Maximum file size: 10MB
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {getFileIcon(uploadedFile.file.name)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-medium truncate">
                        {uploadedFile.file.name}
                      </p>
                      {uploadedFile.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                      {uploadedFile.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-zinc-400 text-sm">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {uploadedFile.result && (
                        <>
                          <span className="text-zinc-500">•</span>
                          <Badge variant="secondary" className="text-xs">
                            {uploadedFile.result.wordCount} words
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {uploadedFile.result.characterCount} chars
                          </Badge>
                        </>
                      )}
                    </div>

                    {uploadedFile.status === 'error' && uploadedFile.error && (
                      <p className="text-red-400 text-sm mt-1">{uploadedFile.error}</p>
                    )}

                    {(uploadedFile.status === 'uploading' || uploadedFile.status === 'processing') && (
                      <div className="mt-2">
                        <Progress value={uploadedFile.progress} className="h-2" />
                        <p className="text-zinc-400 text-xs mt-1">
                          {uploadedFile.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {uploadedFile.status === 'completed' && uploadedFile.result && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => useExtractedText(uploadedFile.result!)}
                      className="border-zinc-600 text-white hover:bg-zinc-700"
                    >
                      Use Text
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}