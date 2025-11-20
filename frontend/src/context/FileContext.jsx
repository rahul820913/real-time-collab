import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import { toast } from "react-hot-toast";
  import { useSocket } from "./SocketContext";
  
  import {
    fetchTree,
    createNode as apiCreateNode,
    renameNode as apiRenameNode,
    updateContent as apiUpdateContent,
    deleteNode as apiDeleteNode,
  } from "../API/fileNodes";
  
  export const FileContext = createContext(null);
  export const useFileSystem = () => useContext(FileContext);
  
  const SOCKET_EVENTS = {
    NODE_CREATED: "NODE_CREATED",
    NODE_UPDATED: "NODE_UPDATED",
    NODE_RENAMED: "NODE_RENAMED",
    NODE_DELETED: "NODE_DELETED",
  };
  
  export const FileContextProvider = ({ children, projectId }) => {
    const socketObj = useSocket();
    const socket = socketObj?.socket || null; // <-- SAFE SOCKET
  
    const [tree, setTree] = useState([]);
    const [flatNodes, setFlatNodes] = useState([]);
    const [openFiles, setOpenFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
  
    // Load from backend
    const loadTree = async () => {
      try {
        const { tree, nodes } = await fetchTree(projectId);
        setTree(tree);
        setFlatNodes(nodes);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project files");
      }
    };
  
    useEffect(() => {
      loadTree();
    }, [projectId]);
  
    // Create
    const createNode = async (nodeData) => {
      try {
        const newNode = await apiCreateNode(projectId, nodeData);
        await loadTree();
  
        if (socket) socket.emit(SOCKET_EVENTS.NODE_CREATED, newNode);
        return newNode;
      } catch {
        toast.error("Could not create file or folder");
      }
    };
  
    // Update content
    const updateFileContent = async (nodeId, content) => {
      try {
        await apiUpdateContent(projectId, nodeId, content);
        await loadTree();
  
        if (socket) socket.emit(SOCKET_EVENTS.NODE_UPDATED, { nodeId, content });
      } catch {
        toast.error("Could not update file");
      }
    };
  
    // Rename
    const renameNode = async (nodeId, newName) => {
      try {
        await apiRenameNode(projectId, nodeId, newName);
        await loadTree();
  
        if (socket) socket.emit(SOCKET_EVENTS.NODE_RENAMED, { nodeId, newName });
      } catch {
        toast.error("Could not rename");
      }
    };
  
    // Delete
    const deleteNode = async (nodeId) => {
      try {
        await apiDeleteNode(projectId, nodeId);
        await loadTree();
  
        if (socket) socket.emit(SOCKET_EVENTS.NODE_DELETED, { nodeId });
      } catch {
        toast.error("Failed to delete");
      }
    };
  
    // Open file
    const openFile = (id) => {
      const node = flatNodes.find((n) => n._id === id);
      if (!node) return;
  
      if (!openFiles.some((f) => f._id === id)) {
        setOpenFiles((prev) => [...prev, node]);
      }
  
      setActiveFile(node);
    };
  
    const closeFile = (id) => {
      setOpenFiles((prev) => prev.filter((f) => f._id !== id));
      if (activeFile?._id === id) setActiveFile(null);
    };
  
    // SOCKET LISTENERS (SAFE)
    useEffect(() => {
      if (!socket) return; // <-- FIX
  
      const reload = async () => await loadTree();
  
      socket.on(SOCKET_EVENTS.NODE_CREATED, reload);
      socket.on(SOCKET_EVENTS.NODE_UPDATED, reload);
      socket.on(SOCKET_EVENTS.NODE_RENAMED, reload);
      socket.on(SOCKET_EVENTS.NODE_DELETED, reload);
  
      return () => {
        socket.off(SOCKET_EVENTS.NODE_CREATED, reload);
        socket.off(SOCKET_EVENTS.NODE_UPDATED, reload);
        socket.off(SOCKET_EVENTS.NODE_RENAMED, reload);
        socket.off(SOCKET_EVENTS.NODE_DELETED, reload);
      };
    }, [socket]);
  
    return (
      <FileContext.Provider
        value={{
          tree,
          flatNodes,
          openFiles,
          activeFile,
  
          createNode,
          updateFileContent,
          renameNode,
          deleteNode,
          openFile,
          closeFile,
        }}
      >
        {children}
      </FileContext.Provider>
    );
  };
  