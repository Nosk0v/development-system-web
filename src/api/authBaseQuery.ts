import { jwtDecode } from 'jwt-decode';
import {
    BaseQueryFn,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError
} from "@reduxjs/toolkit/query/react";

export const BASE_API_URL_DEV = 'http://localhost:25502/api';
export const BASE_API_URL = 'https://b.service-to.ru/api';

const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        if (!exp) return true;
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
};

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            console.warn('[auth] Нет access_token в момент prepareHeaders');
            return headers;
        }

        if (isTokenExpired(token)) {
            console.warn('[auth] Токен истёк до запроса — не подставляем Authorization');
            return headers;
        }

        headers.set('Authorization', `Bearer ${token}`);
        return headers;
    }
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);
    if (!localStorage.getItem('access_token')) {
        localStorage.removeItem('isSessionLocked');
        localStorage.removeItem('isSessionExpiredShown');
        localStorage.removeItem('refresh_attempted');
    }
    if (
        result.error?.status === 401 ||
        (result.error?.status === 500 && result.error?.data && typeof result.error.data === 'object' &&
            'error' in result.error.data && result.error.data.error === 'Missing Authorization header')
    ) {
        const refreshToken = localStorage.getItem('refresh_token');
        const alreadyTriedRefresh = localStorage.getItem('refresh_attempted');

        if (refreshToken && !alreadyTriedRefresh) {
            localStorage.setItem('refresh_attempted', 'true');

            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh',
                    method: 'POST',
                    body: { refresh_token: refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const { access_token } = refreshResult.data as { access_token: string };
                localStorage.setItem('access_token', access_token);
                localStorage.removeItem('refresh_attempted');

                const newArgs = typeof args === 'string'
                    ? { url: args, method: 'GET' }
                    : { ...args };

                result = await baseQuery(
                    {
                        ...newArgs,
                        headers: new Headers({
                            Authorization: `Bearer ${access_token}`,
                        }),
                    },
                    api,
                    extraOptions
                );
            } else {
                if (!localStorage.getItem('isSessionExpiredShown')) {
                    localStorage.setItem('isSessionExpiredShown', 'true');
                    localStorage.setItem('isSessionLocked', 'true');
                }

                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                setTimeout(() => {
                    localStorage.removeItem('isSessionExpiredShown');
                    localStorage.removeItem('isSessionLocked');
                    localStorage.removeItem('refresh_attempted');
                    window.location.href = '/';
                }, 6000);
            }
        }
    }

    return result;
};

export const setupAutoRefresh = () => {
    const refreshInterval = 60 * 1000; // проверка каждую минуту

    setInterval(async () => {
        const token = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const alreadyTriedRefresh = localStorage.getItem('refresh_attempted');

        if (!token || !refreshToken || alreadyTriedRefresh) return;

        try {
            const { exp } = jwtDecode<{ exp: number }>(token);
            const expiresIn = exp * 1000 - Date.now();

            if (expiresIn < 2 * 60 * 1000) {
                localStorage.setItem('refresh_attempted', 'true');

                const response = await fetch(`${BASE_API_URL_DEV}/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });

                const data = await response.json();
                if (response.ok && data.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.removeItem('refresh_attempted');
                    console.log('[auth] Access token auto-refreshed');
                } else {
                    console.warn('[auth] Auto-refresh failed:', data);
                }
            }
        } catch (err) {
            console.warn('[auth] Auto-refresh error:', err);
        }
    }, refreshInterval);
};