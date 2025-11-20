import React, { useState, useRef } from 'react'; // 1. Import useRef
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../API/auth';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaCode } from 'react-icons/fa';
import PageWrapper from '../context/wrapper/PageWrapper';
import useClickOutside from '../hooks/useClickOutside';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // --- New state and ref for the click-outside effect ---
    const [isShaking, setIsShaking] = useState(false); // State to control animation
    const loginFormRef = useRef(); // 3. Create a ref

    // 4. Define the function to run on an outside click
    const handleOutsideClick = () => {
        setIsShaking(true);
        // Remove the shake class after the animation is done (500ms)
        setTimeout(() => setIsShaking(false), 500);
    };

    // 5. Use the hook
    useClickOutside(loginFormRef, handleOutsideClick);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const promise = loginUser(formData);
        toast.promise(promise, {
            loading: 'Logging in...',
            success: (data) => {
                login(data);
                navigate('/dashboard');
                return <b>Welcome back!</b>;
            },
            error: (err) => <b>{err.message || "Login failed. Please check your credentials."}</b>,
        });
        promise.catch(() => {}).finally(() => setLoading(false));
    };

    return (
        <PageWrapper>
            {/* 6. Attach the ref and the conditional shake class */}
            <div 
                ref={loginFormRef}
                className={`w-full max-w-md bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700/50 shadow-2xl shadow-blue-500/10 select-none cursor-default transition-transform duration-500 ${isShaking ? 'animate-shake' : ''}`}
            >
                {/* Header with classes to prevent text selection cursor */}
                <div className="text-center mb-8 select-none cursor-default">
                    <div className="inline-block p-4 rounded-full bg-slate-900/50 border border-slate-700 mb-4">
                        <FaCode className="text-4xl text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-50">Welcome Back</h2>
                    <p className="text-slate-400 mt-2">Sign in to continue your journey.</p>
                </div>
            
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="email" name="email" placeholder="Email Address" required onChange={handleChange} 
                            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 pl-12 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        />
                    </div>
                    <div className="relative group">
                        <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="password" name="password" placeholder="Password" required onChange={handleChange} 
                            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 pl-12 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        />
                    </div>
                    <button 
                        type="submit" disabled={loading} 
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
                    >
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-6">
                    Don't have an account? <Link to="/register" className="text-blue-400 font-semibold hover:underline">Register here</Link>
                </p>
            </div>
        </PageWrapper>
    );
};

export default Login;

