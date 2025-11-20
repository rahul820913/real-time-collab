import React, { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import { useSocket } from "../../context/SocketContext";

const SettingsView = ({ projectId , currentUser }) => {
  const { socket } = useSocket(); // ✅ shared socket from context
  const [settings, setSettings] = useState({ theme: "dark", fontSize: 14 });
  const [searchTerm, setSearchTerm] = useState("");

  // --- Listen for settings updates from other collaborators ---
  useEffect(() => {
    if (!socket) return;

    socket.emit("joinProject", { projectId, name: currentUser.name });

    const handleSettingsUpdate = (updated) => {
      console.log("⚙️ Settings updated in real-time:", updated);
      setSettings(updated);
    };

    socket.on("settingsUpdate", handleSettingsUpdate);
    return () => socket.off("settingsUpdate", handleSettingsUpdate);
  }, [socket, projectId, currentUser.name]);

  // --- Broadcast setting changes ---
  const handleSettingChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    socket?.emit("updateSettings", { projectId, settings: updated });
  };

  // --- Reset all settings to default ---
  const resetToDefaults = () => {
    const defaults = { theme: "dark", fontSize: 14 };
    setSettings(defaults);
    socket?.emit("updateSettings", { projectId, settings: defaults });
  };

  // --- Filtered view based on search ---
  const filteredSettings = Object.keys(settings)
    .filter((key) => key.toLowerCase().includes(searchTerm.toLowerCase()))
    .reduce((acc, key) => ({ ...acc, [key]: settings[key] }), {});

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white border-l border-gray-700">
      {/* Header */}
      <div className="h-[35px] px-4 flex items-center text-[11px] font-semibold tracking-wider text-[#bbbbbb]">
        SETTINGS
        <RefreshCw
          className="w-4 h-4 ml-auto opacity-60 cursor-pointer hover:opacity-100"
          onClick={resetToDefaults}
          title="Reset to defaults"
        />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-3">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-[#858585] absolute top-1/2 left-2.5 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Settings"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#3c3c3c] text-[#cccccc] text-[13px] pl-8 pr-3 py-1.5 rounded-md border border-[#444444] focus:outline-none focus:border-[#007fd4]"
          />
        </div>

        {/* Settings List */}
        <div className="space-y-2 text-[13px]">
          <h3 className="text-[11px] font-semibold text-[#bbbbbb] mb-1">Common</h3>

          {/* Theme */}
          {filteredSettings.theme !== undefined && (
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-[#2a2d2e] transition">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={(e) => handleSettingChange("theme", e.target.value)}
                className="bg-[#3c3c3c] text-[#cccccc] text-[12px] p-1 rounded-md border border-[#444444]"
              >
                <option value="dark">Dark Modern (Default)</option>
                <option value="light">Light Modern</option>
              </select>
            </div>
          )}

          {/* Font Size */}
          {filteredSettings.fontSize !== undefined && (
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-[#2a2d2e] transition">
              <label htmlFor="fontSize">Font Size</label>
              <input
                type="number"
                id="fontSize"
                name="fontSize"
                value={settings.fontSize}
                onChange={(e) =>
                  handleSettingChange("fontSize", parseInt(e.target.value, 10))
                }
                className="w-20 bg-[#3c3c3c] text-[#cccccc] text-[12px] p-1 rounded-md border border-[#444444]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
