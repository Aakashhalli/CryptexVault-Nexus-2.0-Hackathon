import React from "react";
import { File, FileImage, FileText, Music, Calendar, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export type AssetType = "image" | "pdf" | "audio";

interface AssetCardProps {
  type: AssetType;
  name: string;
  hash: string;
  createdAt: string;
  previewUrl?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({
  type,
  name,
  hash,
  createdAt,
  previewUrl,
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case "image":
        return <FileImage className="w-6 h-6 text-crypto-purple" />;
      case "pdf":
        return <FileText className="w-6 h-6 text-crypto-purple" />;
      case "audio":
        return <Music className="w-6 h-6 text-crypto-purple" />;
      default:
        return <File className="w-6 h-6 text-crypto-purple" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-crypto-dark">
      {/* Preview */}
      {type === "image" && previewUrl && (
        <div className="w-full h-48 bg-crypto-darker">
          <img
            src={previewUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {type === "pdf" && previewUrl && (
        <div className="w-full h-48 bg-crypto-darker">
          <iframe
            src={previewUrl}
            title={name}
            className="w-full h-full border-0"
          />
        </div>
      )}
      {type === "audio" && previewUrl && (
        <div className="w-full py-4 px-3 bg-crypto-darker flex items-center justify-center">
          <audio controls className="w-full">
            <source src={previewUrl} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center mb-3">
          <div className="p-2 bg-crypto-purple/10 rounded-md mr-3">
            {getTypeIcon()}
          </div>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-xs text-gray-400 mt-1 capitalize">
              {type} Asset
            </p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-start text-sm">
            <div className="w-24 text-gray-400">Asset Hash:</div>
            <div className="flex items-center">
              <span className="font-mono text-crypto-accent break-all">
                {hash}
              </span>
              <button
                onClick={() => copyToClipboard(hash)}
                className="ml-2 text-gray-400 hover:text-crypto-purple transition-colors flex-shrink-0"
                aria-label="Copy asset hash"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center text-sm">
            <div className="w-24 text-gray-400">Created At:</div>
            <div className="flex items-center">
              <Calendar
                size={14}
                className="text-crypto-purple mr-1 flex-shrink-0"
              />
              <span className="text-white">{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Verify button */}
      <div className="p-5 pt-4 border-t text-crypto-purple border-gray-700 flex justify-end">
        <ShieldCheck className="mr-2 h-6 w-6" />
        <Link to="/verify">Verify</Link>
      </div>
    </div>
  );
};

export default AssetCard;
