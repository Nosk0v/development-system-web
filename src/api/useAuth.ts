import {useCallback} from "react";
import {useSignInMutation} from "./materialApi.ts";
import {useNavigate} from "react-router-dom";

export function useAuth() {
    const [signIn] = useSignInMutation();
    const navigate = useNavigate();

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await signIn({ email, password }).unwrap();
            localStorage.setItem('access_token', response.access_token);
            navigate('/'); // редирект после успешного логина
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }, [signIn, navigate]);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        navigate('/login'); // редирект после выхода
    }, [navigate]);

    const isAuthenticated = !!localStorage.getItem('access_token');
    const token = localStorage.getItem('access_token');

    return {
        login,
        logout,
        isAuthenticated,
        token,
    };
}