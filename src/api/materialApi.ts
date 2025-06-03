
import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from "./authBaseQuery.ts";


export interface ISignUpRequest {
    email: string;
    password: string;
    name?: string | null;
    organization_id: number;
}

interface CreateOrganizationRequest {
    name: string;
    prefix: string;
}

interface CreateOrganizationResponse {
    message: string;
    organization_id: number;
}

export interface IAccountResponse {
    email: string;
    name: string | null;
    organization_id: number;
    message: string;
}

interface Organization {
    organization_id: number;
    name: string;
}

interface RegistrationCodeResponse {
    code: string;
    message: string;
}

interface DeleteCodeResponse {
    message: string;
}

// Типы для курсов
interface Course {
    course_id: number;
    title: string;
    description: string;
    created_by: string;
    materials: string[];
    competencies: string[];
    create_date: string;
    material_ids: number[];
}

interface CreateCourseRequest {
    title: string;
    description: string;
    created_by: string;
    materials: number[];
    competencies: number[];
    material_ids?: number[];
}

interface UpdateCourseRequest {
    title: string;
    description: string;
    created_by: string;
    materials: number[];
    competencies: number[];
    material_ids?: number[];
}

interface CourseApiResponse {
    data: Course[];
}

interface CreateCourseResponse {
    course: Course;
    message: string;
}

interface UpdateCourseResponse {
    course: Course;
    message: string;
}

interface DeleteCourseResponse {
    message: string;
}

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
        signUp: builder.mutation<{ message: string }, ISignUpRequest>({
            query: (newAccount) => ({
                url: '/auth/sign-up',
                method: 'POST',
                body: newAccount,
            }),
            transformResponse: (response: { message: string }) => response,
        }),
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
        fetchCourses: builder.query<CourseApiResponse, void>({
            query: () => '/courses',
            transformResponse: (response: Course[]): CourseApiResponse => {
                return { data: response };
            },
        }),
        fetchCourseById: builder.query<Course, number>({
            query: (courseId) => `/courses/${courseId}`,
        }),
        createCourse: builder.mutation<CreateCourseResponse, CreateCourseRequest>({
            query: (newCourse) => ({
                url: '/courses',
                method: 'POST',
                body: newCourse,
            }),
            transformResponse: (response: { course: Course; message: string }): CreateCourseResponse => response,
        }),
        updateCourse: builder.mutation<UpdateCourseResponse, { courseId: number; data: UpdateCourseRequest }>({
            query: ({ courseId, data }) => ({
                url: `/courses/${courseId}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: { course: Course; message: string }): UpdateCourseResponse => response,
        }),
        deleteCourse: builder.mutation<DeleteCourseResponse, number>({
            query: (courseId) => ({
                url: `/courses/${courseId}`,
                method: 'DELETE',
            }),
            transformResponse: (response: { message: string }): DeleteCourseResponse => response,
        }),
        // Завершение курса
        completeCourse: builder.mutation<{ message: string }, number>({
            query: (courseId) => ({
                url: `/courses/${courseId}/complete`,
                method: 'POST',
            }),
            transformResponse: (response: { message: string }) => response,
        }),
        // Получить завершённые курсы
        fetchCompletedCourses: builder.query<CourseApiResponse, void>({
            query: () => `/courses/completed`,
            transformResponse: (response: Course[]): CourseApiResponse => {
                return { data: response };
            },
        }),
        // Получение прогресса по курсу
        fetchCourseProgress: builder.query<{ completed_materials: number[] }, number>({
            query: (courseId) => `/courses/${courseId}/progress`,
        }),
        // Проверка завершения курса
        isCourseCompleted: builder.query<{ completed: boolean }, number>({
            query: (courseId) => `/courses/${courseId}/completed`,
        }),
        fetchOrganizations: builder.query<{ data: Organization[] }, void>({
            query: () => '/registration/organizations',
            transformResponse: (response: Organization[]) => ({ data: response }),
        }),

        createRegistrationCode: builder.mutation<RegistrationCodeResponse, { organization_id: number; is_admin: boolean }>({
            query: (data) => ({
                url: '/registration/code',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: { code: string }) => ({ code: response.code, message: 'Код успешно создан' }),
        }),

        deleteRegistrationCode: builder.mutation<DeleteCodeResponse, string>({
            query: (code) => ({
                url: `/registration/code/${code}`,
                method: 'DELETE',
            }),
            transformResponse: (response: { message: string }): DeleteCodeResponse => response,
        }),
        // Отметить материал как завершённый
        markMaterialAsCompleted: builder.mutation<{ message: string }, { courseId: number, materialId: number }>({
            query: ({ courseId, materialId }) => ({
                url: `/courses/${courseId}/materials/${materialId}/complete`,
                method: 'POST',
            }),
            transformResponse: (response: { message: string }) => response,
        }),
        createOrganization: builder.mutation<CreateOrganizationResponse, CreateOrganizationRequest>({
            query: (data) => ({
                url: '/registration/organization',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: { message: string; organization_id: number }): CreateOrganizationResponse => response,
        }),
        deleteOrganization: builder.mutation<{ message: string }, number>({
            query: (organizationId) => ({
                url: `/registration/organization/${organizationId}`,
                method: 'DELETE',
            }),
            transformResponse: (response: { message: string }): { message: string } => response,
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
    useFetchCoursesQuery,
    useFetchCourseByIdQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useSignUpMutation,
    useCompleteCourseMutation,
    useFetchCourseProgressQuery,
    useIsCourseCompletedQuery,
    useMarkMaterialAsCompletedMutation,
    useFetchCompletedCoursesQuery,
    useFetchOrganizationsQuery,
    useCreateRegistrationCodeMutation,
    useDeleteRegistrationCodeMutation,
    useCreateOrganizationMutation,
    useDeleteOrganizationMutation,
} = materialsApi;