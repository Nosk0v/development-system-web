import { useState, useEffect} from 'react';
import { MaterialForm } from '../../../material-form/MaterialForm.tsx';
import { useCreateMaterialMutation, useFetchCompetenciesQuery, useFetchMaterialsQuery } from '../../../../api/materialApi.ts';
import { toast } from 'react-toastify';

export const MaterialCreateBlock = () => {
	// Запрос компетенций с использованием хука
	const { data: competenciesData, error, isLoading } = useFetchCompetenciesQuery();
	const [createMaterial] = useCreateMaterialMutation();
	const { data: allMaterialsData } = useFetchMaterialsQuery();

	// Состояния для формы
	const [competencies, setCompetencies] = useState<number[]>([]);
	const [competencyNames, setCompetencyNames] = useState<Map<number, string>>(new Map());
	const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [content, setContent] = useState<string>('');
	const [isModalOpen, setIsModalOpen] = useState(false);




	useEffect(() => {
		if (competenciesData) {
			const names = competenciesData.data.reduce((acc, competency) => {
				const id = competency.competency_id;
				const name = competency.name;
				if (id && name) {
					acc.set(id, name);
				}
				return acc;
			}, new Map<number, string>());
			setCompetencyNames(names);
		}
	}, [competenciesData]);

	const handleSave = async () => {
		let hasError = false;

		if (!title) {
			toast.error('Пожалуйста, укажите название материала!');
			hasError = true;
		}

		if (!selectedTypeId) {
			toast.error('Пожалуйста, выберите тип материала!');
			hasError = true;
		}

		if (!description) {
			toast.error('Пожалуйста, укажите описание материала!');
			hasError = true;
		}

		if (title.length > 1000 ) {
			toast.error('Название материала должно не превышать 1000 символов!');
			hasError = true;
		}

		if (!content) {
			toast.error('Пожалуйста, добавьте контент материала!');
			hasError = true;
		}

		if (competencies.length === 0) {
			toast.error('Пожалуйста, выберите хотя бы одну компетенцию!');
			hasError = true;
		}

		const isDuplicate = allMaterialsData?.data?.some(
			(material) => material.title?.trim().toLowerCase() === title.trim().toLowerCase()
		);
		if (isDuplicate) {
			toast.error('Материал с таким названием уже существует.');
			return;
		}

		if (hasError) return;

		try {
			const newMaterial = {
				title,
				type_id: selectedTypeId!,
				description,
				content,
				competencies,
			};

			await createMaterial(newMaterial).unwrap();
			toast.success('Материал сохранен!');
		} catch (error) {
			console.error('Error saving material:', error);
			toast.error('Ошибка при сохранении материала');
		}
	};

	if (isLoading) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка загрузки компетенций</div>;

	return (
		<MaterialForm
			title={title}
			description={description}
			content={content}
			competencies={competencies}
			competencyNames={competencyNames}
			isModalOpen={isModalOpen}
			toggleModal={() => setIsModalOpen((prev) => !prev)}
			handleCompetenciesSelect={setCompetencies}
			handleTitleChange={setTitle}
			handleDescriptionChange={setDescription}
			handleContentChange={setContent}
			onSave={handleSave}
			value={selectedTypeId}
			onChange={(typeId) => setSelectedTypeId(typeId)}
		/>
	);
};