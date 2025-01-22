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
    type_id: number;
    create_date: string;
}

// Интерфейс для запроса на создание материала
interface CreateMaterialRequest {
    title: string;
    description: string;
    type_id: number;  // ID типа материала
    content: string;
    competencies: number[];  // Компетенции передаются как массив чисел (ID компетенций)
}

// Интерфейс для запроса на обновление материала
interface UpdateMaterialRequest {
    title: string;
    description: string;
    type_id: number;
    content: string;
    competencies: number[];
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

interface UpdateMaterialResponse {
    material: Material;
    message: string;
}

interface DeleteMaterialResponse {
    message: string; // Сообщение об успешном удалении
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
                body: newMaterial,
            }),
            transformResponse: (response: { material: Material, message: string }): CreateMaterialResponse => {
                return response;
            },
        }),
        updateMaterial: builder.mutation<UpdateMaterialResponse, { material_id: number; updatedData: UpdateMaterialRequest }>({
            query: ({ material_id, updatedData }) => ({
                url: `/materials/${material_id}`,
                method: 'PUT',
                body: updatedData,
            }),
            transformResponse: (response: { material: Material, message: string }): UpdateMaterialResponse => {
                return response;
            },
        }),
        deleteMaterial: builder.mutation<DeleteMaterialResponse, number>({
            query: (materialId) => ({
                url: `/materials/${materialId}`,
                method: 'DELETE',
            }),
            transformResponse: (response: { message: string }): DeleteMaterialResponse => {
                return response;
            },
        }),
        // Новый endpoint для получения материала по ID
        fetchMaterialById: builder.query<Material, number>({
            query: (materialId) => `/materials/${materialId}`, // Запрос по id
        }),
    }),
});

export const {
    useFetchMaterialsQuery,
    useFetchCompetenciesQuery,
    useCreateMaterialMutation,
    useUpdateMaterialMutation,
    useDeleteMaterialMutation,
    useFetchMaterialByIdQuery, // Новый хук для получения материала по ID
} = materialsApi;