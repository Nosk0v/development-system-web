import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFetchMaterialsQuery, useUpdateMaterialMutation, useFetchMaterialTypeQuery, useFetchCompetenciesQuery } from '../../../../api/materialApi.ts';
import { MaterialUpdateForm } from '../../../material-update-form/MaterialUpdateForm.tsx';
import { toast } from 'react-toastify';

export const MaterialUpdateBlock = () => {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading, error } = useFetchMaterialsQuery();
	const { data: materialTypesData } = useFetchMaterialTypeQuery();
	const { data: competenciesData } = useFetchCompetenciesQuery();
	const [updateMaterial] = useUpdateMaterialMutation();

	const material = data?.data.find((item) => item.material_id === Number(id));

	// Найти type_id по type_name
	const getTypeIdByName = (typeName: string) => {
		const foundType = materialTypesData?.data.find((type) => type.type === typeName);
		return foundType ? foundType.type_id : 0;
	};

	const defaultMaterialType = material ? getTypeIdByName(material.type_name) : 0;

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [content, setContent] = useState('');
	const [competencies, setCompetencies] = useState<string[]>([]);
	const [competencyIds, setCompetencyIds] = useState<number[]>([]);
	const [materialType, setMaterialType] = useState<number>(defaultMaterialType);
	const [materialTypeName, setMaterialTypeName] = useState<string>('');
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if (data && materialTypesData) {
			const material = data.data.find((item) => item.material_id === Number(id));
			if (material) {
				const { title, description, content, competencies, type_name } = material;
				setTitle(title);
				setDescription(description);
				setContent(content);
				setCompetencies(competencies);
				setMaterialType(getTypeIdByName(type_name));
				setMaterialTypeName(type_name);
			}
		}
	}, [data, materialTypesData, id]);

	useEffect(() => {
		if (competenciesData) {
			const competenciesMap = new Map(
				competenciesData.data.map(comp => [comp.name.toLowerCase(), comp.competency_id])
			);

			const matchedIds = competencies
				.map(name => competenciesMap.get(name.toLowerCase()))
				.filter(id => id !== undefined) as number[];

			setCompetencyIds(matchedIds);
		}
	}, [competencies, competenciesData]);

	const handleSave = async () => {
		if (!title) {
			toast.error('Пожалуйста, укажите название материала!');
			return;
		}

		if (!materialType) {
			toast.error('Пожалуйста, выберите тип материала!');
			return;
		}

		if (!description) {
			toast.error('Пожалуйста, укажите описание материала!');
			return;
		}
		if (!content) {
			toast.error('Пожалуйста, добавьте контент материала!');
			return;
		}
		if (competencyIds.length === 0) {
			toast.error('Пожалуйста, выберите хотя бы одну компетенцию!');
			return;
		}

		try {
			const updatedMaterialData = {
				title,
				type_id: materialType,
				description,
				content,
				competencies: competencyIds,
			};

			await updateMaterial({ materialId: Number(id), data: updatedMaterialData }).unwrap();
			toast.success('Материал успешно обновлен!');
		} catch (error) {
			console.error('Ошибка при обновлении материала:', error);
			toast.error('Ошибка при обновлении материала');
		}
	};

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	if (error) {
		return <div>Ошибка: {(error as Error).message}</div>;
	}

	return (
		<div>
			<MaterialUpdateForm
				title={title}
				description={description}
				content={content}
				competencies={competencies}
				isModalOpen={isModalOpen}
				toggleModal={() => setIsModalOpen(!isModalOpen)}
				handleCompetenciesSelect={setCompetencies}
				handleTitleChange={setTitle}
				handleDescriptionChange={setDescription}
				handleContentChange={setContent}
				handleMaterialTypeChange={setMaterialType}
				materialType={materialType}
				materialTypeName={materialTypeName}
				onSave={handleSave}
			/>
		</div>
	);
};