import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './MaterialListControl.module.scss';

import { MainButton } from '../../../../../widgets/button/button';
import { Label } from '../../../../../widgets/input-label/label';
import { Input } from '../../../../../widgets/input/input';
import { ChangeEvent, useId } from 'react';
import { MaterialTypesModal } from '../../../../../widgets/material-types-modal/MaterialTypesModal'; // Импортируем модальное окно

export const MaterialListControl = ({ onSearch }: { onSearch: (query: string) => void }) => {
	const navigate = useNavigate();
	const searchId = useId();
	const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для открытия модального окна

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		onSearch(event.target.value); // Передаем значение в родительский компонент
	};

	const onCreateMaterialClick = () => {
		navigate('/create-material');
	};

	const onCompListClick = () => {
		navigate('/complete-material');
	};

	const onMaterialTypesClick = () => {
		setIsModalOpen(true); // Открываем модальное окно
	};

	return (
		<div className={css.wrapper}>
			{/* Поле поиска */}
			<Label label="Поиск" color="black" id={searchId}>
				<Input className={css.input} id={searchId} onChange={handleSearchChange} />
			</Label>

			{/* Кнопка "Создать" */}
			<MainButton className={css.mainButton} text="Создать" onClick={onCreateMaterialClick} />

			{/* Остальные кнопки внизу */}
			<div className={css.bottomButtons}>
				<MainButton text="Управление компетенциями" className={css.compButton} onClick={onCompListClick} />
				<MainButton text="Список типов материалов" className={css.typeButton} onClick={onMaterialTypesClick} />
			</div>

			{/* Модальное окно для типов материалов */}
			{isModalOpen && <MaterialTypesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
		</div>
	);
};