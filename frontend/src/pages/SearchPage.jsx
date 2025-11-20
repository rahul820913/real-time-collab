import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { Search, User, FolderGit2 } from "lucide-react";

const API_BASE = "http://localhost:5000";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);

        const [projectsRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE}/api/projects/search?q=${query}`),
          axios.get(`${API_BASE}/api/users/search?q=${query}`),
        ]);

        setProjects(projectsRes.data || []);
        setUsers(usersRes.data || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-6 h-6 text-slate-700" />
          <h1 className="text-2xl font-bold text-slate-900">
            Search results for: <span className="text-blue-600">{query}</span>
          </h1>
        </div>

        {loading ? (
          <div className="text-gray-500">Searching...</div>
        ) : (
          <>
            {/* Projects */}
            <h2 className="text-lg font-semibold text-slate-800 mt-6 mb-2 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5" /> Projects
            </h2>
            {projects.length === 0 ? (
              <p className="text-gray-500">No projects found.</p>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/project/${project._id}`}
                    className="block py-2 px-3 hover:bg-gray-50 rounded-md"
                  >
                    <p className="font-medium text-slate-900">{project.name}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* Users */}
            <h2 className="text-lg font-semibold text-slate-800 mt-10 mb-2 flex items-center gap-2">
              <User className="w-5 h-5" /> Users
            </h2>
            {users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="py-2 px-3 hover:bg-gray-50 rounded-md flex items-center gap-3"
                  >
                    <img
                      src={u.avatar || "https://i.pravatar.cc/150"}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-slate-900">{u.fullName}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
