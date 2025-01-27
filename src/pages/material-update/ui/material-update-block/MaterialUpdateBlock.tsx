
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useFetchMaterialsQuery } from '../../../../api/materialApi.ts';
import { MaterialUpdateForm } from '../../../material-update-form/MaterialUpdateForm.tsx';

export const MaterialUpdateBlock = () => {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading, error } = useFetchMaterialsQuery();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [content, setContent] = useState('');
	const [competencies, setCompetencies] = useState<string[]>([]); // Теперь массив строк
	const [materialType, setMaterialType] = useState<string>('');
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Наполняем список компетенций строками (заменяем id на строки)
	useEffect(() => {
		if (data) {
			const material = data.data.find((item) => item.material_id === Number(id));
			if (material) {
				console.log("Material Competencies:", material.competencies); // Добавьте это для отладки
				const { title, description, content, competencies, type_id } = material;
				setTitle(title);
				setDescription(description);
				setContent(content);
				setCompetencies(competencies); // Просто передаем массив строк
				setMaterialType(String(type_id));
			}
		}
	}, [data, id]);

	const toggleModal = () => setIsModalOpen(!isModalOpen);

	const handleCompetenciesSelect = (selectedCompetencies: string[]) => {
		setCompetencies(selectedCompetencies); // Изменен тип на строковый массив
	};

	const handleTitleChange = (value: string) => setTitle(value);
	const handleDescriptionChange = (value: string) => setDescription(value);
	const handleContentChange = (value: string) => setContent(value);
	const handleMaterialTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setMaterialType(e.target.value);

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
				materialType={materialType}
				competencies={competencies}
				isModalOpen={isModalOpen}
				toggleModal={toggleModal}
				handleCompetenciesSelect={handleCompetenciesSelect}
				handleTitleChange={handleTitleChange}
				handleDescriptionChange={handleDescriptionChange}
				handleContentChange={handleContentChange}
				handleMaterialTypeChange={handleMaterialTypeChange}
				onSave={() => {}}
			/>
		</div>
	);
};