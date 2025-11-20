import React from 'react';
import { useNavigate } from "react-router-dom";
import { Search, Plus, Play, Globe, Database, Shield, Layout, Server, ChevronDown, MoreHorizontal } from 'lucide-react';

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();
    const isPrivate = project.visibility === 'Private';
    
    return (
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg truncate pr-2">{project.name}</h3>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${isPrivate ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
            {project.visibility}
          </span>
        </div>
  
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          {project.type === 'API' ? <Server className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
          {project.type}
        </div>
  
        <p className="text-gray-600 text-sm mb-6 flex-grow">
          {project.description}
        </p>
  
        <div className="flex items-center mb-6 pl-2">
          {project.collaborators.map((avatar, index) => (
            <img
              key={index}
              src="https://i.pravatar.cc/150"
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-white -ml-2"
            />
          ))}
        </div>
  
        <div className="flex items-center gap-3 mt-auto">
          <button
              onClick={() => navigate(`/project/${project._id}`)}
              className="flex-1 px-4 py-2 border border-gray-200 text-slate-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
          Details
          </button>
          <button onClick={() => navigate(`/project/${project._id}/editor`)} className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
            <Play fill="currentColor" className="w-3 h-3" />
            Open Editor
          </button>
        </div>
      </div>
    );
  };

  export default ProjectCard;