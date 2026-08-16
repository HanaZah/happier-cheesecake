import { createContext, useState, useContext, useCallback, type ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    role: string | null;
    isAuthenticated: boolean;
    login: (token: string) => string | null;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('jwt_token'));
    const [role, setRole] = useState<string | null>(() => {
        const savedToken = localStorage.getItem('jwt_token');
        return savedToken ? parseJwt(savedToken)?.scope || null : null;
    });

    const login = useCallback((newToken: string) => {
        localStorage.setItem('jwt_token', newToken);
        setToken(newToken);
        const decoded = parseJwt(newToken);
        const userRole = decoded?.scope || null;
        setRole(userRole);
        return userRole;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        setRole(null);
    }, []);

    return (
        <AuthContext.Provider value={{ token, role, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}