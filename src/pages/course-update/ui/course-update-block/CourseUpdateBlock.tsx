import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    useFetchCourseByIdQuery,
    useFetchCompetenciesQuery,
    useFetchMaterialsQuery,
    useUpdateCourseMutation
} from '../../../../api/materialApi.ts';
import { CourseForm } from '../../../course-form/CourseForm.tsx';
import { toast } from 'react-toastify';
import { getUserClaimsFromAccessToken } from '../../../../api/jwt.ts';

export const CourseUpdateBlock = () => {
    const { id } = useParams<{ id: string }>();
    const courseId = Number(id);
    const claims = getUserClaimsFromAccessToken();
    const createdBy = claims?.email ?? '';

    const { data: courseData, isLoading: courseLoading } = useFetchCourseByIdQuery(courseId);
    const { data: competenciesData } = useFetchCompetenciesQuery();
    const { data: materialsData } = useFetchMaterialsQuery();
    const [updateCourse] = useUpdateCourseMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [competencies, setCompetencies] = useState<number[]>([]);
    const [materials, setMaterials] = useState<number[]>([]);
    const [isCompetencyModalOpen, setIsCompetencyModalOpen] = useState(false);
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
    const [competencyNames, setCompetencyNames] = useState<Map<number, string>>(new Map());
    const [materialNames, setMaterialNames] = useState<Map<number, string>>(new Map());
    const [initialValues, setInitialValues] = useState({
        title: '',
        description: '',
        competencies: [] as number[],
        materials: [] as number[],
    });

    useEffect(() => {
        if (courseData && competenciesData && materialsData) {
            setTitle(courseData.title);
            setDescription(courseData.description);

            const compNameToId = new Map(
                competenciesData.data.map((c) => [c.name.toLowerCase(), c.competency_id])
            );

            const matTitleToId = new Map(
                materialsData.data.map((m) => [m.title.toLowerCase(), m.material_id])
            );

            const compIds = (courseData.competencies || [])
                .map((name) => compNameToId.get(name.toLowerCase()))
                .filter((id): id is number => typeof id === 'number');

            const matIds = (courseData.materials || [])
                .map((title) => matTitleToId.get(title.toLowerCase()))
                .filter((id): id is number => typeof id === 'number');

            setCompetencies(compIds);
            setMaterials(matIds);

            setInitialValues({
                title: courseData.title,
                description: courseData.description,
                competencies: compIds,
                materials: matIds,
            });
        }
    }, [courseData, competenciesData, materialsData]);

    useEffect(() => {
        if (competenciesData) {
            const map = new Map<number, string>();
            competenciesData.data.forEach((c) => map.set(c.competency_id, c.name));
            setCompetencyNames(map);
        }
    }, [competenciesData]);

    useEffect(() => {
        if (materialsData) {
            const map = new Map<number, string>();
            materialsData.data.forEach((m) => map.set(m.material_id, m.title));
            setMaterialNames(map);
        }
    }, [materialsData]);

    const handleSave = async () => {
        if (!courseData) return;

        const noChanges =
            title === initialValues.title &&
            description === initialValues.description &&
            competencies.length === initialValues.competencies.length &&
            materials.length === initialValues.materials.length &&
            competencies.every(id => initialValues.competencies.includes(id)) &&
            materials.every(id => initialValues.materials.includes(id));

        if (noChanges) {
            toast.info('Пожалуйста, внесите хотя бы одно изменение в курс!');
            return;
        }

        if (!title.trim()) {
            toast.error('Пожалуйста, укажите название курса!');
            return;
        }

        if (title.length > 1000) {
            toast.error('Название курса не должно превышать 1000 символов!');
            return;
        }

        if (!description.trim()) {
            toast.error('Пожалуйста, укажите описание курса!');
            return;
        }

        if (competencies.length === 0) {
            toast.error('Пожалуйста, выберите хотя бы одну компетенцию!');
            return;
        }

        if (materials.length === 0) {
            toast.error('Пожалуйста, выберите хотя бы один материал!');
            return;
        }

        try {
            await updateCourse({
                courseId,
                data: {
                    title,
                    description,
                    competencies,
                    materials,
                    created_by: createdBy
                }
            }).unwrap();

            toast.success('Курс успешно обновлён!');
            setInitialValues({ title, description, competencies, materials });

        } catch (error) {
            console.error('Ошибка при обновлении курса:', error);
            toast.error('Не удалось сохранить курс');
        }
    };


    if (courseLoading) return <div>Загрузка...</div>;
    if (!courseData) return <div>Курс не найден</div>;

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
            mode="update"
            courseId={courseId}
        />
    );
};