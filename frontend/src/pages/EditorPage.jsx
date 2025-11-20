// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Files,
//   Settings,
//   Play,
//   X,
//   Share2,
//   MessageSquare,
//   Users,
// } from "lucide-react";

// import Navbar from "../components/helper/Navbar";
// import FileExplorerView from "../components/editor/FileExplorerView";
// import ChatView from "../components/editor/ChatView";
// import SettingsView from "../components/editor/SettingsView";
// import OnlineUsersView from "../components/editor/OnlineUsersView";

// import { useAuth } from "../context/AuthContext";
// import { useParams } from "react-router-dom";
// import { useSocket } from "../context/SocketContext";

// import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
// import { EditorView } from "@codemirror/view";

// import { useRunCode } from "../context/RunCodeContext";
// import { useFileSystem } from "../context/FileContext";

// const languageMap = {
//   js: "JS",
//   jsx: "JSX",
//   ts: "TS",
//   tsx: "TSX",
//   html: "HTML",
//   css: "CSS",
//   json: "JSON",
//   md: "MD",
//   py: "PY",
//   java: "JAVA",
//   default: "",
// };

// const getExtension = (fileName) => {
//   if (!fileName) return "";
//   const parts = fileName.split(".");
//   return parts.length > 1 ? parts.pop().toLowerCase() : "";
// };

// const EditorPage = () => {
//   const { user } = useAuth();
//   const { projectId } = useParams();
//   const { tree } = useFileSystem();

//   const {
//     socket,
//     settings,
//     users,
//     fileTree,
//     runOutput,
//     emitRunOutput,
//   } = useSocket();

//   const { runCode } = useRunCode();

//   const [activeFile, setActiveFile] = useState(null); // nodeId
//   const [fileContents, setFileContents] = useState({});
//   const [content, setContent] = useState("// Loading...");

//   // INITIAL CONTENTS LOADING -----------------------------------------
//   useEffect(() => {
//     if (!socket) return;

//     const handleInitialFiles = (files) => {
//       setFileContents(files || {});
//       if (activeFile && files[activeFile]) {
//         setContent(files[activeFile]);
//       }
//     };

//     socket.on("initialFileContents", handleInitialFiles);
//     return () => socket.off("initialFileContents", handleInitialFiles);
//   }, [socket, activeFile]);

//   // LOAD CONTENT WHEN ACTIVE FILE CHANGES -----------------------------
//   useEffect(() => {
//     if (!activeFile) return setContent("// Open a file to begin...");
//     setContent(fileContents[activeFile] ?? "// Empty file");
//   }, [activeFile, fileContents]);

//   // LOCAL EDITING & BROADCAST -----------------------------------------
//   const handleEditorChange = useCallback(
//     (value) => {
//       if (!activeFile) return setContent(value);

//       setContent(value);
//       setFileContents((prev) => ({ ...prev, [activeFile]: value }));

//       socket?.emit("editorChange", {
//         projectId,
//         nodeId: activeFile,
//         content: value,
//       });
//     },
//     [socket, projectId, activeFile]
//   );


//   useEffect(() => {
//     if (!fileTree || fileTree.length === 0) return;
  
//     // Helper to find first file in the tree
//     const findFirstFile = (nodes) => {
//       for (const node of nodes) {
//         if (node.type === "file") return node.id;
//         if (node.children?.length) {
//           const found = findFirstFile(node.children);
//           if (found) return found;
//         }
//       }
//       return null;
//     };
  
//     const firstFile = findFirstFile(fileTree);
  
//     if (firstFile) {
//       setActiveFile(firstFile);
//     }
//   }, [fileTree]);

//   // REMOTE EDITS -------------------------------------------------------
//   useEffect(() => {
//     if (!socket) return;

//     const handleRemote = (payload) => {
//       const nodeId = payload?.nodeId;
//       const newContent = payload?.content ?? "";
//       if (!nodeId) return;

//       setFileContents((prev) => ({ ...prev, [nodeId]: newContent }));

//       if (nodeId === activeFile) setContent(newContent);
//     };

//     socket.on("editorChange", handleRemote);
//     return () => socket.off("editorChange", handleRemote);
//   }, [socket, activeFile]);

//   // FIND FILE NODE -----------------------------------------------------
//   const findNode = (nodes, id) => {
//     for (const n of nodes) {
//       if (n.id === id) return n;
//       if (n.children?.length) {
//         const res = findNode(n.children, id);
//         if (res) return res;
//       }
//     }
//     return null;
//   };

