
import React, { useState } from 'react';
import { Upload, FileImage, FileText, Music, AlertCircle, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export type FileType = 'image' | 'pdf' | 'audio';

interface FileUploadCardProps {
  type: FileType;
  onFileSelected: (file: File) => void;
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({ type, onFileSelected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const getFileTypeConfig = () => {
    switch (type) {
      case 'image':
        return {
          icon: <FileImage size={48} className="text-crypto-purple" />,
          title: 'Upload Image',
          description: 'Protect your images, photos and visual creations',
          acceptTypes: 'image/*',
          maxSize: 10 // MB
        };
      case 'pdf':
        return {
          icon: <FileText size={48} className="text-crypto-purple" />,
          title: 'Upload PDF',
          description: 'Secure your documents, articles and written works',
          acceptTypes: '.pdf',
          maxSize: 20 // MB
        };
      case 'audio':
        return {
          icon: <Music size={48} className="text-crypto-purple" />,
          title: 'Upload Audio',
          description: 'Copyright your music, podcasts and audio content',
          acceptTypes: 'audio/*',
          maxSize: 30 // MB
        };
    }
  };
  
  const config = getFileTypeConfig();
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Check file type
    const fileTypeMatch = type === 'pdf' 
      ? file.name.toLowerCase().endsWith('.pdf')
      : file.type.startsWith(type);
      
    if (!fileTypeMatch) {
      toast({
        title: "Invalid file type",
        description: `Please upload a ${type} file.`,
        variant: "destructive"
      });
      return;
    }
    
    // Check file size
    const fileSize = file.size / (1024 * 1024); // convert to MB
    if (fileSize > config.maxSize) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${config.maxSize}MB.`,
        variant: "destructive"
      });
      return;
    }
    
    // Set selected file and notify parent
    setSelectedFile(file);
    onFileSelected(file);
    toast({
      title: "File selected",
      description: `${file.name} has been selected for upload.`,
    });
  };
  
  const resetSelection = () => {
    setSelectedFile(null);
  };
  
  return (
    <div className={`glass-card rounded-xl p-6 transition-all duration-300 ${dragActive ? 'border-crypto-purple border-2' : 'border'}`}>
      {selectedFile ? (
        <div className="flex flex-col items-center py-4">
          <div className="bg-crypto-purple/20 rounded-full p-3 mb-4">
            <Check size={36} className="text-crypto-purple" />
          </div>
          <h3 className="text-xl font-semibold mb-2">File Selected</h3>
          <p className="text-gray-400 text-center mb-3">{selectedFile.name}</p>
          <p className="text-gray-400 text-center text-sm mb-6">
            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <button
            onClick={resetSelection}
            className="text-crypto-purple hover:text-crypto-accent underline text-sm"
          >
            Select a different file
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center py-8"
          onDragEnter={handleDrag}
        >
          <div className="bg-crypto-purple/20 rounded-full p-4 mb-4">
            {config.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{config.title}</h3>
          <p className="text-gray-400 text-center mb-6">{config.description}</p>
          
          <div className="w-full">
            <label 
              className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-500 hover:border-crypto-purple rounded-lg py-8 px-4 cursor-pointer transition-colors ${dragActive ? 'border-crypto-purple bg-crypto-purple/5' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-crypto-accent">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {`Max file size: ${config.maxSize}MB`}
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept={config.acceptTypes}
                onChange={handleFileChange}
              />
            </label>
          </div>
          
          <div className="flex items-center mt-6 text-sm text-gray-400">
            <AlertCircle size={14} className="mr-2" />
            <span>Your file will be securely stored on the blockchain</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadCard;
