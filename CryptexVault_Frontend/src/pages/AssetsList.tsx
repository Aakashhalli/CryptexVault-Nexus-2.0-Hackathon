import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Search, Shield, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import AssetCard, { AssetType } from "@/components/AssetCard";

// Helper function to convert buffer data to blob URL
const bufferToBlobUrl = (bufferData, mimeType) => {
  if (!bufferData || !bufferData.data) return "";
  const byteArray = new Uint8Array(bufferData.data);
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob);
};

// Helper function to determine MIME type from filename
const getMimeType = (filename) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return `image/${ext === "jpg" ? "jpeg" : ext}`;
    case "pdf":
      return "application/pdf";
    case "mp3":
    case "wav":
      return `audio/${ext}`;
    default:
      return "application/octet-stream";
  }
};

// Helper function to determine asset type from MIME type
const inferAssetType = (mimeType) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("audio/")) return "audio";
  return "image"; // default fallback
};

// AssetsList component
const AssetsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const ethereumAddress = accounts[0];

          const response = await axios.get("http://localhost:3000/files", {
            headers: {
              "ethereum-address": ethereumAddress,
            },
          });

          console.log("Fetched Assets:", response.data);

          // Process assets to add preview URLs and determine asset types
          const processedAssets = response.data.map((asset) => {
            const mimeType = getMimeType(asset.filename);
            const assetType = inferAssetType(mimeType);
            const previewUrl = bufferToBlobUrl(asset.data, mimeType);

            return {
              ...asset,
              name: asset.filename, // Use filename as the name
              type: assetType,
              previewUrl,
            };
          });

          setAssets(processedAssets);
          setLoading(false);
        } else {
          console.error("MetaMask not detected.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
        setLoading(false);
      }
    };

    fetchAssets();

    // Clean up blob URLs when component unmounts
    return () => {
      assets.forEach((asset) => {
        if (asset.previewUrl && asset.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(asset.previewUrl);
        }
      });
    };
  }, []);

  // Filter assets based on search query and type filter
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.hash?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterType === "all" || asset.type === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [assets, searchQuery, filterType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-crypto-darker">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <p>Loading assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crypto-darker">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Your Protected Assets</span>
            </h1>
            <p className="text-gray-400 max-w-2xl">
              All your digital creations secured on the blockchain with Cryptex
              Vault
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-crypto-dark/50 pl-10 pr-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-crypto-purple w-full glass-card"
              />
            </div>

            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-crypto-dark/50 pl-9 pr-4 py-2 rounded-r-lg border-l border-gray-700 focus:outline-none focus:ring-1 focus:ring-crypto-purple appearance-none glass-card"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                {/* <option value="pdf">PDFs</option> */}
                <option value="audio">Audio</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                type={asset.type}
                name={asset.name}
                hash={asset.hash}
                createdAt={asset.createdAt}
                previewUrl={asset.previewUrl}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="bg-crypto-purple/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-crypto-purple" />
            </div>
            <h3 className="text-xl font-medium mb-2">No assets found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterType !== "all"
                ? "No assets match your search criteria. Try adjusting your filters."
                : "You haven't protected any assets yet. Upload your first asset to get started."}
            </p>
            <button
              onClick={() => (window.location.href = "/upload")}
              className="crypto-button mx-auto"
            >
              Upload Your First Asset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsList;
