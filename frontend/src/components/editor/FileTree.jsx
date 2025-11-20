// import React, { useState, useEffect } from "react";
// import {
//   ChevronRight,
//   ChevronDown,
//   FileCode2,
//   Folder,
//   FolderOpen,
//   FolderPlus,
//   FilePlus2,
// } from "lucide-react";
// import { useSocket } from "../../context/SocketContext"; // adjust path if needed

// const FileTree = ({
//   nodes = [],
//   depth = 0,
//   activeFile,
//   setActiveFile,
//   parentPath = "",
//   projectId,
//   onCreateInside,
//   onRename,
//   onDelete,
// }) => {
//   const [expandedFolders, setExpandedFolders] = useState({});
//   const { socket } = useSocket() || {};

//   // Sync folder toggle from server/other clients
//   useEffect(() => {
//     if (!socket) return;
//     const onToggle = ({ projectId: pid, folderPath }) => {
//       if (pid === projectId) setExpandedFolders((p) => ({ ...p, [folderPath]: !p[folderPath] }));
//     };
//     socket.on("folderToggled", onToggle);
//     return () => socket.off("folderToggled", onToggle);
//   }, [socket, projectId]);

//   const toggleFolder = (path) => {
//     setExpandedFolders((p) => ({ ...p, [path]: !p[path] }));
//     socket?.emit?.("folderToggled", { projectId, folderPath: path });
//   };

//   const handleFileClick = (path) => {
//     setActiveFile?.(path);
//     socket?.emit?.("fileSelected", { projectId, filePath: path, user: socket?.id });
//   };

//   return (
//     <>
//       {nodes.map((node) => {
//         const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
//         const isFolder = node.type === "folder";
//         const isExpanded = !!expandedFolders[fullPath];
//         const isActive = activeFile === fullPath;

//         return (
//           <div key={fullPath}>
//             <div
//               className={`flex items-center gap-1 py-[3px] px-2 cursor-pointer ${
//                 isActive && !isFolder ? "bg-[#37373d] border-l-2 border-[#007fd4]" : "text-[#cccccc]"
//               }`}
//               style={{ paddingLeft: `${depth * 12 + 8}px` }}
//               onClick={() => (isFolder ? toggleFolder(fullPath) : handleFileClick(fullPath))}
//             >
//               {isFolder ? (
//                 isExpanded ? (
//                   <ChevronDown className="w-4 h-4 opacity-70" />
//                 ) : (
//                   <ChevronRight className="w-4 h-4 opacity-70" />
//                 )
//               ) : (
//                 <FileCode2 className="w-4 h-4 text-[#89ddff]" />
//               )}

//               {isFolder ? (
//                 isExpanded ? (
//                   <FolderOpen className="w-4 h-4 text-[#e7a33e]" />
//                 ) : (
//                   <Folder className="w-4 h-4 text-[#e7a33e]" />
//                 )
//               ) : null}

//               <span className="ml-1 text-[13px] select-none">{node.name}</span>

//               <div className="ml-auto flex gap-1 opacity-0 hover:opacity-100 transition">
//                 {isFolder && (
//                   <>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onCreateInside?.("folder", fullPath);
//                       }}
//                       title="New folder inside"
//                     >
//                       <FolderPlus className="w-4 h-4 text-yellow-300" />
//                     </button>

//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onCreateInside?.("file", fullPath);
//                       }}
//                       title="New file inside"
//                     >
//                       <FilePlus2 className="w-4 h-4 text-green-300" />
//                     </button>
//                   </>
//                 )}

//                 {/* Rename */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onRename?.(fullPath);
//                   }}
//                   title="Rename"
//                 >
//                   ✏️
//                 </button>

//                 {/* Delete */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     // Confirm before deleting — optional but helpful
//                     const ok = window.confirm(`Delete "${node.name}"${isFolder ? " and its children" : ""}?`);
//                     if (ok) onDelete?.(fullPath);
//                   }}
//                   title="Delete"
//                 >
//                   🗑️
//                 </button>
//               </div>
//             </div>

