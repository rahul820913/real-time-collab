// // server.js
// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");
// const connectDB = require("./src/config/connectDB");
// const messages = require("./src/models/Message");
// const fileNodeRoutes = require("./src/routes/fileNodeRoutes");
// const FileNode = require("./src/models/FileNode");
// const { buildTree } = require("./src/utils/buildTree");

// const PORT = process.env.PORT || 5000;
// const CLIENT_ORIGIN = process.env.CLIENT_URL || "http://localhost:5173";

// connectDB();

// const app = express();
// const server = http.createServer(app);

// app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
// app.use(express.json());

// // Routes
// app.use("/api/auth", require("./src/routes/authRoutes"));
// app.use("/api/projects", require("./src/routes/projectRoutes"));
// app.use("/api/users", require("./src/routes/UserRoutes"));
// app.use("/api/messages/project", require("./src/routes/messagesRoute"));
// app.use("/api/file_nodes", fileNodeRoutes);
// // In-memory per-project stores
// const userPresence = {};
// const projectSettings = {};
// const projectFiles = {};
// const runLogs = {}; // still used to show previous logs in UI

// // Socket Server
// const io = new Server(server, {
//   cors: { origin: CLIENT_ORIGIN, credentials: true },
//   path: "/socket.io",
// });

// io.on("connection", (socket) => {
//   console.log(`⚡ Connected: ${socket.id}`);

//   // ─────────────────────────────
//   // JOIN PROJECT

//   socket.on("joinProject", async ({ projectId, name }) => {
//     if (!projectId) return;
  
//     socket.join(projectId);
//     socket.data.projectId = projectId;
//     socket.data.name = name;
  
//     // ----------------------------------------------------
//     // 1. USER PRESENCE
//     // ----------------------------------------------------
//     if (!userPresence[projectId]) userPresence[projectId] = [];
//     userPresence[projectId].push({ id: socket.id, name });
  
//     io.to(projectId).emit("presence", userPresence[projectId]);
  
//     // ----------------------------------------------------
//     // 2. EDITOR SETTINGS (theme, font size)
//     // ----------------------------------------------------
//     socket.emit(
//       "settingsUpdate",
//       projectSettings[projectId] || { theme: "dark", fontSize: 14 }
//     );
  
//     // ----------------------------------------------------
//     // 3. LOAD FILE TREE + FILE CONTENTS FROM DATABASE
//     // ----------------------------------------------------
//     try {
//       // Load all nodes for this project
//       const nodes = await FileNode.find({ projectId }).lean();
  
//       // ---- A) BUILD AND SEND FILE TREE ----
//       const fileTree = buildTree(nodes);
//       socket.emit("fileTreeUpdate", fileTree);
  
//       // ---- B) BUILD AND SEND FILE CONTENTS ----
//       const fileContentMap = {};
  
//       nodes.forEach((node) => {
//         if (node.type === "file") {
//           fileContentMap[String(node._id)] = node.content || "";
//         }
//       });
  
//       socket.emit("initialFileContents", fileContentMap);
  
//     } catch (err) {
//       console.error("❌ Failed to load project tree:", err);
//       socket.emit("fileTreeUpdate", []);
//       socket.emit("initialFileContents", {});
//     }
  
//     // ----------------------------------------------------
//     // 4. SEND PREVIOUS TERMINAL OUTPUT (LAST 20 LINES)
//     // ----------------------------------------------------
//     (runLogs[projectId] || []).slice(-20).forEach((line) => {
//       socket.emit("runOutput", line);
//     });
  
//     console.log(`👤 ${name} joined ${projectId}`);
//   });
  
//   // ─────────────────────────────
//   // REAL-TIME EDITING
//   // ─────────────────────────────
//   socket.on("editorChangeDelta", async ({ projectId, nodeId, patches }) => {
//     try {
//       if (!projectId || !nodeId || !patches) {
//         console.error("❌ editorChangeDelta missing required fields");
//         return;
//       }
  
//       socket.join(projectId);
  
//       const node = await FileNode.findOne({ _id: nodeId, projectId });
  
//       if (!node) {
//         console.error(`❌ FileNode not found for patch update: ${nodeId}`);
//         return;
//       }
  
//       if (node.type !== "file") {
//         console.error(`❌ Attempted to patch non-file node: ${nodeId}`);
//         return;
//       }
  
//       // 1️⃣ Start with original content
//       let newContent = node.content ?? "";
//       // 2️⃣ Apply patches one by one
//       patches.forEach((p) => {
//         newContent =
//           newContent.slice(0, p.from) +
//           p.insert +
//           newContent.slice(p.to);
//       });
//       // 3️⃣ Save updated content in DB
//       await FileNode.updateOne(
//         { _id: nodeId },
//         { $set: { content: newContent } }
//       );
  
