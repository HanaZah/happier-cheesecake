import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdvisorRoute() {
    const { role } = useAuth();

    if (role !== 'ADVISOR') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
}