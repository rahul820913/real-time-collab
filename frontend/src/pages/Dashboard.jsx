import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Navbar from "../components/helper/Navbar";
import ProjectCard from "../components/helper/ProjectCard";
import Footer from "../components/helper/Footer";
import { useProject } from "../context/ProjectContext"; // ✅ context hook
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/check/LoadingSpinner";


const Dashboard = () => {
  const navigate = useNavigate();
  const { fetchUserProjects } = useProject();
  const [ownedProjects, setOwnedProjects] = useState([]);
  const [collaboratingProjects, setCollaboratingProjects] = useState([]);
  const { user ,loading } = useAuth();
  const currentUser = user.result;


  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchUserProjects(currentUser._id);
      if (data) {
        setOwnedProjects(data.ownedProjects);
        setCollaboratingProjects(data.collaboratingProjects);

      }
    };
    loadProjects();
  }, []);


  if(loading){
    return <LoadingSpinner />
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Dashboard
            </h1>
            <p className="text-gray-500">
              Overview of projects you own and collaborate on.
            </p>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>

        {/* Your Projects Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your projects</h2>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading your projects...</p>
          ) : ownedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              You haven’t created any projects yet.
            </p>
          )}
        </section>

        {/* Collaborating Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Collaborating</h2>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading collaborations...</p>
          ) : collaboratingProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collaboratingProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              You’re not collaborating on any projects yet.
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
