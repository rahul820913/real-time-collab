import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Navbar from "../components/helper/Navbar";
import ProjectCard from "../components/helper/ProjectCard";
import Footer from "../components/helper/Footer";
import LoadingSpinner from "../components/check/LoadingSpinner";
import { useProject } from "../context/ProjectContext";

const AllProjects = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects} = useProject(); // ✅ get from context
  const [filter, setFilter] = useState("");

  // Fetch projects on load
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); // ✅ Added dependency

  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  // Filter projects by title
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <Navbar />

      {/* ✅ Adjusted padding for mobile */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Header with Filter and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          {/* ✅ Adjusted text size for mobile */}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            All Projects
          </h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by name..."
              className="flex-1 md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
            />
            <button className="px-4 py-2 border border-gray-300 bg-white text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Sort
            </button>
            <button
              onClick={() => navigate("/create")}
              className="px-3 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>

        {/* Projects List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Projects</h2>
          </div>

          {/* ✅ Removed redundant loading check */}
          {filteredProjects.length > 0 ? (
            // ✅ Adjusted grid gap for mobile
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            // ✅ Added centering and padding for empty state
            <p className="text-gray-500 text-sm text-center py-8">
              No projects found.
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AllProjects;