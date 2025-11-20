// // client/src/context/SocketContext.jsx
// import React, { createContext, useContext, useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import { useAuth } from "./AuthContext";

// const SERVER_URL = "http://localhost:5000";

// const SocketContext = createContext(null);

// export const SocketProvider = ({ children, projectId }) => {
//   const { user } = useAuth();

//   const [socket, setSocket] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [settings, setSettings] = useState({ theme: "dark", fontSize: 14 });
//   const [fileTree, setFileTree] = useState([]);
//   const [runOutput, setRunOutput] = useState([]);
//   const [chatMessages, setChatMessages] = useState([]);

//   const socketRef = useRef(null);

//   // Get correct username from your AuthContext format
//   const currentUserName =
//     user?.result?.fullName || user?.name || user?.username || "Guest";

//   useEffect(() => {
//     if (!user || !projectId) return;

//     console.log("🔵 Connecting to backend socket...", {
//       projectId,
//       user: currentUserName,
//     });

//     const s = io(SERVER_URL, {
//       path: "/socket.io",
//       transports: ["websocket", "polling"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//     });

//     socketRef.current = s;
//     setSocket(s);

//     // Debug
//     s.on("connect_error", (err) => console.error("❌ connect_error:", err));
//     s.on("error", (err) => console.error("❌ socket error:", err));

//     // Success
//     s.on("connect", () => {
//       console.log("✅ Socket connected:", s.id);
//       s.emit("joinProject", { projectId, name: currentUserName });
//     });

//     s.on("disconnect", (reason) => {
//       console.warn("⚠️ socket disconnected:", reason);
//     });

//     // Listeners
//     s.on("presence", (list) => setUsers(list));
//     s.on("settingsUpdate", (updated) => setSettings(updated));
//     s.on("fileTreeUpdate", (tree) => setFileTree(tree));
//     s.on("runOutput", (msg) => setRunOutput((prev) => [...prev, msg]));

//     // Chat listener (NO DUPLICATES)
//     s.on("chatMessage", (msg) => {
//       setChatMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       console.log("🔴 Disconnecting socket...");
//       try {
//         s.emit("leaveProject", { projectId });
//       } catch {}

//       s.off();
//       s.disconnect();
//     };
//   }, [projectId, currentUserName]);

//   // ===============================
//   // EMIT FUNCTIONS
//   // ===============================

//   const emitChatMessage = (message) => {
//     const msgObj = {
//       projectId,
//       message,
//       user: currentUserName,
//       timestamp: new Date().toISOString(),
//     };

//     // ❌ Remove local push to avoid duplicates
//     // setChatMessages((prev) => [...prev, msgObj]);

//     socketRef.current?.emit("chatMessage", msgObj);
//   };

//   const emitSettingChange = (newSettings) => {
//     setSettings(newSettings);
//     socketRef.current?.emit("updateSettings", { projectId, settings: newSettings });
//   };

//   const emitFileTreeUpdate = (structure) => {
//     setFileTree(structure);
//     socketRef.current?.emit("updateFileTree", { projectId, structure });
//   };

//   const emitRunStart = () => {
//     socketRef.current?.emit("runStart", { projectId, user: currentUserName });
//   };

//   const emitRunOutput = (line) => {
//     setRunOutput((prev) => [...prev, line]);
//     socketRef.current?.emit("runOutput", { projectId, line });
//   };

//   const emitRunEnd = () => {
//     socketRef.current?.emit("runEnd", { projectId });
//   };

//   return (
//     <SocketContext.Provider
//       value={{
//         socket,
//         users,
//         settings,
//         fileTree,
//         runOutput,
//         chatMessages,

//         emitSettingChange,
//         emitFileTreeUpdate,
//         emitChatMessage,
//         emitRunStart,
//         emitRunOutput,
//         emitRunEnd,
//       }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) throw new Error("useSocket must be used inside a SocketProvider");
//   return context;
// };

// client/src/context/SocketContext.jsx
// client/src/context/SocketContext.jsx

import React, { createContext, useContext, useRef } from "react";
import { io } from "socket.io-client";

const SERVER_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://real-time-collab-rqce.onrender.com";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  // Create socket once
  if (!socketRef.current) {
    socketRef.current = io(SERVER_URL, {
      // path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 800,
    });

    console.log("🟢 Global socket created");

    socketRef.current.on("connect", () =>
      console.log("🟢 Socket connected:", socketRef.current.id)
    );

    socketRef.current.on("disconnect", (reason) =>
      console.log("🔴 Socket disconnected:", reason)
    );
  }

  // ----------------------------------------------------
  // ⭐ NEW: Leave Project (leave room, keep socket alive)
  // ----------------------------------------------------
 

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
             // <-- exported properly
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside a SocketProvider");
  return ctx;
};
