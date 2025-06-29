import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, FileText, Loader2, ArrowRight, AlertCircle, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

const Transfer = () => {
  const [assetHash, setAssetHash] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [currentOwner, setCurrentOwner] = useState('');

  // Get current user's Ethereum address on component mount
  useEffect(() => {
    const getEthereumAddress = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setCurrentOwner(accounts[0]);
        } else {
          toast({
            title: "MetaMask not detected",
            description: "Please install MetaMask to transfer file ownership.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };

    getEthereumAddress();
  }, []);

  const validateEthereumAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!assetHash.trim()) {
      toast({
        title: "Asset hash required",
        description: "Please enter the hash of the file you want to transfer.",
        variant: "destructive"
      });
      return;
    }
    
    if (!recipientId.trim() || !validateEthereumAddress(recipientId)) {
      toast({
        title: "Valid recipient address required",
        description: "Please enter a valid Ethereum address of the recipient.",
        variant: "destructive"
      });
      return;
    }

    if (!currentOwner) {
      toast({
        title: "Not connected",
        description: "Please connect your MetaMask wallet first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsTransferring(true);
    
    try {
      const response = await axios.put(`http://localhost:3000/file/transfer/${assetHash}`, {
        currentOwner: currentOwner,
        newOwner: recipientId
      });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      // Set transaction hash if available in response, otherwise use a placeholder
      setTransactionHash(response.data.transactionHash || "Transaction completed on blockchain");
      setTransferComplete(true);
      
      toast({
        title: "Transfer Successful",
        description: "The file ownership has been transferred successfully.",
      });
    } catch (error) {
      console.error("Error transferring file:", error);
      toast({
        title: "Transfer failed",
        description: error.response?.data?.error || error.message || "There was an error transferring file ownership. Please try again.",
        variant: "destructive"
      });
      setTransferComplete(false);
    } finally {
      setIsTransferring(false);
    }
  };


  const resetForm = () => {
    setAssetHash('');
    setRecipientId('');
    setTransferComplete(false);
    setTransactionHash('');
  };

  return (
    <div className="min-h-screen bg-crypto-darker">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Transfer</span> Asset Ownership
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Securely transfer ownership of your digital assets to another user or wallet 
            while maintaining the asset's verifiable history on the blockchain.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto glass-card rounded-xl p-8">
          {transferComplete ? (
            <div className="animate-fade-in">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-green-500/20 p-4 rounded-full mb-4">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Transfer Complete</h2>
                <p className="text-gray-400">
                  The asset ownership has been successfully transferred on the blockchain.
                </p>
              </div>
              
              <div className="glass-card bg-crypto-dark/50 rounded-lg p-5 my-6 space-y-4">
                <h3 className="text-lg font-medium mb-3">Transaction Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Asset Hash</p>
                    <p className="font-mono text-sm truncate">{assetHash}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Transferred To</p>
                    <p className="font-medium">{recipientId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Transaction Hash</p>
                    <div className="flex items-center">
                      <p className="font-mono text-sm truncate">{transactionHash}</p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(transactionHash);
                          toast({ title: "Transaction hash copied to clipboard" });
                        }}
                        className="ml-2 text-xs px-2 py-1 bg-crypto-purple/20 rounded hover:bg-crypto-purple/30 text-crypto-purple transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Timestamp</p>
                    <p className="font-medium">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={resetForm}
                  className="crypto-button"
                >
                  Transfer Another Asset
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-crypto-purple/20 p-3 rounded-full">
                    <ArrowRightLeft className="h-8 w-8 text-crypto-purple" />
                  </div>
                </div>
                
                <p className="text-gray-400 text-center max-w-md mx-auto mb-8">
                  Enter the unique hash of the asset you want to transfer and the recipient's ID to securely transfer ownership.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="asset-hash" className="block text-sm font-medium text-gray-300 mb-2">
                    Asset Hash
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="asset-hash"
                      type="text"
                      value={assetHash}
                      onChange={(e) => setAssetHash(e.target.value)}
                      placeholder="Enter the hash of the asset"
                      className="glass-card bg-crypto-dark/50 pl-10 w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-crypto-purple"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    The unique identifier of the asset you want to transfer
                  </p>
                </div>
                
                <div>
                  <label htmlFor="recipient-id" className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient ID
                  </label>
                  <input
                    id="recipient-id"
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="Enter the recipient's wallet address or user ID"
                    className="glass-card bg-crypto-dark/50 w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-crypto-purple"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    The wallet address or user ID of the recipient
                  </p>
                </div>
                
                <div className="flex items-center mt-2 text-sm text-yellow-400">
                  <AlertCircle size={16} className="mr-2" />
                  <span>This transfer cannot be reversed once completed</span>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isTransferring}
                    className={`crypto-button w-full ${isTransferring ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isTransferring ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing transfer...
                      </>
                    ) : (
                      <>
                        Transfer Ownership
                        <ArrowRight className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transfer;
