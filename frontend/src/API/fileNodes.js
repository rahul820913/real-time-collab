import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/**
 * FETCH FULL TREE
 */
export const fetchTree = (projectId) =>
  API.get(`/file_nodes/${projectId}/tree`).then((res) => res.data);

/**
 * CREATE NODE (FILE OR DIRECTORY)
 */
export const createNode = (projectId, nodeData) =>
  API.post(`/file_nodes/${projectId}`, nodeData).then((res) => res.data);

/**
 * RENAME NODE
 */
export const renameNode = (projectId, nodeId, newName) =>
  API.put(`/file_nodes/${projectId}/${nodeId}/rename`, { newName }).then(
    (res) => res.data
  );

/**
 * UPDATE FILE CONTENT
 */
export const updateContent = (projectId, nodeId, content) =>
  API.put(`/file_nodes/${projectId}/${nodeId}/content`, { content }).then(
    (res) => res.data
  );

/**
 * DELETE NODE (RECURSIVE)
 */
export const deleteNode = (projectId, nodeId) =>
  API.delete(`/file_nodes/${projectId}/${nodeId}`).then((res) => res.data);
