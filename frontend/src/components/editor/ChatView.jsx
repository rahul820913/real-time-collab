import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

import { useSocket } from "../../context/SocketContext";
import { useCode } from "../../context/CodeContext";
import { useAuth } from "../../context/AuthContext";

import { fetchMessages } from "../../API/messagesApi";

const ChatView = ({ projectId }) => {
  const {socket} = useSocket();
  const { users, emitChatMessage } = useCode();
  const { user } = useAuth();

  const currentUser = user?.result?.fullName || "Unknown";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // -----------------------------------------------------------------
  // LOAD HISTORY
  // -----------------------------------------------------------------
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const old = await fetchMessages(projectId);
        setMessages(old || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    loadMessages();
  }, [projectId]);

  // -----------------------------------------------------------------
  // RECEIVE CHAT MESSAGES
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const onMsg = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chatMessage", onMsg);
    return () => socket.off("chatMessage", onMsg);
  }, [socket]);

  // -----------------------------------------------------------------
  // AUTO SCROLL
  // -----------------------------------------------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -----------------------------------------------------------------
  // SEND TYPING SIGNAL
  // -----------------------------------------------------------------
  const handleTyping = (e) => {
    setInput(e.target.value);

    if (!socket) return;

    socket.emit("typing", {
      projectId,
      name: currentUser,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        projectId,
        name: currentUser,
      });
    }, 2000);
  };

  // -----------------------------------------------------------------
  // RECEIVE TYPING EVENTS
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const onTyping = ({ name }) => {
      if (name !== currentUser) {
        setTypingUsers((prev) =>
          prev.includes(name) ? prev : [...prev, name]
        );
      }
    };

    const onStop = ({ name }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== name));
    };

    socket.on("userTyping", onTyping);
    socket.on("userStopTyping", onStop);

    return () => {
      socket.off("userTyping", onTyping);
      socket.off("userStopTyping", onStop);
    };
  }, [socket, currentUser]);

  // -----------------------------------------------------------------
  // SEND MESSAGE
  // -----------------------------------------------------------------
  const handleSend = () => {
    if (!input.trim()) return;

    emitChatMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white overflow-hidden">

      {/* HEADER */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-200">
          Project Chat{" "}
          <span className="text-xs text-gray-400">
            ({users?.length ?? 0} online)
          </span>
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, idx) => {
          const mine = msg.user === currentUser;

          return (
            <div
              key={idx}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-2 rounded-lg shadow ${
                  mine
                    ? "bg-[#007fd4] text-white"
                    : "bg-[#2c2c2c] text-gray-200"
                }`}
              >
                <span className="block text-[10px] opacity-70 mb-1">
                  {mine ? "You" : msg.user}
                </span>

                <p className="text-sm">{msg.message}</p>

                <span className="text-[9px] opacity-50 block text-right mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing */}
        {typingUsers.length > 0 && (
          <div className="text-xs text-gray-400 italic">
            {typingUsers.join(", ")} typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="flex border-t border-gray-700 p-2 bg-[#252526]">
        <input
          type="text"
          className="flex-1 bg-[#333] px-3 py-2 rounded-l-md text-sm focus:outline-none placeholder-gray-400"
          placeholder="Type a message..."
          value={input}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`px-4 py-2 rounded-r-md flex items-center justify-center ${
            input.trim()
              ? "bg-[#007fd4] hover:bg-[#005fa3]"
              : "bg-[#555] cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatView;
