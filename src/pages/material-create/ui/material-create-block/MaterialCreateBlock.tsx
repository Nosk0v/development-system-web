import css from './MaterialCreateBlock.module.scss';
import { MaterialCreateControl } from './material-create-control';
import { Label } from '../../../../widgets/input-label/label';
import { Input } from '../../../../widgets/input/input';
import { DropdownMenu } from '../../../../widgets/dropdown-menu/dropdown-menu';
import { TextArea } from '../../../../widgets/textarea/textarea';
import { Competencies } from '../../../../widgets/competencies/competencies';
import { CompetenciesModal } from '../../../../widgets/competencies-modal/CompetenciesModal';
import { useId, useState, useEffect } from 'react';
import { useFetchCompetenciesQuery } from '../../../../api/materialApi.ts';
import { useCreateMaterialMutation } from '../../../../api/materialApi.ts';  // Подключаем мутацию для создания материала
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
	const [materialType, setMaterialType] = useState<string>(''); // Состояние для типа материала

	// Состояния для текстовых полей
	const [title, setTitle] = useState<string>(''); // Название материала
	const [description, setDescription] = useState<string>(''); // Описание материала
	const [content, setContent] = useState<string>(''); // Контент материала

	const [createMaterial] = useCreateMaterialMutation();  // Мутация для отправки данных

	const titleId = useId();
	const descriptionId = useId();
	const contentId = useId();

	const toggleModal = () => setIsModalOpen((prevState) => !prevState);

	// Обновление состояния компетенций при выборе
	const handleCompetenciesSelect = (selectedCompetencies: number[]) => {
		setCompetencies(selectedCompetencies);  // Сохраняем ID компетенций
	};

	// Преобразуем ID компетенций в их имена
	const competencyIdsToNames = (ids: number[]) => {
		return ids.map((id) => competencyNames.get(id) || '');
	};

	const handleMaterialTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMaterialType(e.target.value); // Обновляем состояние при изменении
	};

	// Обновляем список имен компетенций при получении данных
	useEffect(() => {
		if (data) {
			const names = data.data.reduce((acc, competency) => {
				const id = competency.competency_id;  // Используем ID как ключ
				const name = competency.name;

				if (id && name) {
					acc.set(id, name);  // Формируем Map с ID и именами
				} else {
					console.warn('Некорректные данные для компетенции:', competency);
				}
				return acc;
			}, new Map<number, string>());
			setCompetencyNames(names);
		}
	}, [data]);

	const handleSave = async () => {
		// Храним ошибки
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

		// Если есть ошибки, не отправляем данные
		if (hasError) return;

		// Если нет ошибок, создаем новый материал
		const newMaterial = {
			title,  // Название материала
			type_id: parseInt(materialType, 10),  // Преобразуем type_id в число
			description,  // Описание материала
			content,  // Контент материала
			competencies,  // Список компетенций (ID)
		};

		try {
			const response = await createMaterial(newMaterial).unwrap();
			console.log('Material saved successfully:', response);
			toast.success('Материал сохранен!');  // Показываем уведомление об успехе
		} catch (error) {
			console.error('Error saving material:', error);
			toast.error('Ошибка при сохранении материала');  // Показываем уведомление об ошибке
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
						value={title}  // Привязка значения
						onChange={(e) => setTitle(e.target.value)}  // Обработчик для изменения названия
					/>
				</Label>
				<Label label="Тип материала" id="typeId">
					<DropdownMenu
						options={materialTypes}
						id="typeId"
						value={materialType}  // Передаем выбранный тип
						onChange={handleMaterialTypeChange}  // Обработчик изменений
					/>
				</Label>
				<Label label="Описание материала" id={descriptionId}>
					<TextArea
						id={descriptionId}
						value={description}  // Привязка значения
						height={100}
						onChange={(e) => setDescription(e.target.value)}  // Обработчик для изменения описания
					/>
				</Label>
				<Label label="Контент материала" id={contentId}>
					<TextArea
						id={contentId}
						value={content}  // Привязка значения
						height={200}
						onChange={(e) => setContent(e.target.value)}  // Обработчик для изменения контента
					/>
				</Label>
				<Label label="Компетенции" color="black" fontSize="20px">
					<Competencies
						initialCompetencies={competencyIdsToNames(competencies)}  // Преобразуем ID в имена
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
				selectedCompetencies={competencies}  // Передаем ID компетенций
				competencyNames={competencyNames}  // Передаем Map с ID и именами компетенций
			/>
			<ToastContainer />  {/* Добавляем контейнер для уведомлений */}
		</div>
	);
};