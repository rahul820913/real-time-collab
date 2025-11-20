// client/src/context/CodeContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

const CodeContext = createContext(null);

export const CodeProvider = ({ children }) => {
  const { socket } = useSocket();              // ✅ correct socket instance
  const { projectId } = useParams();
  const { user } = useAuth();


  // ---------------- STATE ----------------
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({ theme: "dark", fontSize: 14 });
  const [fileTree, setFileTree] = useState([]);
  const [runOutput, setRunOutput] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [initialContents, setInitialContents] = useState({});

  const userName =
    user?.result?.fullName

  // ---------------------------------------------------------
  // 🔵 JOIN PROJECT ON LOAD  /  🔴 LEAVE PROJECT ON UNMOUNT
  // ---------------------------------------------------------
  useEffect(() => {
    if (!socket || !projectId) return;

    console.log("🔵 Joining project:", projectId);

    socket.emit("joinProject", {
      projectId,
      name : userName,
    });

    return () => {
      console.log("🔴 Leaving project:", projectId);

      socket.emit("leaveProject", {
        projectId,
        name : userName,
      });
    };
  }, [socket, projectId, userName]);


  // ---------------------------------------------------------
  // 🔊 SOCKET LISTENERS  (stable, no duplicates)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const onInitialFiles = (files) => setInitialContents(files);
    const onPresence = (list) => setUsers(list);
    const onSettings = (s) => setSettings(s);
    const onFileTreeUpdate = (tree) => setFileTree(tree);
    const onRunOutput = (line) =>
      setRunOutput((prev) => [...prev, line]);
    const onChatMessage = (msg) =>
      setChatMessages((prev) => [...prev, msg]);

    socket.on("initialFileContents", onInitialFiles);
    socket.on("presence", onPresence);
    socket.on("settingsUpdate", onSettings);
    socket.on("fileTreeUpdate", onFileTreeUpdate);
    socket.on("runOutput", onRunOutput);
    socket.on("chatMessage", onChatMessage);

    return () => {
      socket.off("initialFileContents", onInitialFiles);
      socket.off("presence", onPresence);
      socket.off("settingsUpdate", onSettings);
      socket.off("fileTreeUpdate", onFileTreeUpdate);
      socket.off("runOutput", onRunOutput);
      socket.off("chatMessage", onChatMessage);
    };
  }, [socket]);


  // ---------------------------------------------------------
  // 🟢 EMIT HELPERS
  // ---------------------------------------------------------

  const emitChatMessage = (message) => {
    socket.emit("chatMessage", {
      projectId,
      name : userName,
      message,
      timestamp: new Date().toISOString(),
    });
  };

  const emitSettingChange = (newSettings) => {
    setSettings(newSettings);
    socket.emit("updateSettings", { projectId, settings: newSettings });
  };

  const emitFileTreeUpdate = (structure) => {
    setFileTree(structure);
    socket.emit("updateFileTree", { projectId, structure });
  };

  const emitRunOutput = (line) => {
    setRunOutput((prev) => [...prev, line]);
    socket.emit("runOutput", { projectId, line });
  };

  // ---------------------------------------------------------
  // 🚪 LEAVE PROJECT (called from "Leave Project" button)
  // ---------------------------------------------------------
  const leaveProject = () => {
    if (!socket) return;

    console.log("🚪 Leaving project:", projectId);
  
    socket.emit("leaveProject", {
      projectId,
      name : userName,
    });
  };

  // ---------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------
  return (
    <CodeContext.Provider
      value={{
        users,
        settings,
        fileTree,
        runOutput,
        chatMessages,
        initialContents,

        leaveProject,
        emitChatMessage,
        emitSettingChange,
        emitFileTreeUpdate,
        emitRunOutput,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = () => useContext(CodeContext);