//   const activeNode = activeFile ? findNode(tree, activeFile) : null;
//   const activeFileName = activeNode?.name || "No File Selected";

//   // CTRL + S SAVE -------------------------------------------------------
//   useEffect(() => {
//     const handler = (e) => {
//       const isMac = navigator.platform.toUpperCase().includes("MAC");
//       const savePressed =
//         (isMac && e.metaKey && e.key === "s") ||
//         (!isMac && e.ctrlKey && e.key === "s");

//       if (!savePressed) return;

//       e.preventDefault();
//       if (!activeFile) return emitRunOutput("❌ No file selected to save.");

//       const contentToSave = fileContents[activeFile] ?? content ?? "";

//       socket?.emit("saveFile", {
//         projectId,
//         nodeId: activeFile,
//         content: contentToSave,
//       });

//       emitRunOutput(`> Saved ${activeFile}`);
//     };

//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [activeFile, fileContents, content, socket, projectId, emitRunOutput]);

//   // SIDEBAR TABS --------------------------------------------------------
//   const [activeTab, setActiveTab] = useState("files");

//   const ActivityBarIcon = ({ icon: Icon, tabName }) => (
//     <div
//       onClick={() => setActiveTab(tabName)}
//       className={`p-3 cursor-pointer rounded-md transition ${
//         activeTab === tabName
//           ? "text-white bg-white/10"
//           : "text-gray-400 hover:text-white hover:bg-white/5"
//       }`}
//     >
//       <Icon className="w-6 h-6" />
//     </div>
//   );

//   const renderSidebarContent = () => {
//     switch (activeTab) {
//       case "files":
//         return (
//           <FileExplorerView
//             fileStructure={fileTree}
//             activeFile={activeFile}
//             setActiveFile={setActiveFile}
//           />
//         );
//       case "chat":
//         return <ChatView projectId={projectId} />;
//       case "users":
//         return <OnlineUsersView currentUser={user} />;
//       case "settings":
//         return <SettingsView projectId={projectId} currentUser={user} />;
//       default:
//         return null;
//     }
//   };

//   // RUN BUTTON ----------------------------------------------------------
//   const handleRun = async () => {
//     if (!activeFile) return emitRunOutput("❌ No file selected.");

//     const contentToRun = fileContents[activeFile] ?? content ?? "";

//     emitRunOutput("> Running...");

//     try {
//       const result = await runCode({
//         fileName: activeFileName,
//         content: contentToRun,
//       });

//       if (!result) return emitRunOutput("> (no output)");

//       result
//         .split("\n")
//         .filter((line) => line.trim() !== "")
//         .forEach((line) => emitRunOutput(line));
//     } catch (err) {
//       emitRunOutput(`❌ Run error: ${err?.message ?? err}`);
//     }
//   };

//   const ext = getExtension(activeFileName);
//   const langLabel = languageMap[ext] ?? languageMap.default;
//   const onlineCount = Array.isArray(users) ? users.length : 0;

//   // RENDER UI ------------------------------------------------------------
//   return (
//     <div className="h-screen w-full flex flex-col bg-[#1e1e1e]">
//       <Navbar />

//       <div className="flex flex-1 overflow-hidden">
//         {/* Activity Bar */}
//         <aside className="w-[60px] bg-[#252526] border-r border-[#333] flex flex-col justify-between py-4">
//           <div className="flex flex-col gap-3">
//             <ActivityBarIcon icon={Files} tabName="files" />
//             <ActivityBarIcon icon={MessageSquare} tabName="chat" />
//             <ActivityBarIcon icon={Users} tabName="users" />
//           </div>
//           <ActivityBarIcon icon={Settings} tabName="settings" />
//         </aside>

//         {/* Sidebar */}
//         <aside className="w-64 bg-[#252526] border-r border-[#333] overflow-auto">
//           {renderSidebarContent()}
//         </aside>

//         {/* MAIN AREA */}
//         <main className="flex-1 flex flex-col bg-[#1e1e1e] min-w-0">
//           {/* Top Bar */}
//           <div className="h-[40px] bg-[#1e1e1e] flex-shrink-0 border-b border-[#333] flex items-center justify-between">
//             <div className="flex items-center h-full">
//               <div className="bg-[#2d2d2d] h-full flex items-center gap-2 px-4 border-r border-[#333]">
//                 <span className="text-[#f1e05a] text-sm font-bold">
//                   {langLabel}
//                 </span>
//                 <span className="text-gray-200 text-sm">
//                   {activeNode?.type === "file"
//                     ? activeFileName
//                     : "No File Selected"}
//                 </span>