//             {/* children */}
//             {isFolder && isExpanded && (
//               <>
//                 {node.children && node.children.length > 0 ? (
//                   <FileTree
//                     nodes={node.children}
//                     depth={depth + 1}
//                     activeFile={activeFile}
//                     setActiveFile={setActiveFile}
//                     parentPath={fullPath}
//                     projectId={projectId}
//                     onCreateInside={onCreateInside}
//                     onRename={onRename}
//                     onDelete={onDelete}
//                   />
//                 ) : (
//                   <div className="text-gray-500 text-xs pl-10 py-1" style={{ paddingLeft: `${depth * 12 + 32}px` }}>
//                     (empty)
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         );
//       })}
//     </>
//   );
// };

// export default FileTree;
import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileCode2,
  Folder,
  FolderOpen,
} from "lucide-react";

import { useSocket } from "../../context/SocketContext";

const FileTree = ({
  nodes = [],
  depth = 0,
  activeFile,
  onFileSelect,   // <-- FIX: consistent prop name
  onRename,
  onDelete,
}) => {

  const [expanded, setExpanded] = useState({});
  const { socket } = useSocket() || {};

  // -------------------------------------------
  // Sync folder toggles across clients
  // -------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const handleToggle = ({ folderId }) => {
      setExpanded((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
    };

    socket.on("folderToggled", handleToggle);
    return () => socket.off("folderToggled", handleToggle);
  }, [socket]);

  // -------------------------------------------
  // Toggle folder open/close
  // -------------------------------------------
  const toggleFolder = (node) => {
    setExpanded((prev) => ({ ...prev, [node.id]: !prev[node.id] }));

    socket?.emit?.("folderToggled", { folderId: node.id });
  };

  // -------------------------------------------
  // File click → open in editor
  // -------------------------------------------
  const handleFileClick = (node) => {
    onFileSelect?.(node.id, node);

    socket?.emit?.("fileSelected", {
      nodeId: node.id,
      fileName: node.name,
    });
  };

  return (
    <div>
      {nodes.map((node) => {
        const isFolder = node.type === "directory";
        const isExpanded = expanded[node.id] || false;
        const isActive = activeFile === node.id;

        return (
          <div key={node.id}>
            {/* Row */}
            <div
              className={`flex items-center gap-1 py-[3px] px-2 cursor-pointer ${
                isActive && !isFolder
                  ? "bg-[#37373d] border-l-2 border-[#007fd4]"
                  : "text-[#cccccc]"
              }`}
              style={{ paddingLeft: `${depth * 14}px` }}
              onClick={() =>
                isFolder ? toggleFolder(node) : handleFileClick(node)
              }
            >
              {/* Arrow */}
              {isFolder ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 opacity-70" />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-70" />
                )
              ) : (
                <FileCode2 className="w-4 h-4 text-[#89ddff]" />
              )}

              {/* Folder Icon */}
              {isFolder &&
                (isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-[#e7a33e]" />
                ) : (
                  <Folder className="w-4 h-4 text-[#e7a33e]" />
                ))}

              {/* Name */}
              <span className="ml-1 text-[13px] select-none">{node.name}</span>

              {/* Actions (rename/delete) */}
              <div className="ml-auto flex gap-1 opacity-0 hover:opacity-100 transition">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRename?.(node.id, node.name);
                  }}
                >
                  ✏️
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        `Delete "${node.name}"${
                          isFolder ? " and all its files?" : "?"
                        }`
                      )
                    ) {
                      onDelete?.(node.id);
                    }
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* CHILDREN */}
            {isFolder && isExpanded && (
              <FileTree
                nodes={node.children || []}
                depth={depth + 1}
                activeFile={activeFile}
                onFileSelect={onFileSelect}
                onRename={onRename}
                onDelete={onDelete}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FileTree;
