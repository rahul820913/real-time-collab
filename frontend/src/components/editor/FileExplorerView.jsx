// import React, { useState, useEffect } from "react";
// import { ChevronDown, FolderPlus, FilePlus2, MoreHorizontal } from "lucide-react";
// import { useSocket } from "../../context/SocketContext"; // adjust if your path differs
// import FileTree from "./FileTree"; // expects default export
// import NewEntryInput from "../helper/NewEntryInput"; // adjust if your path differs

// const FileExplorerView = ({ projectId, activeFile, setActiveFile }) => {
//   const { fileTree: serverTree = [], emitFileTreeUpdate, socket } = useSocket() || {};
//   const [localTree, setLocalTree] = useState(serverTree || []);
//   const [createState, setCreateState] = useState(null); // { type: 'file'|'folder', parentPath: string|null }
//   const [renameState, setRenameState] = useState(null); // { path }

//   useEffect(() => {
//     setLocalTree(serverTree || []);
//   }, [serverTree]);

//   // -------------------------
//   // Tree helpers (pure functions)
//   // -------------------------
//   const insertIntoTree = (tree, parentPath, entry) => {
//     if (!parentPath) return [...tree, entry];

//     return tree.map((node) => {
//       if (node.path === parentPath && node.type === "folder") {
//         return { ...node, children: [...(node.children || []), entry] };
//       }
//       if (node.children) return { ...node, children: insertIntoTree(node.children, parentPath, entry) };
//       return node;
//     });
//   };

//   const deleteFromTree = (tree, path) => {
//     return tree
//       .filter((n) => n.path !== path)
//       .map((n) => (n.children ? { ...n, children: deleteFromTree(n.children, path) } : n));
//   };

//   const renameInTree = (tree, path, newName) => {
//     return tree.map((node) => {
//       if (node.path === path) {
//         const parent = path.split("/").slice(0, -1).join("/");
//         const newPath = parent ? `${parent}/${newName}` : newName;
//         let updated = { ...node, name: newName, path: newPath };

//         // if renaming a folder, update all descendant paths
//         if (updated.type === "folder" && updated.children) {
//           const oldPrefix = `${path}/`;
//           const newPrefix = `${newPath}/`;
//           const updateDescendants = (children) =>
//             children.map((c) => {
//               const cCopy = { ...c };
//               if (cCopy.path && cCopy.path.startsWith(oldPrefix)) {
//                 cCopy.path = cCopy.path.replace(oldPrefix, newPrefix);
//               }
//               if (cCopy.children) cCopy.children = updateDescendants(cCopy.children);
//               return cCopy;
//             });
//           updated.children = updateDescendants(updated.children);
//         }

//         return updated;
//       }

//       if (node.children) return { ...node, children: renameInTree(node.children, path, newName) };
//       return node;
//     });
//   };

//   // -------------------------
//   // Actions
//   // -------------------------
//   const handleCreate = (name) => {
//     if (!createState) return;
//     const parent = createState.parentPath; // null for root
//     const path = parent ? `${parent}/${name}` : name;
//     const entry = { type: createState.type, name, path, ...(createState.type === "folder" && { children: [] }) };

//     const updated = insertIntoTree(localTree, parent, entry);
//     setLocalTree(updated);
//     emitFileTreeUpdate?.(updated);
//     // Optionally notify socket directly:
//     socket?.emit?.("fileTreeUpdate", { projectId, tree: updated });

//     setCreateState(null);
//   };

//   const handleCancelCreate = () => setCreateState(null);

//   const handleRenameComplete = (newName) => {
//     if (!renameState) return;
//     const updated = renameInTree(localTree, renameState.path, newName);
//     setLocalTree(updated);
//     emitFileTreeUpdate?.(updated);
//     socket?.emit?.("fileTreeUpdate", { projectId, tree: updated });
//     setRenameState(null);
//   };

//   const handleDelete = (path) => {
//     const updated = deleteFromTree(localTree, path);
//     setLocalTree(updated);
//     emitFileTreeUpdate?.(updated);
//     socket?.emit?.("fileTreeUpdate", { projectId, tree: updated });

//     if (activeFile === path) setActiveFile?.(null);
//   };

//   return (
//     <div className="flex flex-col h-full bg-[#1e1e1e] text-white border-r border-gray-700">
//       {/* Header */}
//       <div className="h-[35px] px-4 flex items-center text-[11px] font-semibold tracking-wider text-[#bbbbbb]">
//         EXPLORER
//         <div className="ml-auto flex gap-2 items-center">
//           <button
//             title="Add Folder (root)"
//             onClick={() => setCreateState({ type: "folder", parentPath: null })}
//             className="opacity-70 hover:opacity-100 transition"
//           >
//             <FolderPlus className="w-4 h-4 text-yellow-400" />
//           </button>

