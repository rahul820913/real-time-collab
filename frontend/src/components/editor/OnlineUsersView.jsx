import React from "react";
import { MoreHorizontal, Circle } from "lucide-react";

import { useCode } from "../../context/CodeContext";

const OnlineUsersView = ({currentUser }) => {
  const { users } = useCode(); // ✅ users from shared SocketContext
  

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white border-l border-gray-700">
      {/* Header */}
      <div className="h-[35px] px-4 flex items-center text-[11px] font-semibold tracking-wider text-[#bbbbbb]">
        ONLINE USERS
        <MoreHorizontal className="w-4 h-4 ml-auto opacity-60 cursor-pointer hover:opacity-100" />
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {users.length === 0 && (
          <p className="text-xs text-gray-500 italic px-2">No users online</p>
        )}

        {users.map((user, index) => {
          const isYou = user.name === currentUser?.result.fullName;
          const color =
            user.status === "away"
              ? "bg-yellow-500"
              : user.status === "offline"
              ? "bg-gray-500"
              : "bg-green-500";

          return (
            <div
              key={user.id || index}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors duration-150 ${
                isYou ? "bg-[#2a2d2e]" : "hover:bg-[#2a2d2e]"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={`https://i.pravatar.cc/150?u=${user.id || user.name}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#252526] ${color}`}
                />
              </div>

              {/* User Info */}
              <div className="flex flex-col">
                <span className="text-[13px] text-[#cccccc] truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-gray-500">
                  {isYou ? "You" : "Online"}
                </span>
              </div>

              {/* Status Icon */}
              <div className="ml-auto text-gray-500 opacity-60">
                <Circle size={10} fill={isYou ? "#00b894" : "#777"} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnlineUsersView;