//       // 4️⃣ Send patches to all other clients
//       socket.to(projectId).emit("editorChangeDelta", {
//         nodeId,
//         patches,
//       });
  
//     } catch (err) {
//       console.error("❌ Error in editorChangeDelta:", err);
//     }
//   });
  
  
  
//   // ─────────────────────────────
//   // FILE TREE
//   // ─────────────────────────────
//   socket.on("updateFileTree", ({ projectId, structure }) => {
//     projectFiles[projectId] = structure;
//     io.to(projectId).emit("fileTreeUpdate", structure);
//   });

//   // ─────────────────────────────
//   // SETTINGS
//   // ─────────────────────────────
//   socket.on("updateSettings", ({ projectId, settings }) => {
//     projectSettings[projectId] = settings;
//     io.to(projectId).emit("settingsUpdate", settings);
//   });

//   // ─────────────────────────────
//   // CHAT
//   // ─────────────────────────────
//   socket.on("chatMessage", ({ projectId, message, user }) => {
//     const msg = {
//       user: user || socket.data.name,
//       message,
//       timestamp: new Date().toISOString(),
//     };

//     messages.create({
//       projectId,
//       user: user || socket.data.name,
//       message,
//       timestamp: msg.timestamp,
//     });

//     io.to(projectId).emit("chatMessage", msg);
//   });

//   // ─────────────────────────────
//   // RUN EVENTS (frontend now uses Piston)
//   // ─────────────────────────────
//   socket.on("runLog", ({ projectId, line }) => {
//     if (!runLogs[projectId]) runLogs[projectId] = [];
//     runLogs[projectId].push(line);

//     io.to(projectId).emit("runOutput", line);
//   });

//   // ─────────────────────────────
//   // DISCONNECT
//   // ─────────────────────────────
//   socket.on("disconnect", () => {
//     const projectId = socket.data.projectId;
//     const name = socket.data.name;

//     console.log(`❌ Disconnect: ${socket.id} (${name})`);

//     if (projectId && userPresence[projectId]) {
//       userPresence[projectId] = userPresence[projectId].filter(
//         (u) => u.id !== socket.id
//       );
//       io.to(projectId).emit("presence", userPresence[projectId]);
//     }
//   });
// });

// // Root
// app.get("/", (_, res) =>
//   res.send("🟢 Backend Running — Collaborative Code Editor Active")
// );

// // Server start
// server.listen(PORT, () => {
//   console.log(`🚀 Server Running: http://localhost:${PORT}`);
//   console.log(`🔗 Socket.IO: http://localhost:${PORT}/socket.io`);
// });

// module.exports = app;
// server.js


require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./src/config/connectDB");
const messages = require("./src/models/Message");
const fileNodeRoutes = require("./src/routes/fileNodeRoutes");
const FileNode = require("./src/models/FileNode");
const { buildTree } = require("./src/utils/buildTree");

// ✅ CHANGE 1: Use '0.0.0.0' binding logic for Render
const PORT = process.env.PORT || 5000;

// ✅ CHANGE 2: Use an ARRAY to allow both Vercel (Prod) and Localhost (Dev)
const allowedOrigins = [
  "https://realtimecollbapp.vercel.app", // Your Production Frontend
  "http://localhost:5173",               // Your Local Frontend
  "http://localhost:5000"                // Your Local Backend/Socket
];

connectDB();

const app = express();
const server = http.createServer(app);

// ✅ CHANGE 3: Use the allowedOrigins array
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// API Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/projects", require("./src/routes/projectRoutes"));
app.use("/api/users", require("./src/routes/UserRoutes"));
app.use("/api/messages/project", require("./src/routes/messagesRoute"));
app.use("/api/file_nodes", fileNodeRoutes);

// In-memory stores
const userPresence = {};
const projectSettings = {};
const runLogs = {};
const liveFileBuffers = {};

async function flushProjectToDB(projectId) {
  if (!liveFileBuffers[projectId]) return;

  console.log(`💾 Saving project ${projectId} → MongoDB...`);
  try {
    const files = liveFileBuffers[projectId];
    for (const nodeId of Object.keys(files)) {
      await FileNode.updateOne({ _id: nodeId }, { $set: { content: files[nodeId] } });
    }
    console.log(`✅ Saved ${projectId}`);
  } catch (err) {
    console.error(`❌ Save failed for ${projectId}`, err);
  }
}

// ✅ CHANGE 4: Pass the allowedOrigins array to Socket.io too
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
  path: "/socket.io",
});

