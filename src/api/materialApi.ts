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
    type_name: string;
    content: string;
    competencies: string[];  // Мы оставляем компетенции как массив строк
    create_date: string;
}

// Типы для ответов
interface MaterialsApiResponse {
    data: Material[];
}

interface CompetenciesApiResponse {
    data: Competency[];
}

export const materialsApi = createApi({
    reducerPath: 'materialsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    endpoints: (builder) => ({
        fetchMaterials: builder.query<MaterialsApiResponse, void>({
            query: () => '/materials', // Запрос на получение всех материалов
            transformResponse: (response: Material[]): MaterialsApiResponse => {
                // Преобразуем данные, чтобы вернуть объект с полем data, как требует тип
                return { data: response };
            },
        }),
        fetchCompetencies: builder.query<CompetenciesApiResponse, void>({
            query: () => '/competencies', // Запрос на получение всех компетенций
            transformResponse: (response: Competency[]): CompetenciesApiResponse => {
                // Преобразуем данные, чтобы вернуть объект с полем data, как требует тип
                return { data: response };
            },
        }),
    }),
});

export const { useFetchMaterialsQuery, useFetchCompetenciesQuery } = materialsApi;