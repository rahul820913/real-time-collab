import React, { createContext, useState, useContext } from "react";
import { createProject,
     getProjects, 
     getProjectById , 
     deleteProject,
     getUserProjects,
     getCollaborators,
    addCollaborator,
    removeCollaborator} from "../API/projectApi";
import { useNavigate } from "react-router-dom";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Create a new project
  const handleCreateProject = async (projectData) => {
    try {
      setLoading(true);
      const newProject = await createProject(projectData);
      setProjects((prev) => [...prev, newProject]);
      navigate(`/project/${newProject._id}`); // Redirect after creation
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Something went wrong while creating your project.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch project by ID
  const fetchProjectById = async (id) => {
    try {
      const project = await getProjectById(id);
      return project;
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  const handleDeleteproject = async (id) => {
    try {
        const project = await deleteProject(id);
        setProjects((prev) => prev.filter((p) => p._id !== id));
      alert("Project deleted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project.");
    }
  };

  const fetchUserProjects = async (userId) => {
    try {
      setLoading(true);
      const data = await getUserProjects(userId);
      return data; // returns { ownedProjects, collaboratingProjects }
      
    } catch (err) {
      console.error("Error fetching user projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollaborators = async (projectId) => {
    try {
      const data = await getCollaborators(projectId);
      return data;
    } catch (err) {
      console.error("Error fetching collaborators:", err);
      return [];
    }
  };

  // --- Collaborators: Add ---
  const addProjectCollaborator = async (projectId, email) => {
    try {
      const data = await addCollaborator(projectId, email);
      return data.collaborator;
    } catch (err) {
      console.error("Error adding collaborator:", err);
      throw err;
    }
  };

  // --- Collaborators: Remove ---
  const removeProjectCollaborator = async (projectId, userId) => {
    try {
      await removeCollaborator(projectId, userId);
      return true;
    } catch (err) {
      console.error("Error removing collaborator:", err);
      throw err;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        handleCreateProject,
        fetchProjects,
        fetchProjectById,
        handleDeleteproject,
        fetchUserProjects,
        fetchCollaborators,
        addProjectCollaborator,
        removeProjectCollaborator,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
