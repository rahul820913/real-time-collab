import React, { useEffect, useState } from "react";
import { Mail, Github, Save, Edit2 } from "lucide-react";
import Navbar from "../components/helper/Navbar";
import Footer from "../components/helper/Footer";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, refreshUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    github: "",
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.result.fullName || "",
        email: user.result.email || "",
        bio: user.result.bio || "",
        avatar: user.result.avatar || "https://i.pravatar.cc/150", // ✅ Fixed: user.result.avatar
        github: user.result.github || "",
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle Edit/Save and Update Backend
  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      await updateProfile(formData);
      await refreshUser();
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      {/* ✅ Adjusted padding for mobile */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Profile Header */}
        {/* ✅ Stacked on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
          <img
            src={formData.avatar}
            alt={formData.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-sm"
          />
          {/* ✅ Centered text on mobile, left on sm+ */}
          <div className="text-center sm:text-left">
            {/* ✅ Responsive font size */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              {formData.name}
            </h1>
            {/* ✅ Centered email on mobile */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500">
              <Mail className="w-4 h-4" />
              <span>{formData.email}</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        {/* ✅ Adjusted padding for mobile */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
          {/* ✅ Stacked on mobile, row on sm+ */}
          <div className="mb-8 flex  sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              {/* ✅ Responsive font size */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                Profile
              </h2>
              <p className="text-gray-500">Control your public info</p>
            </div>

            <button
              onClick={handleSave}
              // ✅ Added w-full sm:w-auto to make button full-width when stacked
              className={` sm:w-auto px-5 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors ${
                isEditing
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" /> Save
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" /> Edit
                </>
              )}
            </button>
          </div>

          {/* ✅ This grid was already responsive! */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Display name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  } focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-slate-900`}
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Photo URL
                </label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  } focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-slate-900`}
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg ${
                    !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  } focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-slate-900 resize-none`}
                />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  GitHub
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="username"
                    className={`flex-1 px-4 py-2.5 border border-gray-300 rounded-lg ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                    } focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-slate-900`}
                  />
                  <a
                    href={`https://github.com/${formData.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 border border-gray-300 bg-white text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;