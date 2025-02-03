import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {useFetchMaterialsQuery, useUpdateMaterialMutation} from '../../../../api/materialApi.ts';
import { MaterialUpdateForm } from '../../../material-update-form/MaterialUpdateForm.tsx';
import {toast} from "react-toastify";

export const MaterialUpdateBlock = () => {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading, error } = useFetchMaterialsQuery();
	const [updateMaterial] = useUpdateMaterialMutation();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [content, setContent] = useState('');
	const [competencies, setCompetencies] = useState<string[]>([]); // Теперь массив строк
	const [materialType, setMaterialType] = useState<string>('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

	// Наполняем список компетенций строками (заменяем id на строки)
	useEffect(() => {
		if (data) {
			const material = data.data.find((item) => item.material_id === Number(id));
			if (material) {
				const { title, description, content, competencies, type_id } = material;
				setTitle(title);
				setDescription(description);
				setContent(content);
				setCompetencies(competencies); // Просто передаем массив строк
				setMaterialType(String(type_id)); // Преобразуем type_id в строку
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

	const handleSave = async () => {
		// Проверка обязательных полей
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
		if (competencies.length === 0) {
			toast.error('Пожалуйста, выберите хотя бы одну компетенцию!');
			return;
		}

		try {
			// Передаем данные с проверкой, что type_id всегда числовое значение
			const updatedMaterialData = {
				title,
				type_id: materialType ? parseInt(materialType, 10) : 0, // Преобразуем в число, если есть
				description,
				content,
				competencies: competencies.map((competencyName) => {
					switch (competencyName) {
						case 'Go разработчик':
							return 1;
						case 'Python разработчик':
							return 2;
						case 'JavaScript разработчик':
							return 3;
						default:
							return null;
					}
				}).filter((id) => id !== null),
			};

			console.log('Обновленные данные материала:', updatedMaterialData);

			// Отправляем запрос на обновление материала
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
				materialType={materialType}
				competencies={competencies}
				isModalOpen={isModalOpen}
				toggleModal={toggleModal}
				handleCompetenciesSelect={handleCompetenciesSelect}
				handleTitleChange={handleTitleChange}
				handleDescriptionChange={handleDescriptionChange}
				handleContentChange={handleContentChange}
				handleMaterialTypeChange={handleMaterialTypeChange}
				onSave={handleSave}
				value={selectedTypeId}
				onChange={(typeId) => setSelectedTypeId(typeId)}
			/>
		</div>
	);
};