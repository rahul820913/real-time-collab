import React, { useState, useEffect, useRef } from "react";
import { Folder, File } from "lucide-react";

const NewEntryInput = ({ type, onComplete, onCancel }) => {
    const [name, setName] = useState("");
    const inputRef = useRef(null);
  
    useEffect(() => {
      inputRef.current?.focus();
    }, []);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (name.trim()) {
        onComplete(name.trim());
      } else {
        onCancel();
      }
    };
  
    const handleBlur = () => {
      onCancel();
    };
  
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="pl-4 pr-2 py-1">
        <div className="flex items-center gap-1">
          {type === "folder" ? (
            <Folder className="w-4 h-4 text-blue-400" />
          ) : (
            <File className="w-4 h-4 text-yellow-400" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-[#333] text-white text-sm focus:outline-none w-full"
            placeholder={type === "folder" ? "New folder..." : "New file..."}
          />
        </div>
      </form>
    );
  };
  
  export default NewEntryInput;