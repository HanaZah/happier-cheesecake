import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    return (
        <header className="site-header">
            <Link to="/dashboard" className="logo">
                <img src={"/img/logo_icon.PNG"} alt="FinAdvise ikona" className="logo__icon" />
                <img src="/img/logo_text.PNG" alt="FinAdvise" className="logo__text" />
            </Link>

            <nav className="nav">
                <Link to="/404" className={`nav__link ${location.pathname.includes('/client') ? 'nav__link--active' : ''}`}>
                    <img src="/img/search.svg" alt="" className="nav__icon" />
                    <span className="nav__text">Vyhledat</span>
                </Link>
                <Link to="/profile" className={`nav__link ${location.pathname === '/profile' ? 'nav__link--active' : ''}`}>
                    <img src="/img/profile.svg" alt="" className="nav__icon" />
                    <span className="nav__text">Profil</span>
                </Link>
                <a href="#" onClick={handleLogout} className="nav__link">
                    <img src="/img/logout.svg" alt="" className="nav__icon" />
                    <span className="nav__text">Odhlásit</span>
                </a>
            </nav>
        </header>
    );
}