import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdvisorRoute from './components/AdvisorRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientNew from './pages/ClientNew';
import ClientDetail from './pages/ClientDetail';
import NotFound from "./pages/NotFound.tsx";

function RootRedirect() {
    const { role } = useAuth();
    if (role === 'ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Unauthenticated users only */}
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<Login />} />
                    </Route>

                    {/* Authenticated users only */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<RootRedirect />} />

                        <Route element={<Layout />}>
                            {/* ADVISOR ONLY */}
                            <Route element={<AdvisorRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/client-new" element={<ClientNew />} />
                                <Route path="/client-detail/:id" element={<ClientDetail />} />
                            </Route>

                            {/* ADMIN ONLY */}
                            <Route element={<AdminRoute />}>
                                <Route path="/admin/dashboard" element={<div style={{ padding: '2rem', textAlign: 'center' }}>Admin Dashboard MOCK</div>} />
                            </Route>
                        </Route>
                    </Route>

                    {/* Catch-all 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}