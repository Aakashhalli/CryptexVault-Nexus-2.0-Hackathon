import React, { useState } from "react";
import {
  File,
  FileImage,
  FileText,
  Music,
  Shield,
  AlertCircle,
  Check,
  X,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FileUploadCard, { FileType } from "@/components/FileUploadCard";
import { toast } from "@/hooks/use-toast";

const Verify = () => {
  const [selectedType, setSelectedType] = useState<FileType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<
    "authentic" | "modified" | "notfound" | null
  >(null);
  const [assetDetails, setAssetDetails] = useState<any>(null);

  // Reset state when changing file type
  React.useEffect(() => {
    setSelectedFile(null);
    setVerificationResult(null);
    setAssetDetails(null);
  }, [selectedType]);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    // Reset verification
    setVerificationResult(null);
    setAssetDetails(null);
  };

  const handleVerify = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to verify.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      if (!window.ethereum) {
        toast({
          title: "MetaMask not detected",
          description: "Please install MetaMask to verify file ownership.",
          variant: "destructive",
        });
        setIsVerifying(false);
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const owner = accounts[0];
      formData.append("owner", owner);

      const response = await fetch("http://localhost:3000/verify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(response);
      if (response.ok) {
        // Backend returns success message or ownership info
        toast({
          title: "Verification Complete",
          description: data.message,
        });

        if (data.message.includes("verified successfully")) {
          setVerificationResult("authentic");
          setAssetDetails({
            owner,
            registeredOn: new Date().toLocaleString(), // You can adjust if backend returns a date
            lastVerified: new Date().toLocaleString(),
            hash: data.hash, // Optionally set if backend returns hash
          });
        } else if (data.message.includes("copyrighted to")) {
          setVerificationResult("authentic");
          setAssetDetails({
            owner: data.owner,
            registeredOn: new Date().toLocaleString(), // You can adjust if backend returns a date
            lastVerified: new Date().toLocaleString(),
            hash: data.hash, // Optionally set if backend returns hash
          });
        }
      } else if (response.status === 404) {
        setVerificationResult("notfound");
        toast({
          title: "Verification Complete",
          description: "No matching file found on the blockchain.",
          variant: "destructive",
        });
        setIsVerifying(false);
      } else {
        // Handle other errors returned by backend
        toast({
          title: "Verification failed",
          description: data.error || "There was an error verifying your file.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying file:", error);
      toast({
        title: "Verification failed",
        description:
          "There was an error verifying your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const fileTypes: { type: FileType; name: string; icon: React.ReactNode }[] = [
    { type: "image", name: "Images", icon: <FileImage className="h-5 w-5" /> },
    { type: "audio", name: "Audio", icon: <Music className="h-5 w-5" /> },
  ];
  // const fileTypes: { type: FileType; name: string; icon: React.ReactNode }[] = [
  //   { type: 'image', name: 'Images', icon: <FileImage className="h-5 w-5" /> },
  //   { type: 'pdf', name: 'PDF', icon: <FileText className="h-5 w-5" /> },
  //   { type: 'audio', name: 'Audio', icon: <Music className="h-5 w-5" /> },
  // ];

  return (
    <div className="min-h-screen bg-crypto-darker">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Verify</span> Digital Assets
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Check if a digital asset is authentic and registered on the
            blockchain. Detect unauthorized modifications and verify ownership.
          </p>
        </div>

        {verificationResult ? (
          // Verification results
          <div className="max-w-2xl mx-auto glass-card rounded-xl p-8 animate-fade-in">
            <div className="flex flex-col items-center text-center mb-8">
              {verificationResult === "authentic" ? (
                <div className="bg-green-500/20 p-4 rounded-full mb-4">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
              ) : verificationResult === "modified" ? (
                <div className="bg-yellow-500/20 p-4 rounded-full mb-4">
                  <AlertCircle className="h-10 w-10 text-yellow-500" />
                </div>
              ) : (
                <div className="bg-red-500/20 p-4 rounded-full mb-4">
                  <X className="h-10 w-10 text-red-500" />
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2">
                {verificationResult === "authentic"
                  ? "Authentic Asset"
                  : verificationResult === "modified"
                  ? "Modified Asset Detected"
                  : "Asset Not Found"}
              </h2>

              <p className="text-gray-400">
                {verificationResult === "authentic"
                  ? "This digital asset is authentic and registered on the blockchain."
                  : verificationResult === "modified"
                  ? "This asset appears to be modified from the original registered version."
                  : "No matching asset was found on the blockchain."}
              </p>
            </div>

            {verificationResult === "authentic" && assetDetails && (
              <div className="glass-card bg-crypto-dark/50 rounded-lg p-5 my-6">
                <h3 className="text-lg font-medium mb-4">Asset Details</h3>
                {/* Use a grid with two columns for labels and values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Owner */}
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Owner</p>
                    <p className="font-medium break-words">
                      {assetDetails.owner}
                    </p>
                  </div>

                  {/* Registered On */}
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Registered On</p>
                    <p className="font-medium">{assetDetails.registeredOn}</p>
                  </div>

                  {/* Last Verified */}
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Last Verified</p>
                    <p className="font-medium">{assetDetails.lastVerified}</p>
                  </div>

                  {/* Hash */}
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Hash</p>
                    <p className="font-mono text-sm break-words">
                      {assetDetails.hash}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {verificationResult === "modified" && (
              <div className="glass-card bg-crypto-dark/50 rounded-lg p-5 my-6">
                <h3 className="text-lg font-medium mb-3">
                  Potential Modifications
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  The cryptographic hash of this file does not match the
                  original registered version. This could indicate:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
                  <li>The file has been edited or altered</li>
                  <li>Image data has been manipulated</li>
                  <li>Metadata has been changed</li>
                  <li>The file is a deepfake or AI-generated variant</li>
                </ul>
              </div>
            )}

            {verificationResult === "notfound" && (
              <div className="glass-card bg-crypto-dark/50 rounded-lg p-5 my-6">
                <h3 className="text-lg font-medium mb-3">
                  File Not Registered
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  This file does not match any registered assets on the
                  blockchain. This could indicate:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
                  <li>The file has never been registered on the blockchain</li>
                  <li>The file may be an entirely new creation</li>
                  <li>
                    The file has been significantly altered from any registered
                    version
                  </li>
                  <li>The hash verification process encountered an issue</li>
                </ul>
                <p className="text-sm text-gray-400 mt-3">
                  If you believe this is your original work, consider
                  registering it to establish ownership and protect your
                  intellectual property.
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  setVerificationResult(null);
                  setSelectedFile(null);
                }}
                className="crypto-button"
              >
                Verify Another Asset
              </button>
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
                      Verify {fileType.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Check if this {fileType.type} is authentic and registered
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
                    onClick={handleVerify}
                    disabled={!selectedFile || isVerifying}
                    className={`crypto-button ${
                      !selectedFile || isVerifying
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verifying asset...
                      </>
                    ) : (
                      "Verify on Blockchain"
                    )}
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center text-sm text-gray-400">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>
                    We never store the files you upload for verification
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
