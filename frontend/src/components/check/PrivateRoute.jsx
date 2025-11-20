import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // You can add a nice spinner here
        return <div className="bg-[#0a0f18] min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;