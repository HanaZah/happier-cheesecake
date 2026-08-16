import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
    const { isAuthenticated, role } = useAuth();

    // Determine target based on auth state and role
    let targetUrl = '/login';
    if (isAuthenticated) {
        targetUrl = role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
    }

    return (
        <main className="page-wrapper" style={{ textAlign: 'center', paddingTop: '10vh' }}>
            <h1 style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ marginBottom: '2rem' }}>Stránka nenalezena</h2>
            <Link to={targetUrl} className="btn btn--primary">
                Zpět na Hlavní stránku
            </Link>
        </main>
    );
}