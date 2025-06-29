import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Shield, FileCheck, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import BlockchainVisualization from "@/components/BlockchainVisualization";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Lock className="h-10 w-10 text-crypto-purple" />,
      title: "Secure Storage",
      description:
        "Your digital assets are securely stored on the blockchain with immutable proof of ownership.",
    },
    {
      icon: <Shield className="h-10 w-10 text-crypto-purple" />,
      title: "Deepfake Detection",
      description:
        "Advanced hash comparison technology to detect unauthorized copies and deepfakes.",
    },
    {
      icon: <FileCheck className="h-10 w-10 text-crypto-purple" />,
      title: "Copyright Protection",
      description:
        "Timestamped proof of ownership helps resolve copyright disputes and protects your revenue.",
    },
  ];

  const navigateToUpload = () => {
    navigate("/upload");
  };

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroContent = document.getElementById("hero-content");

      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-crypto-darker">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div id="hero-content" className="flex flex-col space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient">Protect</span> Your Digital
                <br />
                <span className="text-gradient">Creations</span> with
                <br />
                <span className="text-gradient">Blockchain</span>
              </h1>
              <p className="text-xl text-gray-300 mt-6 max-w-lg">
                Cryptex Vault uses blockchain technology to protect your
                creative works from unauthorized use, ensuring you maintain
                control over your intellectual property.
              </p>
              <div className="mt-8">
                <button
                  onClick={navigateToUpload}
                  className="crypto-button shine group"
                >
                  Get your copyright now
                  <ChevronRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* 3D Blockchain Visualization */}
            <div className="relative h-[500px] flex justify-center">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-crypto-purple/30 rounded-2xl blur-3xl opacity-20 animate-pulse"></div>
                <div className="glass-card p-4 rounded-xl w-full h-full">
                  <BlockchainVisualization />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-crypto-dark glass-card p-4 rounded-lg text-sm">
                  <div className="flex items-center">
                    <span className="h-3 w-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-crypto-purple font-medium">
                      Protected by Cryptex Vault
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-40 left-10 w-96 h-96 bg-crypto-blue/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-crypto-purple/5 blur-3xl rounded-full"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            <span className="text-gradient">Why </span>Choose Cryptex Vault
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg"
              >
                <div className="bg-crypto-purple/10 p-3 rounded-full w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-crypto-purple/10 to-crypto-blue/10 opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 ">What Inspired Us?</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-6xl">
                We noticed how digital creators — artists, writers, musicians —
                constantly struggle with proving they truly own their work. With
                outdated copyright systems and no easy way to verify originality
                or transfer rights, many face content theft, revenue loss, and
                frustrating legal battles. This inspired us to build a
                blockchain-based solution that offers transparent and secure
                ownership of digital content.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="crypto-button"
              >
                Get Started
                <ChevronRight className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