//                 {activeFile && (
//                   <X
//                     className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer ml-2"
//                     onClick={() => setActiveFile(null)}
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Right controls */}
//             <div className="flex items-center gap-4 px-4">
//               <span className="text-xs text-gray-400 flex items-center gap-1.5">
//                 <Users className="w-4 h-4" />
//                 {onlineCount} Online
//               </span>

//               <button
//                 className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium flex items-center gap-1.5"
//                 onClick={() =>
//                   socket?.emit("shareProject", {
//                     projectId,
//                     userId: user?.id,
//                   })
//                 }
//               >
//                 <Share2 className="w-4 h-4" /> Share
//               </button>

//               <button
//                 onClick={handleRun}
//                 className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition text-sm font-medium flex items-center gap-1.5"
//               >
//                 <Play className="w-4 h-4" /> Run
//               </button>
//             </div>
//           </div>

//           {/* CODE EDITOR */}
//           <div className="flex-1 overflow-auto min-h-0">
//             <CodeMirror
//               value={content}
//               height="100%"
//               theme={settings?.theme === "dark" ? "dark" : "light"}
//               extensions={[javascript(), EditorView.lineWrapping]}
//               onChange={handleEditorChange}
//               className="h-full"
//             />
//           </div>

//           {/* TERMINAL */}
//           <div className="h-[200px] flex-shrink-0 flex flex-col border-t border-[#333]">
//             <div className="flex items-center px-4 h-[40px] bg-[#1e1e1e] text-gray-400 text-sm gap-4">
//               <span className="text-white border-b-2 border-white py-2 px-2">
//                 TERMINAL
//               </span>
//               <span className="py-2 px-2 hover:text-white cursor-pointer">
//                 PROBLEMS
//               </span>
//               <span className="py-2 px-2 hover:text-white cursor-pointer">
//                 OUTPUT
//               </span>
//               <span className="py-2 px-2 hover:text-white cursor-pointer">
//                 DEBUG CONSOLE
//               </span>
//             </div>

//             <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-[#2d2d2d] text-gray-300">
//               {!runOutput || runOutput.length === 0 ? (
//                 <p className="text-gray-500">Click 'Run' to start…</p>
//               ) : (
//                 runOutput.map((line, i) => (
//                   <div key={i} className="flex gap-2">
//                     <span className="text-gray-500 select-none">
//                       {line.startsWith(">") ? "$" : " "}
//                     </span>
//                     <span
//                       className={
//                         line.startsWith(">")
//                           ? "text-green-400"
//                           : "text-gray-300"
//                       }
//                     >
//                       {line.replace(/^> /, "")}
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default EditorPage;


import React, { useState, useEffect, useCallback } from "react";
import {
  Files,
  Settings,
  Play,
  X,
  LogOut,
  MessageSquare,
  Users,
} from "lucide-react";

import Navbar from "../components/helper/Navbar";
import FileExplorerView from "../components/editor/FileExplorerView";
import ChatView from "../components/editor/ChatView";
import SettingsView from "../components/editor/SettingsView";
import OnlineUsersView from "../components/editor/OnlineUsersView";

import { useAuth } from "../context/AuthContext";
import { useParams , useNavigate} from "react-router-dom";

import { useSocket } from "../context/SocketContext";
import { useCode } from "../context/CodeContext";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";

import { useRunCode } from "../context/RunCodeContext";
import { useFileSystem } from "../context/FileContext";

const languageMap = {
  js: "JS",
  jsx: "JSX",
  ts: "TS",
  tsx: "TSX",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  md: "MD",
  py: "PY",
  java: "JAVA",
  cpp: "C++",
  c: "C",
  default: "",
};

