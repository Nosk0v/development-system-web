import css from './MaterialCreateBlock.module.scss';
import { MaterialCreateControl } from '../../../material-form/material-create-control';
import { Label } from '../../../../widgets/input-label/label';
import { Input } from '../../../../widgets/input/input';
import { DropdownMenu } from '../../../../widgets/dropdown-menu/dropdown-menu';
import { TextArea } from '../../../../widgets/textarea/textarea';
import { Competencies } from '../../../../widgets/competencies/competencies';
import { CompetenciesModal } from '../../../../widgets/competencies-modal/CompetenciesModal';
import {useId, useState, useEffect, ChangeEvent} from 'react';
import { useFetchCompetenciesQuery } from '../../../../api/materialApi.ts';
import { useCreateMaterialMutation } from '../../../../api/materialApi.ts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const MaterialCreateBlock = () => {
	const materialTypes = [
		{ value: '1', label: 'Статья' },
		{ value: '2', label: 'Книга' },
		{ value: '3', label: 'Видео' },
	];

	const { data, error, isLoading } = useFetchCompetenciesQuery();
	const [competencies, setCompetencies] = useState<number[]>([]);  // Храним ID компетенций
	const [competencyNames, setCompetencyNames] = useState<Map<number, string>>(new Map());
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [materialType, setMaterialType] = useState<string>('');

	const [title, setTitle] = useState<string>(''); // Название материала
	const [description, setDescription] = useState<string>(''); // Описание материала
	const [content, setContent] = useState<string>(''); // Контент материала

	const [createMaterial] = useCreateMaterialMutation();

	const titleId = useId();
	const descriptionId = useId();
	const contentId = useId();

	const toggleModal = () => setIsModalOpen((prevState) => !prevState);

	const handleCompetenciesSelect = (selectedCompetencies: number[]) => {
		setCompetencies(selectedCompetencies);
	};

	const competencyIdsToNames = (ids: number[]) => {
		return ids.map((id) => competencyNames.get(id) || '');
	};

	const handleMaterialTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setMaterialType(e.target.value);
	};

	useEffect(() => {
		if (data) {
			const names = data.data.reduce((acc, competency) => {
				const id = competency.competency_id;
				const name = competency.name;

				if (id && name) {
					acc.set(id, name);
				} else {
					console.warn('Некорректные данные для компетенции:', competency);
				}
				return acc;
			}, new Map<number, string>());
			setCompetencyNames(names);
		}
	}, [data]);

	const handleSave = async () => {
		let hasError = false;

		// Валидация: проверяем все поля
		if (!title) {
			toast.error('Пожалуйста, укажите название материала!');
			hasError = true;
		}

		if (!materialType) {
			toast.error('Пожалуйста, выберите тип материала!');
			hasError = true;
		}

		if (!description) {
			toast.error('Пожалуйста, укажите описание материала!');
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

		if (hasError) return;


		const newMaterial = {
			title,
			type_id: parseInt(materialType, 10),
			description,
			content,
			competencies,
		};

		try {
			const response = await createMaterial(newMaterial).unwrap();
			console.log('Material saved successfully:', response);
			toast.success('Материал сохранен!');
		} catch (error) {
			console.error('Error saving material:', error);
			toast.error('Ошибка при сохранении материала');
		}
	};

	if (isLoading) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка загрузки компетенций</div>;

	return (
		<div className={css.wrapper}>
			<MaterialCreateControl onSave={handleSave} />
			<div className={css.form}>
				<Label label="Название" id={titleId}>
					<Input
						id={titleId}
						value={title}
						onChange={(e) => setTitle(e.target.value)}  // Обработчик для изменения названия
					/>
				</Label>
				<Label label="Тип материала" id="typeId">
					<DropdownMenu
						options={materialTypes}
						id="typeId"
						value={materialType}
						onChange={handleMaterialTypeChange}
					/>
				</Label>
				<Label label="Описание материала" id={descriptionId}>
					<TextArea
						id={descriptionId}
						value={description}
						height={100}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</Label>
				<Label label="Контент материала" id={contentId}>
					<TextArea
						id={contentId}
						value={content}
						height={200}
						onChange={(e) => setContent(e.target.value)}
					/>
				</Label>
				<Label label="Компетенции" color="black" fontSize="20px">
					<Competencies
						initialCompetencies={competencyIdsToNames(competencies)}
					/>
					<button
						onClick={toggleModal}
						className={css.addCompetencyButton}
					>
						Добавить компетенции
					</button>
				</Label>
			</div>
			<CompetenciesModal
				isOpen={isModalOpen}
				onClose={toggleModal}
				onSelect={handleCompetenciesSelect}
				selectedCompetencies={competencies}
				competencyNames={competencyNames}
			/>
			<ToastContainer />
		</div>
	);
};