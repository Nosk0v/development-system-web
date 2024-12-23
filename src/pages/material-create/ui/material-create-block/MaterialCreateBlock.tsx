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

export const MaterialCreateBlock = () => {
	const materialTypes = [
		{ value: 'chooseType', label: 'Выберите тип материала' },
		{ value: 'article', label: 'Статья' },
		{ value: 'video', label: 'Видео' },
		{ value: 'book', label: 'Книга' },
	];

	const { data, error, isLoading } = useFetchCompetenciesQuery();
	const [competencies, setCompetencies] = useState<string[]>([]);  // Храним имена компетенций
	const [competencyNames, setCompetencyNames] = useState<Map<string, string>>(new Map());
	const [isModalOpen, setIsModalOpen] = useState(false);

	const titleId = useId();
	const typeId = useId();
	const descriptionId = useId();

	const toggleModal = () => setIsModalOpen((prevState) => !prevState);

	// Обновление состояния компетенций при выборе
	const handleCompetenciesSelect = (selectedCompetencies: string[]) => {
		console.log('Selected competencies from modal:', selectedCompetencies);

		// Проверка на существование каждого ID в competencyNames
		const validCompetencies = selectedCompetencies.map((id) => {
			const name = competencyNames.get(id);
			if (!name) {
				console.warn(`Компетенция с ID ${id} не найдена в списке имен.`);
				return null;  // Если имя не найдено, возвращаем null
			}
			return name;  // Возвращаем имя компетенции
		}).filter((name) => name !== null);  // Фильтруем null значения

		if (validCompetencies.length !== selectedCompetencies.length) {
			console.warn('Некоторые выбранные компетенции не существуют в списке.');
		}

		setCompetencies(validCompetencies as string[]);  // Сохраняем имена компетенций
	};




	// Обновляем список имен компетенций при получении данных
	useEffect(() => {
		if (data) {
			const names = data.data.reduce((acc, competency) => {
				const id = String(competency.competency_id);  // Преобразуем ID в строку
				const name = competency.name;

				if (id && name) {
					acc.set(id, name);  // Формируем Map с ID и именами
				} else {
					console.warn('Некорректные данные для компетенции:', competency);
				}
				return acc;
			}, new Map<string, string>());
			console.log('Updated competency names:', names);  // Логируем Map
			setCompetencyNames(names);
		}
	}, [data]); // Обновляем список имен компетенций при изменении данных

	if (isLoading) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка загрузки компетенций</div>;

	return (
		<div className={css.wrapper}>
			<MaterialCreateControl />
			<Label label="Название" id={titleId}>
				<Input id={titleId} />
			</Label>
			<Label label="Тип материала" id={typeId}>
				<DropdownMenu options={materialTypes} id={typeId} />
			</Label>
			<Label label="Содержание материала" id={descriptionId}>
				<TextArea id={descriptionId} height={100} />
			</Label>
			<Label label="Компетенции" color="black" fontSize="20px">
				<Competencies
					initialCompetencies={competencies} // Передаем массив имен компетенций
				/>
				<button
					onClick={toggleModal}
					className={css.addCompetencyButton}
				>
					Добавить компетенции
				</button>
			</Label>
			<CompetenciesModal
				isOpen={isModalOpen}
				onClose={toggleModal}
				onSelect={handleCompetenciesSelect}
				selectedCompetencies={competencies}  // Передаем имена выбранных компетенций
				competencyNames={competencyNames}  // Передаем имена компетенций в модальное окно
			/>
		</div>
	);
};