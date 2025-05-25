import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './MaterialListControl.module.scss';

import { MainButton } from '../../../../../widgets/button/button';
import { Label } from '../../../../../widgets/input-label/label';
import { Input } from '../../../../../widgets/input/input';
import { ChangeEvent, useId } from 'react';
import { MaterialTypesModal } from '../../../../../widgets/material-types-modal/MaterialTypesModal';
import { SkillsModal } from '../../../../../widgets/comp-modal/SkillsModal.tsx';

export const MaterialListControl = ({ onSearch }: { onSearch: (query: string) => void }) => {
	const navigate = useNavigate();
	const searchId = useId();
	const [isMaterialTypesModalOpen, setIsMaterialTypesModalOpen] = useState(false);
	const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		onSearch(event.target.value);
	};

	const onCreateMaterialClick = () => {
		navigate('/create-material');
	};

	const onMaterialTypesClick = () => {
		setIsMaterialTypesModalOpen(true);
	};

	const onCompClick = () => {
		setIsSkillModalOpen(true);
	};

	const onCoursesClick = () => {
		navigate('/courses');
	};

	const onLogoutClick = () => {
		localStorage.removeItem('access_token');
		window.location.replace('/');
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
				<MainButton text="Компетенции" className={css.compButton} onClick={onCompClick} />
				<MainButton text="Список типов материалов" className={css.typeButton} onClick={onMaterialTypesClick} />
				<MainButton text="Курсы" className={css.compButton} onClick={onCoursesClick} />
				<MainButton text="Выйти" className={css.typeButton} onClick={onLogoutClick} />
			</div>

			{/* Модальные окна */}
			{isMaterialTypesModalOpen && (
				<MaterialTypesModal isOpen={isMaterialTypesModalOpen} onClose={() => setIsMaterialTypesModalOpen(false)} />
			)}
			{isSkillModalOpen && (
				<SkillsModal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} />
			)}
		</div>
	);
};