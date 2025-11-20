import axios from "axios";

const apicall = axios.create({
  baseURL: "http://localhost:5000/api", // change this to your deployed backend URL later
});

// Create a new project
export const createProject = async (projectData) => {
  const response = await apicall.post("/projects", projectData);
  return response.data;
};

// Fetch all projects (for dashboard later)
export const getProjects = async () => {
  const response = await apicall.get("/projects");
  return response.data;
};

export const getUserProjects = async (userId) => {
    const response = await apicall.get(`/projects/user/${userId}`);
    return response.data;
  };
  
// Fetch a single project by ID
export const getProjectById = async (id) => {
  const response = await apicall.get(`/projects/${id}`);
  return response.data;
};

// Delete project (optional)
export const deleteProject = async (id) => {
  const response = await apicall.delete(`/projects/${id}`);
  return response.data;
};

// Get collaborators for a project
export const getCollaborators = async (projectId) => {
  const response = await apicall.get(`/projects/${projectId}/collaborators`);
  return response.data;
};

// Add collaborator by email
export const addCollaborator = async (projectId, email) => {
  const response = await apicall.post(`/projects/${projectId}/collaborators`, { email });
  return response.data;
};

// Remove collaborator
export const removeCollaborator = async (projectId, userId) => {
  const response = await apicall.delete(`/projects/${projectId}/collaborators/${userId}`);
  return response.data;
};
