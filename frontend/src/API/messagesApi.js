import axios from "axios";

const API_BASE = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://real-time-collab-rqce.onrender.com";

export const fetchMessages = async (projectId) => {
  const res = await axios.get(`${API_BASE}/api/messages/project/${projectId}/messages`);
  return res.data;
};
