import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from "./authBaseQuery.ts";

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
    type_name: string;
    content: string;
    competencies: string[];
    type_id: number;
    create_date: string;
}

interface MaterialType {
    type_id: number;
    type: string;
}

interface CreateMaterialRequest {
    title: string;
    description: string;
    type_id: number;
    content: string;
    competencies: number[];
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
interface UpdateCompetencyRequest {
    name: string;
    description: string;
}

// Типы для ответов
interface MaterialsApiResponse {
    data: Material[];
}

interface UpdateCompetencyResponse {
    competency: Competency;
    message: string;
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

interface DeleteCompetencyResponse {
    message: string; // Сообщение об успешном удалении
}

interface CreateCompetencyRequest {
    name: string;
    description: string;
    parent_id?: number;
}

interface CreateCompetencyResponse {
    competency: Competency;
    message: string;
}


export const materialsApi = createApi({
    reducerPath: 'materialsApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        // Endpoint для входа пользователя, возвращает access_token и refresh_token
        signIn: builder.mutation<{ access_token: string; refresh_token: string  }, { email: string; password: string }>({
            query: (credentials) => ({
                url: '/auth/sign-in',
                method: 'POST',
                body: credentials,
            }),
        }),
        // Endpoint для обновления access_token по refresh_token. Возвращает только access_token.
refreshToken: builder.mutation<{ access_token: string }, void>({
    query: () => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refresh_token: localStorage.getItem('refresh_token') },
    }),
}),

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
        createCompetency: builder.mutation<CreateCompetencyResponse, CreateCompetencyRequest>({
            query: (newCompetency) => ({
                url: '/competencies',
                method: 'POST',
                body: newCompetency,
            }),
            transformResponse: (response: { competency: Competency; message: string }): CreateCompetencyResponse => {
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
        deleteCompetency: builder.mutation<DeleteCompetencyResponse, number>({
            query: (competencyId) => ({
                url: `/competencies/${competencyId}`,
                method: 'DELETE',
            }),
            transformResponse: (response: { message: string }): DeleteCompetencyResponse => {
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

        updateCompetency: builder.mutation<UpdateCompetencyResponse, {competencyId: number, data: UpdateCompetencyRequest}>({
            query: ({competencyId, data}) => ({
                url: `/competencies/${competencyId}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: {competency: Competency, message: string }): UpdateCompetencyResponse => {
                return response;
            },

        }),
    }),
});

export const {
    useSignInMutation,
    useRefreshTokenMutation,
    useFetchMaterialsQuery,
    useFetchCompetenciesQuery,
    useCreateMaterialMutation,
    useDeleteMaterialMutation,
    useFetchMaterialByIdQuery, // Новый хук для получения материала по ID
    useUpdateMaterialMutation, // Хук для обновления материала
    useFetchMaterialTypeByIdQuery,
    useFetchMaterialTypeQuery,
    useCreateMaterialTypeMutation,
    useDeleteMaterialTypeMutation,
    useDeleteCompetencyMutation,
    useCreateCompetencyMutation,
    useUpdateCompetencyMutation,
} = materialsApi;