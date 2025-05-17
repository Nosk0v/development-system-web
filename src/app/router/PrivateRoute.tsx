import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/" replace />;
};