import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout, loading } = useAuth();

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [navigate]);

  if (loading) {
    return (
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="text-gray-500 text-sm">Loading...</div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        {/* ✅ --- NEW: Left Side Wrapper (Logo + Navlinks) --- */}
        <div className="flex items-center gap-8">
          {/* --- Logo Area --- */}
          <div className="flex items-center gap-4">
            {/* --- Mobile Menu Button --- */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1 text-gray-700 hover:text-slate-900"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* --- Logo --- */}
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl cursor-pointer"
            >
              <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Collab IDE
            </Link>
          </div>

          {/* --- Desktop Navlinks (Moved inside wrapper) --- */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-slate-900">
              Dashboard
            </Link>
            <Link to="/allprojects" className="hover:text-slate-900">
              My Projects
            </Link>
            <Link to="/create" className="hover:text-slate-900">
              Create
            </Link>
            <Link to="/profile" className="hover:text-slate-900">
              Profile
            </Link>
          </div>
        </div>
        {/* ✅ --- End of Left Side Wrapper --- */}

        {/* --- Right (Search + User) --- */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, people..."
              className="pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0 rounded-lg text-sm w-64 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/search?q=${e.target.value}`);
                }
              }}
            />
          </div>

          {/* --- User Dropdown --- */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={user.result.avatar || "https://i.pravatar.cc/150"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                    <img
                      src={user.result.avatar || "https://i.pravatar.cc/150"}
                      alt={user.result.fullName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-sm text-slate-900">
                        {user.result.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.result.email}
                      </p>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 text-slate-700" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-slate-700" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* --- Mobile Menu Drawer (No changes needed here) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* --- Overlay --- */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* --- Menu Content --- */}
          <div className="fixed top-0 left-0 w-72 h-full bg-white shadow-lg p-6 z-50 animate-slideIn">
            {/* --- Menu Header --- */}
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-lg">Collab IDE</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-gray-600 hover:text-gray-900"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* --- Mobile Search --- */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0 rounded-lg text-sm w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/search?q=${e.target.value}`);
                    setIsMobileMenuOpen(false);
                  }
                }}
              />
            </div>

            {/* --- Mobile Navlinks --- */}
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-lg text-slate-700 hover:text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-lg text-slate-700 hover:text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/allprojects"
                className="text-lg text-slate-700 hover:text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Projects
              </Link>
              <Link
                to="/create"
                className="text-lg text-slate-700 hover:text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create
              </Link>
              <Link
                to="/profile"
                className="text-lg text-slate-700 hover:text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;