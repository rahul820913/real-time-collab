import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, Plus, Trash2, Check } from "lucide-react";
import Navbar from "./helper/Navbar";
import { useProject } from "../context/ProjectContext";

const InviteCollaborators = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const {
    fetchCollaborators,
    addProjectCollaborator,
    removeProjectCollaborator,
  } = useProject();

  const [collaborators, setCollaborators] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // --- Fetch collaborators ---
  useEffect(() => {
    const loadCollaborators = async () => {
      try {
        const data = await fetchCollaborators(projectId);
        setCollaborators(data);
      } catch (err) {
        console.error("Error loading collaborators:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCollaborators();
  }, [projectId]);

  // --- Add collaborator ---
  const handleAdd = async () => {
    if (!email.trim()) return;
    try {
      const newCollab = await addProjectCollaborator(projectId, email);
      setCollaborators((prev) => [...prev, newCollab]);
      setEmail("");
      alert("Collaborator added successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add collaborator.");
    }
  };

  // --- Remove collaborator ---
  const handleRemove = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this collaborator?"))
      return;
    try {
      await removeProjectCollaborator(projectId, userId);
      setCollaborators((prev) => prev.filter((c) => c._id !== userId));
    } catch (err) {
      console.error("Error removing collaborator:", err);
      alert("Failed to remove collaborator.");
    }
  };

  // --- Copy link ---
  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/project/${projectId}/invite`;
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Invite collaborators
            </h1>
            <p className="text-gray-500 text-lg">
              Share a link or invite via email. Set roles per user.
            </p>
          </div>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-slate-700 hover:bg-gray-50 transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            Copy invite link
          </button>
        </div>

        {/* --- Add by Email --- */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-1">Add by email</h2>
          <p className="text-gray-500 mb-4 text-sm">
            We'll send them a sign-in link.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-gray-400"
            />
            <button
              onClick={handleAdd}
              className="p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- Collaborators List --- */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Current collaborators</h2>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading collaborators...</p>
          ) : collaborators.length > 0 ? (
            <div className="space-y-4 mb-8">
              {collaborators.map((person) => (
                <div
                  key={person._id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={person.avatar || "https://i.pravatar.cc/150"}
                      alt={person.fullName || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-slate-900">
                        {person.fullName || "Unnamed User"}
                      </p>
                      <p className="text-sm text-gray-500">{person.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(person._id)}
                    className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No collaborators yet.</p>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => navigate(`/project/${projectId}`)}
              className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              Done
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InviteCollaborators;
