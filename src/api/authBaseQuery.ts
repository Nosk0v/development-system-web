import {
    BaseQueryFn,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError
} from "@reduxjs/toolkit/query/react";

export const BASE_API_URL_DEV = 'http://localhost:25502/api';
export const BASE_API_URL = 'https://b.service-to.ru/api';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
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
    if (result.error?.status === 401) {
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

                if (typeof args === 'string') {
                    args = {
                        url: args,
                        method: 'GET',
                        headers: { Authorization: `Bearer ${access_token}` },
                    };
                } else {
                    args = {
                        ...args,
                        headers: {
                            ...(args.headers || {}),
                            Authorization: `Bearer ${access_token}`,
                        },
                    };
                }

                result = await baseQuery(args, api, extraOptions);
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