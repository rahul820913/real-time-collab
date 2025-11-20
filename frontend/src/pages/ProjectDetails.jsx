import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Layout,
  Save,
  Trash2,
  Globe,
  Database,
  Shield,
} from "lucide-react";
import Navbar from "../components/helper/Navbar";
import Footer from "../components/helper/Footer";
import { useProject } from "../context/ProjectContext"; // to reuse context
import {useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/check/LoadingSpinner";

const ProjectDetails = () => {
  const { projectId } = useParams(); // get /project/:id
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const {fetchProjectById ,handleDeleteproject, loading} = useProject();
  const {user } = useAuth();
  const id = projectId;

  useEffect(() => {
    fetchProjectById(id)
      .then((data) => setProjectData(data))
      .catch((err) => console.error("Error fetching project:", err))
  }, [id]);

  // console.log(projectData)


  if (loading)
    return  <LoadingSpinner />


  if (!projectData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
        Project not found 😢
      </div>
    );

  // --- MOCK collaborators for now ---
  const collaborators = projectData.collaborators || [];

  // Handle delete project
const handleDelete = (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this project?"
  );
  if (!confirmDelete) return;
  handleDeleteproject(id);
}

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
      {/* --- Navbar --- */}
      <Navbar />

      {/* --- Main Content --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {projectData.name}
            </h1>
            <p className="text-gray-500 mb-4">{projectData.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                {projectData.visibility}
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5" />
                {projectData.type}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/project/${projectData._id}/invite`)} className="px-4 py-2 bg-white border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Invite
            </button>
            <button
              onClick={()=>navigate(`/project/${projectData._id}/editor`)}
              className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm"
            >
              <Play fill="currentColor" className="w-3.5 h-3.5" />
              Open Editor
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-1">About</h2>
              <p className="text-gray-500">Project details</p>
            </div>

            <div className="space-y-6 text-slate-900">
              <p className="text-gray-600">
                Last updated:{" "}
                {new Date(projectData.updatedAt).toLocaleString()}
              </p>

              <div className="py-4 border-t border-b border-gray-100">
                <p className="text-gray-600">
                  <span className="font-medium text-slate-900">
                    Description:
                  </span>{" "}
                  {projectData.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-medium text-slate-900 mr-2">Env:</span>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  Node 20
                </span>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  Mongo Atlas
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-12">
              <button className="px-4 py-2.5 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" />
                Save notes
              </button>
              <button
                onClick={()=>handleDelete(projectData._id)}
                className="px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete project
              </button>
            </div>
          </div>

          {/* Right Column - Collaborators */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm h-fit">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-1">Collaborators</h2>
              <p className="text-gray-500">People with access</p>
            </div>

            {collaborators.length > 0 ? (
              <div className="space-y-4">
                {collaborators.map((col, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          col.avatar ||
                          "https://i.pravatar.cc/150?img=" + (index + 5)
                        }
                        alt={col.name || "User"}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-slate-900">
                          {col.name || "Collaborator"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {col.role || "Member"}
                        </p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 border border-gray-200 text-gray-600 font-medium rounded-md hover:bg-gray-50 transition-colors text-xs">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No collaborators yet.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetails;
