import React, { useState, useEffect } from "react";
import { File, Fingerprint, Shield, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FileUploadCard, { FileType } from "@/components/FileUploadCard";
import { toast } from "@/hooks/use-toast";
import { Navigate, useNavigate } from "react-router-dom";

const Upload = () => {
  const [selectedType, setSelectedType] = useState<FileType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetHash, setAssetHash] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const Navigate = useNavigate();

  // Reset state when changing file type
  useEffect(() => {
    setSelectedFile(null);
    setAssetHash(null);
    setShowResults(false);
  }, [selectedType]);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    // Reset upload results
    setAssetHash(null);
    setShowResults(false);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get wallet address from MetaMask
      if (!window.ethereum) {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to continue.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const ownerAddress = accounts[0];

      if (!ownerAddress) {
        toast({
          title: "Wallet not connected",
          description: "Unable to get wallet address from MetaMask.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("owner", ownerAddress);

      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setAssetHash(data.hash || "");
        setShowResults(true);

        toast({
          title: "Asset uploaded successfully",
          description:
            data.message || "Your file has been secured on the blockchain",
        });
      } else {
        toast({
          title: "Upload failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "Unexpected error occurred while uploading.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const fileTypes: { type: FileType; name: string; icon: React.ReactNode }[] = [
  //   { type: 'image', name: 'Images', icon: <File className="h-5 w-5" /> },
  //   { type: 'pdf', name: 'PDF', icon: <File className="h-5 w-5" /> },
  //   { type: 'audio', name: 'Audio', icon: <File className="h-5 w-5" /> },
  // ];
  const fileTypes: { type: FileType; name: string; icon: React.ReactNode }[] = [
    { type: "image", name: "Images", icon: <File className="h-5 w-5" /> },
    { type: "audio", name: "Audio", icon: <File className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-crypto-darker">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Secure </span>Your Digital Assets
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload your files to establish proof of ownership on the blockchain.
            Your assets will be timestamped and secured with unbreakable
            cryptographic protection.
          </p>
        </div>

        {showResults ? (
          // Results view
          <div className="animate-fade-in">
            <div className="max-w-2xl mx-auto glass-card rounded-xl p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-green-500/20 p-4 rounded-full mb-4">
                  <Shield className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Asset Secured Successfully
                </h2>
                <p className="text-gray-400">
                  Your asset has been secured on the blockchain with a unique
                  digital fingerprint.
                </p>
              </div>

              <div className="space-y-6">
                <div className="glass-card bg-crypto-dark/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">
                    Asset Hash (Unique Identifier)
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-crypto-purple font-mono text-sm truncate">
                      {assetHash}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(assetHash || "");
                        toast({ title: "Hash copied to clipboard" });
                      }}
                      className="text-xs px-2 py-1 bg-crypto-purple/20 rounded hover:bg-crypto-purple/30 text-crypto-purple transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Fingerprint className="h-5 w-5 text-crypto-purple mr-3" />
                    <div>
                      <p className="font-medium">Tamper-proof Verification</p>
                      <p className="text-sm text-gray-400">
                        Any changes to the original will be detectable
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-crypto-purple mr-3" />
                    <div>
                      <p className="font-medium">Copyright Protection</p>
                      <p className="text-sm text-gray-400">
                        Immutable proof of ownership established
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowResults(false)}
                  className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Upload Another Asset
                </button>
                <button
                  onClick={() => Navigate("/assets")}
                  className="crypto-button"
                >
                  View Asset Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* File type selection */}
            {!selectedType ? (
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {fileTypes.map((fileType) => (
                  <button
                    key={fileType.type}
                    onClick={() => setSelectedType(fileType.type)}
                    className="glass-card hover:border-crypto-purple/50 rounded-xl p-8 py-16 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="bg-crypto-purple/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      {fileType.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      {fileType.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Secure your {fileType.name.toLowerCase()} with blockchain
                      protection
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <button
                    onClick={() => setSelectedType(null)}
                    className="text-crypto-purple hover:underline flex items-center"
                  >
                    ← Back to file types
                  </button>
                </div>

                <FileUploadCard
                  type={selectedType}
                  onFileSelected={handleFileSelected}
                />

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedFile || isSubmitting}
                    className={`crypto-button ${
                      !selectedFile || isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Securing your asset...
                      </>
                    ) : (
                      "Secure on Blockchain"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Upload;
