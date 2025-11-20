import axios from "axios";

const API_BASE = "http://localhost:5000";

export const fetchMessages = async (projectId) => {
  const res = await axios.get(`${API_BASE}/api/messages/project/${projectId}/messages`);
  return res.data;
};
