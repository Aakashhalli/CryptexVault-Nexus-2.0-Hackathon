
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MetaMaskButtonProps {
  onConnect?: (accounts: string[]) => void;
  animated?: boolean;
}

const MetaMaskButton: React.FC<MetaMaskButtonProps> = ({ onConnect, animated = false }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    setIsConnecting(true);
    
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Call the onConnect callback if provided
        if (onConnect) {
          onConnect(accounts);
        }
        
        // Success message
        toast({
          title: "Successfully connected!",
          description: `Connected to account: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
        
        // Redirect to home page
        navigate('/home');
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to MetaMask. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // MetaMask not installed
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask extension to continue",
        variant: "destructive",
      });
      
      // Open MetaMask download page
      window.open('https://metamask.io/download/', '_blank');
    }
    
    setIsConnecting(false);
  };

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className={`crypto-button group ${animated ? 'animate-glow' : ''}`}
    >
      <Wallet size={20} className="mr-2" />
      <span>{isConnecting ? 'Connecting...' : 'Connect to MetaMask'}</span>
      <span className="absolute right-0 top-0 h-full w-10 translate-x-0 transform transition-transform duration-300 ease-in-out group-hover:translate-x-full">
        <span className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30 transition-transform duration-1000 group-hover:translate-x-full"></span>
      </span>
    </button>
  );
};

// Add window.ethereum type
declare global {
  interface Window {
    ethereum: any;
  }
}

export default MetaMaskButton;
