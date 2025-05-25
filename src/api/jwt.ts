import { jwtDecode } from 'jwt-decode';

export interface DecodedJWT {
    email: string;
    role: number;
    organization_id?: number;
    exp: number;
    iat: number;
    token_type: string;
}

export function getUserClaimsFromAccessToken(): DecodedJWT | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
        return jwtDecode<DecodedJWT>(token);
    } catch (e) {
        console.error('Ошибка при декодировании JWT:', e);
        return null;
    }
}