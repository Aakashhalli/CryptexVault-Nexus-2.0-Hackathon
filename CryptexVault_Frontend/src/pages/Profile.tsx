import { toast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Wallet,
  Calendar,
  Clock,
  Edit2,
  Save,
  X,
  Activity,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileData {
  name: string;
  email: string;
  memberSince: string;
  walletAddress: string;
  assetsOwned: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    memberSince: new Date().toLocaleDateString(),
    walletAddress:
      window.ethereum?.selectedAddress ||
      "0x0000000000000000000000000000000000000000",
    assetsOwned: 0,
  });

  useEffect(() => {
    const fetchProfileAndAssets = async () => {
      if (!window.ethereum) return;

      try {
        // Get current Ethereum address from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletAddress = accounts[0];

        // Fetch user profile (name, email etc.) - assuming you have this API
        const profileRes = await fetch(
          `http://localhost:3000/api/users/${walletAddress}`
        );
        let profile = {};
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          profile = {
            name: profileData.user.name,
            email: profileData.user.email,
            memberSince:
              profileData.user.memberSince || new Date().toLocaleDateString(),
            walletAddress,
          };
        }

        // Fetch files owned by the user
        const filesRes = await fetch("http://localhost:3000/files", {
          headers: {
            "ethereum-address": walletAddress,
          },
        });

        let assetsOwned = 0;
        if (filesRes.ok) {
          const files = await filesRes.json();
          assetsOwned = Array.isArray(files) ? files.length : 0;
        }

        // Update profile data state with assets count and profile info
        setProfileData((prev) => ({
          ...prev,
          ...profile,
          assetsOwned,
        }));
      } catch (error) {
        console.error("Error fetching profile or assets:", error);
      }
    };

    fetchProfileAndAssets();
  }, []);

  const [formData, setFormData] = useState({ ...profileData });

  const [recentActivity, setRecentActivity] = useState([
    // initial mock data or empty array
  ]);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!window.ethereum) return;

      try {
        // Get connected Ethereum address
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletAddress = accounts[0];

        // Fetch recent activity from backend
        const response = await fetch(
          `http://localhost:3000/api/activity/${walletAddress}`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch recent activity");
        }

        const data = await response.json();

        // Assuming data is an array of activity objects
        setRecentActivity(data.activities || []);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        setRecentActivity([]); // Clear previous on error
      }
    };

    fetchRecentActivity();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditToggle = async () => {
    if (editing) {
      try {
        if (!window.ethereum) {
          toast({
            title: "MetaMask not detected",
            description: "Please install MetaMask to update your profile.",
            variant: "destructive",
          });
          return;
        }

        // Request connected accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const ethereumAddress = accounts[0];

        // Send update request to backend
        const response = await fetch(
          `http://localhost:3000/api/users/${ethereumAddress}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // fetched from MetaMask
              email: formData.email, // from form input
              username: formData.name, // from form input
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update profile");
        }

        const updatedData = await response.json();

        // Update local profile data with response from backend
        setProfileData((prev) => ({
          ...prev,
          name: updatedData.user.name,
          email: updatedData.user.email,
        }));
        toast({ title: "Profile updated successfully" });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({ title: "Failed to update profile", variant: "destructive" });
      }
    }

    setEditing(!editing);
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-crypto-darker">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient">Your</span> Profile
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Manage your personal information and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="md:col-span-1">
            <div className="glass-card rounded-xl p-6 mb-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-24 h-24 mb-4 border-2 border-crypto-purple">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-crypto-purple/20 text-white text-xl">
                    {profileData.name
                      ? profileData.name.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>

                {editing ? (
                  <div className="w-full space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full bg-crypto-dark/50 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-crypto-purple"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full bg-crypto-dark/50 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-crypto-purple"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">
                      {profileData.name || "Unnamed Creator"}
                    </h2>
                    <p className="text-gray-400">
                      {profileData.email || "No email added"}
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-crypto-dark/60 rounded-lg">
                  <Wallet size={18} className="text-crypto-purple mr-3" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm text-gray-400">Wallet Address</p>
                    <p className="text-sm truncate">
                      {profileData.walletAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-crypto-dark/60 rounded-lg">
                  <Calendar size={18} className="text-crypto-purple mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-sm">
                      {new Date(profileData.memberSince).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-crypto-dark/60 rounded-lg">
                  <FileCheck size={18} className="text-crypto-purple mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Assets Owned</p>
                    <p className="text-sm">{profileData.assetsOwned}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                {editing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEditToggle}
                      className="crypto-button bg-green-600 hover:bg-green-700"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="crypto-button bg-gray-600 hover:bg-gray-700"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEditToggle} className="crypto-button">
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="font-medium mb-4 flex items-center">
                <Activity size={18} className="text-crypto-purple mr-2" />
                Quick Actions
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => navigate("/upload")}
                  className="w-full text-left p-3 bg-crypto-dark/60 rounded-lg hover:bg-crypto-dark transition-colors"
                >
                  Upload New Asset
                </button>
                <button
                  onClick={() => navigate("/verify")}
                  className="w-full text-left p-3 bg-crypto-dark/60 rounded-lg hover:bg-crypto-dark transition-colors"
                >
                  Verify an Asset
                </button>
                <button
                  onClick={() => navigate("/assets")}
                  className="w-full text-left p-3 bg-crypto-dark/60 rounded-lg hover:bg-crypto-dark transition-colors"
                >
                  View My Assets
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="md:col-span-2">
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Activity size={20} className="text-crypto-purple mr-2" />
                Recent Activity
              </h3>

              <div className="space-y-4 max-h-[calc(11*4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-crypto-dark scrollbar-track-crypto-dark/60">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 bg-crypto-dark/60 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {activity.type === "upload" && (
                          <Upload size={16} className="text-green-400 mr-2" />
                        )}
                        {activity.type === "verify" && (
                          <CheckCircle
                            size={16}
                            className="text-blue-400 mr-2"
                          />
                        )}
                        {activity.type === "transfer" && (
                          <ArrowRightLeft
                            size={16}
                            className="text-yellow-400 mr-2"
                          />
                        )}
                        <span className="font-medium capitalize">
                          {activity.type}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {new Date(activity.date).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    <p className="text-sm mb-1">
                      <span className="text-gray-400">Asset: </span>
                      <span>{activity.asset}</span>
                    </p>

                    {activity.type === "transfer" && (
                      <p className="text-sm">
                        <span className="text-gray-400">Transferred to: </span>
                        <span className="text-crypto-purple">
                          {activity.to}
                        </span>
                      </p>
                    )}

                    <div className="mt-2 flex justify-end">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          activity.status === "success"
                            ? "bg-green-400/20 text-green-400"
                            : activity.status === "pending"
                            ? "bg-yellow-400/20 text-yellow-400"
                            : "bg-red-400/20 text-red-400"
                        }`}
                      >
                        {activity.status === "success"
                          ? "Successful"
                          : activity.status === "pending"
                          ? "Pending"
                          : "Failed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <Activity size={40} className="text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No activity yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your recent actions will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// Import the icons used in this component
import { FileCheck, CheckCircle, Upload, ArrowRightLeft } from "lucide-react";