//           <button
//             title="Add File (root)"
//             onClick={() => setCreateState({ type: "file", parentPath: null })}
//             className="opacity-70 hover:opacity-100 transition"
//           >
//             <FilePlus2 className="w-4 h-4 text-green-400" />
//           </button>

//           <MoreHorizontal className="w-4 h-4 text-gray-400 opacity-60 cursor-pointer hover:opacity-100" />
//         </div>
//       </div>

//       {/* Body */}
//       <div className="flex-1 overflow-auto">
//         <div className="flex items-center gap-1 py-1 px-3 font-bold text-[11px] text-white cursor-pointer">
//           <ChevronDown className="w-4 h-4" />
//           PROJECT
//         </div>

//         <div className="mt-1">
//           {/* Show create input */}
//           {createState && (
//             <NewEntryInput type={createState.type} onComplete={handleCreate} onCancel={handleCancelCreate} />
//           )}

//           {/* Show rename input */}
//           {renameState && (
//             <NewEntryInput
//               type="rename"
//               defaultValue={renameState.path.split("/").at(-1)}
//               onComplete={handleRenameComplete}
//               onCancel={() => setRenameState(null)}
//             />
//           )}

//           <FileTree
//             nodes={localTree}
//             activeFile={activeFile}
//             setActiveFile={setActiveFile}
//             projectId={projectId}
//             onCreateInside={(type, parentPath) => setCreateState({ type, parentPath })}
//             onRename={(path) => setRenameState({ path })}
//             onDelete={(path) => handleDelete(path)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileExplorerView;




import React, { useState } from "react";
import {
  ChevronDown,
  FolderPlus,
  FilePlus2,
  MoreHorizontal,
} from "lucide-react";
import { useFileSystem } from "../../context/FileContext";
import FileTree from "./FileTree";
import NewEntryInput from "../helper/NewEntryInput";

const FileExplorerView = ({ activeFile, onFileSelect }) => {
  const { tree, createNode, renameNode, deleteNode } = useFileSystem();

  const [createState, setCreateState] = useState(null);
  const [renameState, setRenameState] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // ---------------------------
  // Internal safe node finder
  // ---------------------------
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

  // ---------------------------
  // SELECT NODE (file or folder)
  // ---------------------------
  const handleSelectNode = (node) => {
    if (!node) return;

    if (node.type === "directory") {
      setSelectedFolderId(node.id);
      return; // Do not open in editor
    }

    // File clicked
    setSelectedFolderId(node.parentId ?? null);
    onFileSelect(node.id);
  };

  // ---------------------------
  // CREATE
  // ---------------------------
  const handleCreate = async (name) => {
    if (!createState) return;

    await createNode({
      name,
      type: createState.type,
      parentId: createState.parentId,
    });

    setCreateState(null);
  };

  // ---------------------------
  // RENAME
  // ---------------------------
  const handleRename = async (newName) => {
    if (!renameState) return;

    await renameNode(renameState.nodeId, newName);
    setRenameState(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white border-r border-gray-700">

      {/* HEADER */}
      <div className="h-[35px] px-4 flex items-center text-[11px] font-semibold tracking-wider text-[#bbbbbb]">
        EXPLORER

        <div className="ml-auto flex gap-2 items-center">
          <button
            onClick={() =>
              setCreateState({
                type: "directory",
                parentId: selectedFolderId ?? null,
              })
            }
          >
            <FolderPlus className="w-4 h-4 text-yellow-300" />
          </button>

          <button
            onClick={() =>
              setCreateState({
                type: "file",
                parentId: selectedFolderId ?? null,
              })
            }
          >
            <FilePlus2 className="w-4 h-4 text-green-300" />
          </button>

          <MoreHorizontal className="w-4 h-4 opacity-70" />
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-auto">

        <div className="flex items-center gap-1 py-1 px-3 font-bold text-[11px]">
          <ChevronDown className="w-4 h-4" />
          PROJECT
        </div>

        {/* CREATE INPUT */}
        {createState && (
          <div className="pl-4">
            <NewEntryInput
              type={createState.type}
              onComplete={handleCreate}
              onCancel={() => setCreateState(null)}
            />
          </div>
        )}

        {/* RENAME INPUT */}
        {renameState && (
          <div className="pl-4">
            <NewEntryInput
              type="rename"
              defaultValue={renameState.oldName}
              onComplete={handleRename}
              onCancel={() => setRenameState(null)}
            />
          </div>
        )}

        {/* TREE */}
        <FileTree
          nodes={tree}
          activeFile={activeFile}
          onFileSelect={(id) => {
            const node = findNode(tree, id);
            if (!node) return;

            if (node.type === "directory") {
              setSelectedFolderId(node.id);
              return;
            }

            setSelectedFolderId(node.parentId ?? null);
            onFileSelect(id);
          }}
          onRename={(nodeId, oldName) => setRenameState({ nodeId, oldName })}
          onDelete={(nodeId) => deleteNode(nodeId)}
        />
      </div>
    </div>
  );
};

export default FileExplorerView;
