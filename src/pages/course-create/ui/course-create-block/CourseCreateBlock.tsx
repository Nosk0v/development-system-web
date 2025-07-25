import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
	useCreateCourseMutation,
	useFetchCompetenciesQuery,
	useFetchMaterialsQuery,
	useFetchDepartmentsQuery,
	useFetchOrganizationsQuery,
	useFetchCoursesQuery,
} from "../../../../api/materialApi.ts";
import { CourseForm } from "../../../course-form/CourseForm.tsx";
import { getUserClaimsFromAccessToken } from "../../../../api/jwt.ts";
import type { DecodedJWT } from "../../../../api/jwt.ts";

export const CourseCreateBlock = () => {
	const { data: competenciesData, isLoading: competenciesLoading, error: competenciesError } = useFetchCompetenciesQuery();
	const { data: materialsData, isLoading: materialsLoading, error: materialsError } = useFetchMaterialsQuery();
	const { data: departmentsData, isLoading: departmentsLoading, error: departmentsError } = useFetchDepartmentsQuery();
	const { data: organizationsData } = useFetchOrganizationsQuery();
	const { data: allCoursesData, refetch: refetchCourses } = useFetchCoursesQuery();
	const [createCourse] = useCreateCourseMutation();

	const [claims, setClaims] = useState<DecodedJWT | null>(null);

	useEffect(() => {
		const parsedClaims = getUserClaimsFromAccessToken();
		if (parsedClaims) {
			setClaims(parsedClaims);
		}
	}, []);

	const isSuperAdmin = claims?.role === 2;
	const createdBy = claims?.email ?? '';
	const organizationIdFromToken = claims?.organization_id ?? null;

	const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);
	const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [competencies, setCompetencies] = useState<number[]>([]);
	const [materials, setMaterials] = useState<number[]>([]);
	const [isCompetencyModalOpen, setIsCompetencyModalOpen] = useState(false);
	const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
	const [competencyNames, setCompetencyNames] = useState<Map<number, string>>(new Map());
	const [materialNames, setMaterialNames] = useState<Map<number, string>>(new Map());

	useEffect(() => {
		if (competenciesData) {
			const map = new Map<number, string>();
			competenciesData.data.forEach((comp) => {
				map.set(comp.competency_id, comp.name);
			});
			setCompetencyNames(map);
		}
	}, [competenciesData]);

	useEffect(() => {
		if (materialsData) {
			const map = new Map<number, string>();
			materialsData.data.forEach((mat) => {
				map.set(mat.material_id, mat.title);
			});
			setMaterialNames(map);
		}
	}, [materialsData]);

	const handleSave = async () => {
		if (!claims) {
			toast.error('Не удалось определить пользователя');
			return;
		}

		let hasError = false;

		if (!title) {
			toast.error('Введите название курса');
			hasError = true;
		}
		if (!description) {
			toast.error('Введите описание курса');
			hasError = true;
		}
		if (!selectedDepartmentId) {
			toast.error('Выберите направление курса');
			hasError = true;
		}
		if (competencies.length === 0) {
			toast.error('Выберите хотя бы одну компетенцию');
			hasError = true;
		}
		if (materials.length === 0) {
			toast.error('Выберите хотя бы один материал');
			hasError = true;
		}
		if (isSuperAdmin && !selectedOrganizationId) {
			toast.error('Выберите организацию');
			hasError = true;
		}

		if (hasError || !createdBy) return;

		await refetchCourses();

		const isDuplicateTitle = allCoursesData?.data?.some(
			(course) =>
				course.title.trim().toLowerCase() === title.trim().toLowerCase()
		);

		if (isDuplicateTitle) {
			toast.error('Курс с таким названием уже существует в этой организации');
			return;
		}

		const newCourse = {
			title,
			description,
			created_by: createdBy,
			materials,
			competencies,
			department_id: selectedDepartmentId!,
			organization_id: isSuperAdmin ? selectedOrganizationId! : organizationIdFromToken!,
		};

		try {
			await createCourse(newCourse).unwrap();
			await refetchCourses();
			toast.success('Курс успешно создан!');
		} catch (error) {
			console.error('Ошибка при создании курса:', error);
			toast.error('Ошибка при сохранении курса');
		}
	};

	if (competenciesLoading || materialsLoading || departmentsLoading) return <div>Загрузка...</div>;
	if (competenciesError || materialsError || departmentsError) return <div>Ошибка загрузки данных</div>;

	return (
		<CourseForm
			title={title}
			description={description}
			competencies={competencies}
			materials={materials}
			competencyNames={competencyNames}
			materialNames={materialNames}
			isCompetencyModalOpen={isCompetencyModalOpen}
			isMaterialModalOpen={isMaterialModalOpen}
			toggleCompetencyModal={() => setIsCompetencyModalOpen((prev) => !prev)}
			toggleMaterialModal={() => setIsMaterialModalOpen((prev) => !prev)}
			handleCompetenciesSelect={setCompetencies}
			handleMaterialsSelect={setMaterials}
			handleTitleChange={setTitle}
			handleDescriptionChange={setDescription}
			onSave={handleSave}
			mode="create"
			selectedDepartmentId={selectedDepartmentId}
			setSelectedDepartmentId={setSelectedDepartmentId}
			departmentsData={departmentsData?.data ?? []}
			isSuperAdmin={isSuperAdmin}
			selectedOrganizationId={selectedOrganizationId}
			setSelectedOrganizationId={setSelectedOrganizationId}
			organizationsData={organizationsData?.data ?? []}
		/>
	);
};