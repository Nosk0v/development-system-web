// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { materialsApi } from '../api/materialApi.ts'; // Убедитесь, что путь правильный

export const store = configureStore({
    reducer: {
        // Подключаем редуктор API
        [materialsApi.reducerPath]: materialsApi.reducer,
    },
    // Добавляем middleware для обработки кеширования, логирования запросов и других функций
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(materialsApi.middleware),
});

// Типы для состояния store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;