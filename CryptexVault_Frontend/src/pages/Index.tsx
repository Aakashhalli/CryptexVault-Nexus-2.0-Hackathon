import React, { useState, useEffect } from "react";
import MetaMaskButton from "@/components/MetaMaskButton";
import { LockKeyhole, Shield, FileCheck } from "lucide-react";

const Index = () => {
  const [showTitle, setShowTitle] = useState(true);
  const [showConnect, setShowConnect] = useState(false);

  useEffect(() => {
    // Trigger animations with timers
    const titleTimer = setTimeout(() => {
      setShowTitle(false);

      // Show connect after title fades out
      const connectTimer = setTimeout(() => {
        setShowConnect(true);
      }, 500);

      return () => clearTimeout(connectTimer);
    }, 3000); // Show title for 3 seconds

    return () => clearTimeout(titleTimer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-crypto-darker relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute w-full h-full">
        <div className="absolute top-[10%] left-[15%] w-36 h-36 rounded-full bg-crypto-purple/10 blur-3xl animate-pulse-light"></div>
        <div className="absolute top-[40%] right-[20%] w-64 h-64 rounded-full bg-crypto-blue/10 blur-3xl animate-pulse-light animation-delay-600"></div>
        <div className="absolute bottom-[20%] left-[30%] w-48 h-48 rounded-full bg-crypto-purple/10 blur-3xl animate-pulse-light animation-delay-300"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyek0zMCAzNGgtMnYtNGgydjR6TTI0IDM0aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

      {/* Blockchain nodes decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-crypto-purple rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-crypto-blue rounded-full animate-pulse animation-delay-300"></div>
        <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-crypto-accent rounded-full animate-pulse animation-delay-600"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-crypto-purple rounded-full animate-pulse animation-delay-900"></div>
        <div className="absolute top-1/5 right-1/3 w-2 h-2 bg-crypto-blue rounded-full animate-pulse"></div>

        {/* Connection lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="25%"
            y1="25%"
            x2="20%"
            y2="33%"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          <line
            x1="20%"
            y1="33%"
            x2="33%"
            y2="67%"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          <line
            x1="33%"
            y1="67%"
            x2="75%"
            y2="50%"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          <line
            x1="75%"
            y1="50%"
            x2="67%"
            y2="20%"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          <line
            x1="67%"
            y1="20%"
            x2="25%"
            y2="25%"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="container relative z-10 flex flex-col items-center justify-center p-4 text-center">
        {/* Title animation */}
        <div
          className={`transition-opacity duration-500 ${
            showTitle ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            <div className="reveal-text overflow-hidden">
              <span className=" text-gradient inline-block reveal-delay-1">
                Cryptex
              </span>{" "}
              <span className=" text-gradient inline-block reveal-delay-2">
                Vault{" "}
              </span>
            </div>
            <div className="reveal-text mt-2 ml-4">
              <span className=" inline-block reveal-delay-3"> - Own</span>{" "}
              <span className="inline-block reveal-delay-4">What's</span>{" "}
              <span className="inline-block reveal-delay-5">Yours</span>
            </div>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in  animate-delay-600">
            Secure your digital creations with unbreakable blockchain protection
          </p>
        </div>

        {/* Connect section */}
        <div
          className={`mt-12 transition-all duration-500 ${
            showConnect
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="glass-card p-8 rounded-xl max-w-md mx-auto relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-crypto-purple/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-crypto-darker p-4 rounded-full border border-crypto-purple/30">
                <LockKeyhole size={40} className="text-crypto-purple" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-4 mb-6 text-gradient">
              Connect to continue
            </h2>
            <p className="text-gray-300 mb-8">
              Connect your MetaMask wallet to access the Cryptex Vault platform
              and protect your digital assets.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center p-3 bg-crypto-dark/60 rounded-lg">
                <Shield size={20} className="text-crypto-purple mr-3" />
                <span className="text-sm">
                  Secure blockchain-powered protection
                </span>
              </div>
              <div className="flex items-center p-3 bg-crypto-dark/60 rounded-lg">
                <FileCheck size={20} className="text-crypto-purple mr-3" />
                <span className="text-sm">
                  Tamper-proof copyright verification
                </span>
              </div>
            </div>

            <MetaMaskButton animated={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