io.on("connection", (socket) => {
  console.log(`⚡ Connected: ${socket.id}`);

  socket.on("joinProject", async ({ projectId, name }) => {
    try {
      if (!projectId) return;
      const userName = name || "Anonymous";
      socket.join(projectId);
      socket.data.projectId = projectId;
      socket.data.name = userName;

      if (!userPresence[projectId]) userPresence[projectId] = [];
      userPresence[projectId].push({ id: socket.id, name: userName });

      io.to(projectId).emit("presence", userPresence[projectId]);

      socket.emit(
        "settingsUpdate",
        projectSettings[projectId] || { theme: "dark", fontSize: 14 }
      );

      if (!liveFileBuffers[projectId]) {
        liveFileBuffers[projectId] = {};
        console.log(`📂 Loading project ${projectId} from DB...`);
        const nodes = await FileNode.find({ projectId }).lean();
        const tree = buildTree(nodes);
        nodes.forEach((node) => {
          if (node.type === "file") {
            liveFileBuffers[projectId][String(node._id)] = node.content || "";
          }
        });
        socket.emit("fileTreeUpdate", tree);
      }
      socket.emit("initialFileContents", liveFileBuffers[projectId]);
      (runLogs[projectId] || []).slice(-20).forEach((line) => {
        socket.emit("runOutput", line);
      });
      console.log(`👤 ${userName} joined ${projectId}`);
    } catch (err) {
      console.error("❌ joinProject error:", err);
    }
  });

  socket.on("editorChangeDelta", ({ projectId, nodeId, patches }) => {
    if (!projectId || !nodeId || !Array.isArray(patches)) return;
    if (!liveFileBuffers[projectId]) liveFileBuffers[projectId] = {};
    if (!liveFileBuffers[projectId][nodeId]) liveFileBuffers[projectId][nodeId] = "";
    let content = liveFileBuffers[projectId][nodeId];
    patches
      .sort((a, b) => b.from - a.from)
      .forEach((p) => {
        content = content.slice(0, p.from) + p.insert + content.slice(p.to);
      });
    liveFileBuffers[projectId][nodeId] = content;
    socket.to(projectId).emit("editorChangeDelta", { nodeId, patches });
  });

  socket.on("updateFileTree", ({ projectId, structure }) => {
    if (!projectId) return;
    io.to(projectId).emit("fileTreeUpdate", structure);
  });

  socket.on("updateSettings", ({ projectId, settings }) => {
    if (!projectId) return;
    projectSettings[projectId] = settings;
    io.to(projectId).emit("settingsUpdate", settings);
  });

  socket.on("chatMessage", ({ projectId, message, user }) => {
    if (!projectId || !message) return;
    const msg = {
      user: user || socket.data.name,
      message,
      timestamp: new Date().toISOString(),
    };
    messages.create({
      projectId,
      user: msg.user,
      message,
      timestamp: msg.timestamp,
    }).catch(console.error);
    io.to(projectId).emit("chatMessage", msg);
  });

  socket.on("leaveProject", async ({ projectId, name }) => {
    try {
      if (!projectId) return;
      console.log(`🚪 ${name || socket.data.name} leaving ${projectId}`);
      if (userPresence[projectId]) {
        userPresence[projectId] = userPresence[projectId].filter(
          (u) => u.id !== socket.id
        );
      }
      io.to(projectId).emit("presence", userPresence[projectId] || []);
      socket.leave(projectId);
      delete socket.data.projectId;
      if (!userPresence[projectId] || userPresence[projectId].length === 0) {
        await flushProjectToDB(projectId);
        delete liveFileBuffers[projectId];
        delete userPresence[projectId];
        delete projectSettings[projectId];
        delete runLogs[projectId];
      }
    } catch (err) {
      console.error("❌ leaveProject error:", err);
    }
  });

  socket.on("disconnect", async (reason) => {
    const projectId = socket.data.projectId;
    const name = socket.data.name;
    console.log(`❌ Disconnected: ${socket.id} (${name}) reason: ${reason}`);
    if (!projectId) return;
    if (userPresence[projectId]) {
      userPresence[projectId] = userPresence[projectId].filter(
        (u) => u.id !== socket.id
      );
      io.to(projectId).emit("presence", userPresence[projectId]);
    }
    if (userPresence[projectId] && userPresence[projectId].length === 0) {
      await flushProjectToDB(projectId);
      delete liveFileBuffers[projectId];
      delete userPresence[projectId];
      delete projectSettings[projectId];
      delete runLogs[projectId];
    }
  });
});

setInterval(async () => {
  for (const id of Object.keys(liveFileBuffers)) {
    await flushProjectToDB(id);
  }
}, 30000);

app.get("/", (_, res) =>
  res.send("🟢 Backend Running — Collaborative Code Editor Active")
);

// ✅ CHANGE 5: CRITICAL! Start the server listening
// This was missing, which caused the "No open ports" error on Render
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});