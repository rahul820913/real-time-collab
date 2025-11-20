import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaCode, FaCloud, FaUsers, FaGithub, FaTwitter, FaLinkedin, FaYoutube, FaBars 
} from 'react-icons/fa';

import AnimatedBackground from '../context/wrapper/AnimatedBackground'; 

// --- Reusable FeatureCard Component (Unchanged) ---
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-[#141b2d]/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-slate-700/50 text-left transition-transform duration-300 hover:scale-105 hover:border-blue-500">
    <div className="text-3xl text-blue-500 mb-4 sm:mb-6">{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold text-slate-50 mb-2 sm:mb-3">{title}</h3>
    <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{description}</p>
  </div>
);

// --- Main Home Component ---
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const featureData = [
    {
      icon: <FaCode />,
      title: 'Real-time Code Editing',
      description: 'Collaborate simultaneously on projects, seeing changes instantly as your team writes code together.',
    },
    {
      icon: <FaCloud />,
      title: 'Secure Cloud Storage',
      description: 'Keep your projects safe and accessible from anywhere with robust, version-controlled cloud infrastructure.',
    },
    {
      icon: <FaUsers />,
      title: 'Team Collaboration',
      description: 'Seamlessly manage team access, assign roles, and track contributions for efficient project development.',
    },
  ];

  const firstName = user?.result?.fullName.split(' ')[0];

  return (
    <div className="relative min-h-screen font-sans text-slate-50 overflow-x-hidden select-none cursor-default bg-[#0a0f18]">
      <AnimatedBackground />
      <div className="relative z-10">
        <header className="fixed w-full top-0 border-b border-slate-700/50 bg-[#0a0f18]/80 backdrop-blur-lg z-50">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            
            <Link to="/" className="flex items-center gap-2">
              <FaCode className="text-2xl text-blue-500" />
              <span className="text-xl font-bold">CodeCollab</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center ml-10 space-x-6 lg:space-x-10 text-slate-400 text-sm sm:text-base">
              {/* 2. 👇 CORRECTED: Hover color now matches the Features link */}
              <Link to="/" className="hover:text-slate-50 transition-colors duration-300">Home</Link>
              <a href="#features" className="hover:text-slate-50 transition-colors duration-300">Features</a>
            </div>

            <div className="hidden md:flex items-center space-x-3 sm:space-x-4 ml-auto">
              {user ? (
                <>
                  <span className="text-slate-300">Welcome, {firstName}</span>
                  <Link to="/dashboard" className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-red-600/80 text-white hover:bg-red-700 transition-colors duration-300 text-sm sm:text-base">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-slate-600 hover:bg-slate-800 transition-colors duration-300 text-sm sm:text-base">Login</Link>
                  <Link to="/register" className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base">Register</Link>
                </>
              )}
            </div>
            
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(true)}>
                <FaBars className="text-2xl" />
              </button>
            </div>
          </nav>
        </header>

        {/* --- (The rest of the file is unchanged) --- */}
        <div 
          className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        <div className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-[#111827] z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
          <div className="p-6">
            <ul className="flex flex-col gap-5 text-lg mt-8">
              {user ? (
                <>
                  <li className='text-slate-300 p-3'>Welcome, {firstName}</li>
                  <li>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block w-full text-center p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">Dashboard</Link>
                  </li>
                  <li>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-center p-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-300">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center p-3 rounded-md bg-[#374151] text-white hover:bg-[#4b5563] transition-colors duration-300">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <main className="pt-20">
          <section className="relative text-center py-20 sm:py-28 md:py-36 px-4 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] h-[90%] sm:h-[80%] md:h-[60%] lg:h-[50%] bg-blue-900/40 rounded-full blur-3xl z-0"></div>
            <div className="relative z-10 container mx-auto max-w-[1200px]">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-4 leading-tight">
                Real-Time Code Collaboration
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                Write, share, and build together from anywhere.
              </p>
              <Link to={user ? "/dashboard" : "/register"} className="inline-block px-6 sm:px-8 py-2 sm:py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                Get Started
              </Link>
            </div>
          </section>

          <section id="features" className="py-16 sm:py-20 px-4">
            <div className="container mx-auto max-w-[1200px]">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-50">
                  Empower Your Development Workflow
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featureData.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-700/50 py-6 sm:py-8 bg-[#0a0f18]/80 backdrop-blur-lg">
          <div className="container mx-auto max-w-[1200px] px-4 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-slate-400 text-sm sm:text-base">
              <a href="#" className="hover:text-slate-50 transition-colors duration-300">Product</a>
              <a href="#" className="hover:text-slate-50 transition-colors duration-300">Resources</a>
              <a href="#" className="hover:text-slate-50 transition-colors duration-300">Company</a>
            </div>
            <div className="flex space-x-4 sm:space-x-6 text-slate-400 text-xl sm:text-2xl">
              <a href="#" className="hover:text-blue-500 transition-colors duration-300"><FaGithub /></a>
              <a href="#" className="hover:text-blue-500 transition-colors duration-300"><FaTwitter /></a>
              <a href="#" className="hover:text-blue-500 transition-colors duration-300"><FaLinkedin /></a>
              <a href="#" className="hover:text-blue-500 transition-colors duration-300"><FaYoutube /></a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
 
export default Home;