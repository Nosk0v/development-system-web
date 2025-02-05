import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// Типы для данных
interface Competency {
    competency_id: number;
    name: string;
    description: string;
    parent_id?: number;
    create_date: string;
}

interface Material {
    material_id: number;
    title: string;
    description: string;
    type_name: string;  // Это поле для получения данных, его не нужно менять
    content: string;
    competencies: string[];
    type_id: number;
    create_date: string;
}

interface MaterialType {
    type_id: number;
    type: string;
}

// Интерфейс для запроса на создание материала
interface CreateMaterialRequest {
    title: string;
    description: string;
    type_id: number;
    content: string;
    competencies: number[];  // Компетенции передаются как массив чисел (ID компетенций)
}

interface CreateMaterialTypeRequest {
    type: string;
}

interface UpdateMaterialRequest {
    title: string;
    description: string;
    type_id: number; // ID типа материала
    content: string;
    competencies: number[]; // Массив ID компетенций
}

// Типы для ответов
interface MaterialsApiResponse {
    data: Material[];
}

interface MaterialTypeApiResponse {
    data: MaterialType[];
}

interface CompetenciesApiResponse {
    data: Competency[];
}

interface CreateMaterialResponse {
    material: Material;
    message: string;
}

interface CreateMaterialTypeResponse {
    materialType: MaterialType
    message: string;
}

interface UpdateMaterialResponse {
    material: Material;
    message: string;
}

interface DeleteMaterialResponse {
    message: string; // Сообщение об успешном удалении
}

interface DeleteMaterialTypeResponse {
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
        fetchMaterialTypeById: builder.query<MaterialType, number>({
            query: (typeId) => `/materialsType/${typeId}`, // Запрос по ID типа материала
        }),
        FetchMaterialType: builder.query<MaterialTypeApiResponse, void>({
            query: () => '/materialsType',
            transformResponse: (response: MaterialType[]): MaterialTypeApiResponse => {
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
        createMaterialType: builder.mutation<CreateMaterialTypeResponse, CreateMaterialTypeRequest>({
            query: (newMaterialType) => ({
                url: '/materialsType',
                method: 'POST',
                body: newMaterialType,
            }),
            transformResponse: (response: {materialType: MaterialType, message: string}) : CreateMaterialTypeResponse => {
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

        deleteMaterialType: builder.mutation<DeleteMaterialTypeResponse, number>({
            query: (materialTypeId) => ({
                url: `/materialsType/${materialTypeId}`,
                method: 'DELETE',
            }),
            transformResponse: (response: {message: string}): DeleteMaterialTypeResponse => {
                return response;
            },
        }),
        // Новый endpoint для получения материала по ID
        fetchMaterialById: builder.query<Material, number>({
            query: (materialId) => `/materials/${materialId}`, // Запрос по id
        }),
        // Новый endpoint для обновления материала
        updateMaterial: builder.mutation<UpdateMaterialResponse, { materialId: number, data: UpdateMaterialRequest }>({
            query: ({ materialId, data }) => ({
                url: `/materials/${materialId}`, // Используем materialId для пути
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: { material: Material, message: string }): UpdateMaterialResponse => {
                return response;
            },
        }),
    }),
});

export const {
    useFetchMaterialsQuery,
    useFetchCompetenciesQuery,
    useCreateMaterialMutation,
    useDeleteMaterialMutation,
    useFetchMaterialByIdQuery, // Новый хук для получения материала по ID
    useUpdateMaterialMutation, // Хук для обновления материала
    useFetchMaterialTypeByIdQuery,
    useFetchMaterialTypeQuery,
    useCreateMaterialTypeMutation,
    useDeleteMaterialTypeMutation
} = materialsApi;