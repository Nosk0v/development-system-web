import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Типы для данных
interface Competency {
    competency_id: number;
    name: string;
    description: string;
    parent_id?: number;
    create_date: string;
}

interface Material {
    imageUrl: string;
    material_id: number;
    title: string;
    description: string;
    type_name: string;  // Это поле для получения данных, его не нужно менять
    content: string;
    competencies: string[];
    create_date: string;
}

// Интерфейс для запроса на создание материала
interface CreateMaterialRequest {
    title: string;
    description: string;
    type_id: number;  // ID типа материала
    content: string;
    competencies: number[];  // Компетенции передаются как массив чисел (ID компетенций)
    imageUrl?: string;  // Опциональное поле для URL изображения
}

// Типы для ответов
interface MaterialsApiResponse {
    data: Material[];
}

interface CompetenciesApiResponse {
    data: Competency[];
}

interface CreateMaterialResponse {
    material: Material;
    message: string;
}

export const materialsApi = createApi({
    reducerPath: 'materialsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    endpoints: (builder) => ({
        fetchMaterials: builder.query<MaterialsApiResponse, void>({
            query: () => '/materials',
            transformResponse: (response: Material[]): MaterialsApiResponse => {
                return { data: response };
            },
        }),
        fetchCompetencies: builder.query<CompetenciesApiResponse, void>({
            query: () => '/competencies',
            transformResponse: (response: Competency[]): CompetenciesApiResponse => {
                return { data: response };
            },
        }),
        createMaterial: builder.mutation<CreateMaterialResponse, CreateMaterialRequest>({
            query: (newMaterial) => ({
                url: '/materials',
                method: 'POST',
                body: newMaterial,  // Отправляем данные для создания нового материала
            }),
            transformResponse: (response: { material: Material, message: string }): CreateMaterialResponse => {
                return response;
            },
        }),
    }),
});

export const {
    useFetchMaterialsQuery,
    useFetchCompetenciesQuery,
    useCreateMaterialMutation
} = materialsApi;