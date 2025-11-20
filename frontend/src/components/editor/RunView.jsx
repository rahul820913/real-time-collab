import React, { useState, useEffect, useRef } from "react";
import { Play, MoreHorizontal, TerminalSquare } from "lucide-react";
import { useSocket } from "../../context/SocketContext";

const RunView = ({ projectId, currentUser }) => {
  const { socket } = useSocket();
  const [outputLines, setOutputLines] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef(null);

  // Username fallback
  const currentUserName =
    currentUser?.result?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    "Guest";

  // Scroll terminal
  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [outputLines]);

  // Listen to socket events
  useEffect(() => {
    if (!socket) return;

    socket.emit("joinProject", { projectId, name: currentUserName });

    const handleRunStart = ({ user }) => {
      setOutputLines((prev) => [
        ...prev,
        `🚀 ${user} started running the project...`,
      ]);
      setIsRunning(true);
    };

    const handleRunOutput = (data) => {
      // ---- FIX ----
      const safeLine =
        typeof data === "string"
          ? data
          : typeof data?.line === "string"
          ? data.line
          : JSON.stringify(data);

      setOutputLines((prev) => [...prev, safeLine]);
    };

    const handleRunEnd = () => {
      setOutputLines((prev) => [...prev, "✅ Process finished."]);
      setIsRunning(false);
    };

    socket.on("runStart", handleRunStart);
    socket.on("runOutput", handleRunOutput);
    socket.on("runEnd", handleRunEnd);

    return () => {
      socket.off("runStart", handleRunStart);
      socket.off("runOutput", handleRunOutput);
      socket.off("runEnd", handleRunEnd);
    };
  }, [socket, projectId, currentUserName]);

  // Start run
  const handleRun = () => {
    if (!socket || isRunning) return;

    setOutputLines([`> Starting project for ${projectId}...`]);
    setIsRunning(true);

    socket.emit("runStart", {
      projectId,
      user: currentUserName,
    });

    const steps = [
      "✔ Installing dependencies...",
      "✔ Compiling modules...",
      "✔ Optimizing chunks...",
      "⚙️ Starting dev server...",
      "Local: http://localhost:5173",
      "VITE v5.2.0 ready in 1420 ms",
    ];

    steps.forEach((msg, i) => {
      setTimeout(() => {
        socket.emit("runOutput", { projectId, line: msg });
        setOutputLines((prev) => [...prev, msg]);

        if (i === steps.length - 1) {
          socket.emit("runEnd", { projectId });
          setIsRunning(false);
        }
      }, 600 * (i + 1));
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white border-l border-gray-700">
      <div className="h-[35px] px-4 flex items-center text-[11px] font-semibold text-[#bbbbbb]">
        RUN & DEBUG
        <MoreHorizontal className="w-4 h-4 ml-auto opacity-60 cursor-pointer hover:opacity-100" />
      </div>

      <div className="flex-1 overflow-auto p-3">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-md text-[13px] font-medium transition ${
            isRunning
              ? "bg-[#444] text-gray-300 cursor-not-allowed"
              : "bg-[#0e639c] hover:bg-[#1177ba] text-white"
          }`}
        >
          <Play className="w-4 h-4" />
          {isRunning ? "Running..." : "Run Project (npm run dev)"}
        </button>

        <div className="mt-4">
          <h3 className="text-[11px] font-semibold text-[#bbbbbb] mb-2 flex items-center gap-1">
            <TerminalSquare className="w-4 h-4" /> OUTPUT
          </h3>

          <div
            ref={terminalRef}
            className="bg-[#252526] p-2 rounded-md h-60 font-mono text-[12px] text-[#cccccc] overflow-auto border border-[#333]"
          >
            {outputLines.length === 0 ? (
              <p className="text-gray-500 italic">No output yet...</p>
            ) : (
              outputLines.map((line, i) => {
                const safeLine = String(line || "");

                return (
                  <p
                    key={i}
                    className={`whitespace-pre-wrap break-words ${
                      safeLine.includes("Error")
                        ? "text-[#f44747]"
                        : safeLine.includes("✔")
                        ? "text-green-400"
                        : safeLine.includes("VITE") ||
                          safeLine.includes("Local:")
                        ? "text-[#6a9955]"
                        : ""
                    }`}
                  >
                    {safeLine}
                  </p>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunView;
