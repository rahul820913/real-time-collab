import React from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Links */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-gray-600 text-sm sm:text-base">
          <Link
            className="hover:text-slate-900 transition-colors duration-300"
          >
            Product
          </Link>
          <Link
        
            className="hover:text-slate-900 transition-colors duration-300"
          >
            Resources
          </Link>
          <Link
           
            className="hover:text-slate-900 transition-colors duration-300"
          >
            Company
          </Link>
        </div>

        {/* Center Text */}
        <p className="text-gray-500 text-xs text-center md:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="text-slate-900 font-semibold">CodeCollab</span> —{" "}
          Built with React ✦ Tailwind ✦ MERN ✦ Realtime
        </p>

        {/* Right Social Icons */}
        <div className="flex space-x-5 text-gray-500 text-xl sm:text-2xl">
          <a
            href="https://github.com/rahul820913"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors duration-300"
          >
            <FaGithub />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors duration-300"
          >
            <FaTwitter />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors duration-300"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors duration-300"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
