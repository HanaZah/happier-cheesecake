import { useCallback } from 'react';
import {useAuth} from '../context/AuthContext';

export function useApiClient() {
    const { token, logout } = useAuth();

    return useCallback(async (url: string, options: RequestInit = {}) => {
        const headers = new Headers(options.headers);

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(url, {...options, headers});

        if (response.status === 401) {
            logout();
            throw new Error('Authentication failed: Token is stale or invalid.');
        }

        return response;
    }, [token, logout]);
}