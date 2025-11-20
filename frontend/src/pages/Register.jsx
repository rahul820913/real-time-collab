import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../API/auth';
import toast from 'react-hot-toast';
import { FaCode, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import PageWrapper from '../context/wrapper/PageWrapper';
import useClickOutside from '../hooks/useClickOutside';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isShaking, setIsShaking] = useState(false);
    const registerFormRef = useRef();

    const handleOutsideClick = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    useClickOutside(registerFormRef, handleOutsideClick);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords don't match.");
        }
        setLoading(true);
        const { fullName, email, password } = formData;
        const promise = registerUser({ fullName, email, password });
        
        toast.promise(promise, {
            loading: 'Creating account...',
            success: (data) => {
                login(data);
                navigate('/dashboard');
                return <b>Account created successfully!</b>;
            },
            error: (err) => <b>{err.message || "Registration failed. Please try again."}</b>,
        });
        
        promise.catch(() => {}).finally(() => setLoading(false));
    };
    
    return (
        <PageWrapper>
            <div 
                ref={registerFormRef}
                className={`w-full max-w-md bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700/50 shadow-2xl select-none cursor-default shadow-blue-500/10 transition-transform duration-500 ${isShaking ? 'animate-shake' : ''}`}
            >
                {/* --- THIS IS THE SECTION WITH THE FIX --- */}
                <div className="text-center mb-8 select-none cursor-default"> {/* 1. Added to parent */}
                    <div className="inline-block p-4 rounded-full bg-slate-900/50 border border-slate-700 mb-4">
                        <FaCode className="text-4xl text-blue-400" />
                    </div>
                    {/* 2. Added classes here to be explicit */}
                    <h2 className="text-3xl font-bold text-slate-50 select-none cursor-default">Create Your Account</h2>
                    <p className="text-slate-400 mt-2 select-none cursor-default">Join CodeCollab to start collaborating.</p>
                </div>
            
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <FaUser className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="text" 
                            name="fullName" 
                            placeholder="Full Name"
                            required 
                            onChange={handleChange} 
                            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 pl-12 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        />
                    </div>
                    <div className="relative group">
                        <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email Address"
                            required 
                            onChange={handleChange} 
                            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 pl-12 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        />
                    </div>
                    <div className="relative group">
                        <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password"
                            required 
                            onChange={handleChange} 
                            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 pl-12 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        />
                    </div>
                    <div className="relative group">
                        <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirm Password"
                            required 
                            onChange={handleChange} 
                            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-lg p-3 pl-12 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed !mt-6 transform hover:scale-105 active:scale-100"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-6">
                    Already have an account? <Link to="/login" className="text-blue-400 font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </PageWrapper>
    );
};

export default Register;