const getExtension = (fileName) => {
  if (!fileName) return "";
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

const EditorPage = () => {
  const { user } = useAuth();
  const { projectId } = useParams();

  const navigate = useNavigate();

  const { socket } = useSocket();
  const { tree } = useFileSystem();

  const {
    users,
    settings,
    fileTree,
    runOutput,
    leaveProject,
    initialContents,
    emitRunOutput,
  } = useCode();

  const { runCode } = useRunCode();

  const [activeFile, setActiveFile] = useState(null);
  const [fileContents, setFileContents] = useState({});
  const [content, setContent] = useState("// Loading...");

  // -------------------------------------------------------------
  // 1️⃣ LOAD INITIAL CONTENTS & SET FIRST FILE AUTOMATICALLY
  // -------------------------------------------------------------
  useEffect(() => {
    if (!initialContents) return;

    setFileContents(initialContents);

    // Find first file
    const findFirstFile = (nodes) => {
      for (const n of nodes) {
        if (n.type === "file") return n.id;
        if (n.children?.length) {
          const res = findFirstFile(n.children);
          if (res) return res;
        }
      }
      return null;
    };

    const first = findFirstFile(fileTree);
    if (first) {
      setActiveFile(first);

      // load its content immediately
      if (initialContents[first]) {
        setContent(initialContents[first]);
      }
    }
  }, [initialContents, fileTree]);

  // -------------------------------------------------------------
  // 2️⃣ UPDATE CONTENT WHEN ACTIVE FILE CHANGES
  // -------------------------------------------------------------
  useEffect(() => {
    if (!activeFile) {
      setContent("// Open a file to begin…");
      return;
    }

    const txt = fileContents[activeFile];
    setContent(txt ?? "// Empty file");
  }, [activeFile, fileContents]);

  // -------------------------------------------------------------
  // 3️⃣ HANDLE EDITOR CHANGE → SEND PATCHES
  // -------------------------------------------------------------
  const handleEditorChange = useCallback(
    (value, viewUpdate) => {
      if (!activeFile) return;

      const patches = [];
      if (viewUpdate?.changes?.iterChanges) {
        viewUpdate.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
          patches.push({
            from: fromA,
            to: toA,
            insert: inserted.toString(),
          });
        });
      }

      setFileContents((prev) => ({ ...prev, [activeFile]: value }));
      setContent(value);

      if (patches.length > 0) {
        socket.emit("editorChangeDelta", {
          projectId,
          nodeId: activeFile,
          patches,
        });
      }
    },
    [socket, activeFile, projectId]
  );

  // -------------------------------------------------------------
  // 4️⃣ APPLY REMOTE PATCHES
  // -------------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const applyRemote = ({ nodeId, patches }) => {
      setFileContents((prev) => {
        const next = { ...prev };
        let txt = next[nodeId] ?? "";

        patches.forEach((p) => {
          txt = txt.slice(0, p.from) + p.insert + txt.slice(p.to);
        });

        next[nodeId] = txt;
        return next;
      });

      if (nodeId === activeFile) {
        setContent((prev) => {
          let txt = prev;
          patches.forEach((p) => {
            txt = txt.slice(0, p.from) + p.insert + txt.slice(p.to);
          });
          return txt;
        });
      }
    };

    socket.on("editorChangeDelta", applyRemote);
    return () => socket.off("editorChangeDelta", applyRemote);
  }, [socket, activeFile]);

  // -------------------------------------------------------------
  // 5️⃣ FIND FILE NODE
  // -------------------------------------------------------------
  const findNode = (nodes, id) => {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children?.length) {
        const res = findNode(n.children, id);
        if (res) return res;
      }
    }
    return null;
  };

  const activeNode = activeFile ? findNode(tree, activeFile) : null;
  const activeFileName = activeNode?.name || "No File Selected";

  const ext = getExtension(activeFileName);
  const langLabel = languageMap[ext] || "";
  const onlineCount = users.length || 0;

  // -------------------------------------------------------------
  // 6️⃣ SAVE FILE (CTRL + S)
  // -------------------------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      const mac = navigator.platform.toUpperCase().includes("MAC");
      const save = (mac && e.metaKey && e.key === "s") ||
                   (!mac && e.ctrlKey && e.key === "s");

      if (!save) return;

      e.preventDefault();
      if (!activeFile) return emitRunOutput("❌ No file selected.");

      socket.emit("saveFile", {
        projectId,
        nodeId: activeFile,
        content: fileContents[activeFile] ?? content,
      });

      emitRunOutput(`> Saved ${activeFileName}`);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeFile, fileContents, content, socket, emitRunOutput, projectId, activeFileName]);

  // -------------------------------------------------------------
  // 7️⃣ RUN FILE
  // -------------------------------------------------------------
  const handleRun = async () => {
    if (!activeFile) return emitRunOutput("❌ No file selected.");

    const code = fileContents[activeFile] ?? content;

    emitRunOutput("> Running...");

    try {
      const result = await runCode({
        fileName: activeFileName,
        content: code,
      });

      if (!result) {
        emitRunOutput("> (no output)");
        return;
      }

      result.split("\n").forEach((line) => emitRunOutput(line));
    } catch (err) {
      emitRunOutput(`❌ Run error: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // UI BELOW — UNTOUCHED
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState("files");

  const ActivityBarIcon = ({ icon: Icon, tabName }) => (
    <div
      onClick={() => setActiveTab(tabName)}
      className={`p-3 cursor-pointer rounded-md transition ${
        activeTab === tabName
          ? "text-white bg-white/10"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-6 h-6" />
    </div>
  );

  const renderSidebarContent = () => {
    switch (activeTab) {
      case "files":
        return (
          <FileExplorerView
            fileStructure={fileTree}
            activeFile={activeFile}
            onFileSelect={setActiveFile}
          />
        );
      case "chat":
        return <ChatView projectId={projectId} />;
      case "users":
        return <OnlineUsersView currentUser={user} />;
      case "settings":
        return <SettingsView projectId={projectId} currentUser={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#1e1e1e]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[60px] bg-[#252526] border-r border-[#333] flex flex-col justify-between py-4">
          <div className="flex flex-col gap-3">
            <ActivityBarIcon icon={Files} tabName="files" />
            <ActivityBarIcon icon={MessageSquare} tabName="chat" />
            <ActivityBarIcon icon={Users} tabName="users" />
          </div>
          <ActivityBarIcon icon={Settings} tabName="settings" />
        </aside>

        <aside className="w-64 bg-[#252526] border-r border-[#333] overflow-auto">
          {renderSidebarContent()}
        </aside>

        {/* MAIN PANE */}
        <main className="flex-1 flex flex-col bg-[#1e1e1e] min-w-0">
          {/* TOP BAR */}
          <div className="h-[40px] bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between">
            <div className="flex items-center h-full">
              <div className="bg-[#2d2d2d] h-full flex items-center gap-2 px-4 border-r border-[#333]">
                <span className="text-[#f1e05a] text-sm font-bold">{langLabel}</span>
                <span className="text-gray-200 text-sm">
                  {activeNode?.type === "file" ? activeFileName : "No File Selected"}
                </span>

                {activeFile && (
                  <X
                    className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer ml-2"
                    onClick={() => setActiveFile(null)}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 px-4">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {onlineCount} Online
              </span>

              <button
                onClick={() => {
                  leaveProject(projectId);     // notify server
                  navigate("/dashboard");      // redirect instantly
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Leave Project
              </button>

              <button
                onClick={handleRun}
                className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm flex items-center gap-1.5"
              >
                <Play className="w-4 h-4" /> Run
              </button>
            </div>
          </div>

          {/* EDITOR */}
          <div className="flex-1 overflow-auto min-h-0">
            <CodeMirror
              value={content}
              height="100%"
              theme={settings?.theme === "dark" ? "dark" : "light"}
              extensions={[javascript(), EditorView.lineWrapping]}
              onChange={handleEditorChange}
              className="h-full"
            />
          </div>

          {/* TERMINAL */}
          <div className="h-[200px] flex flex-col border-t border-[#333]">
            <div className="flex items-center px-4 h-[40px] bg-[#1e1e1e] text-gray-400">
              <span className="text-white border-b-2 border-white py-2 px-2">TERMINAL</span>
              <span className="py-2 px-2 hover:text-white cursor-pointer">PROBLEMS</span>
              <span className="py-2 px-2 hover:text-white cursor-pointer">OUTPUT</span>
              <span className="py-2 px-2 hover:text-white cursor-pointer">DEBUG CONSOLE</span>
            </div>

            <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-[#2d2d2d] text-gray-300">
              {(!runOutput || runOutput.length === 0) ? (
                <p className="text-gray-500">Click 'Run' to start…</p>
              ) : (
                runOutput.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-gray-500 select-none">
                      {line.startsWith(">") ? "$" : " "}
                    </span>
                    <span className={line.startsWith(">") ? "text-green-400" : ""}>
                      {line.replace(/^> /, "")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorPage;
