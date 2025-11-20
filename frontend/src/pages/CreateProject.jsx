import React, { useState } from 'react';
import { ChevronRight, Layout, Server, Library } from 'lucide-react';
import Navbar from '../components/helper/Navbar';
import TypeOption from '../components/helper/TypeOption';
import {useAuth} from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import LoadingSpinner from '../components/check/LoadingSpinner';
const CreateProject = () => {
  const [selectedType, setSelectedType] = useState('Web App');
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { handleCreateProject, loading } = useProject();
  const {user } = useAuth();

  // Mock user (replace with real auth user later)


  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter a project name.");
      return;
    }

    const projectData = {
      name,
      description,
      type: selectedType,
      visibility: isPrivate ? "Private" : "Public",
      ownerId: user.result._id, 
    };

    handleCreateProject(projectData);
  };

  if(loading){
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-slate-900">Create Project</h1>
          <p className="text-gray-500 text-lg">
            Name it, describe it, choose type and visibility. You can invite collaborators next.
          </p>
        </div>

        <div className="space-y-8">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Project name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Realtime Markdown Notes"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Type</label>
            <div className="grid grid-cols-3 gap-4">
              <TypeOption icon={Layout} label="Web App" selected={selectedType === 'Web App'} onClick={() => setSelectedType('Web App')} />
              <TypeOption icon={Server} label="API" selected={selectedType === 'API'} onClick={() => setSelectedType('API')} />
              <TypeOption icon={Library} label="Library" selected={selectedType === 'Library'} onClick={() => setSelectedType('Library')} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you building?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Private project</h3>
              <p className="text-sm text-gray-500">Only invited collaborators can view and edit.</p>
            </div>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPrivate ? 'bg-slate-900' : 'bg-gray-200'
              }`}
            >
              <span
                className={`${isPrivate ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-4 pt-6">
            <button className="px-6 py-2.5 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? "Creating..." : "Continue"}
              {!loading && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProject;
