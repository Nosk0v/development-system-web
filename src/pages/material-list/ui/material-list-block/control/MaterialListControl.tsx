import { useState, ChangeEvent, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './MaterialListControl.module.scss';

import { MainButton } from '../../../../../widgets/button/button';
import { Label } from '../../../../../widgets/input-label/label';
import { Input } from '../../../../../widgets/input/input';
import { MaterialTypesModal } from '../../../../../widgets/material-types-modal/MaterialTypesModal';
import { SkillsModal } from '../../../../../widgets/comp-modal/SkillsModal.tsx';
import {useFetchCompetenciesQuery, useFetchMaterialTypeQuery} from '../../../../../api/materialApi.ts';
import {CompetencyDropdown} from "./CompetencyDropdown.tsx";

interface MaterialListControlProps {
	onSearch: (query: string) => void;
	onTypeFilterChange: (typeId: number | null) => void;
	onCompetencyFilterChange: (competencies: string[]) => void;
}

export const MaterialListControl = ({ onSearch, onTypeFilterChange, onCompetencyFilterChange }: MaterialListControlProps) => {
	const navigate = useNavigate();
	const searchId = useId();
	const [isMaterialTypesModalOpen, setIsMaterialTypesModalOpen] = useState(false);
	const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
	const { data: typesData } = useFetchMaterialTypeQuery();
	const { data: competenciesData } = useFetchCompetenciesQuery();
	const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		onSearch(event.target.value);
	};

	const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		onTypeFilterChange(value === '' ? null : Number(value));
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
			<Label label="Поиск" color="black" id={searchId}>
				<Input className={css.input} id={searchId} onChange={handleSearchChange} />
			</Label>

			<Label label="Тип материала" color="black" id="materialTypeSelect">
				<select className={css.select} id="materialTypeSelect" onChange={handleTypeChange}>
					<option value="">Все типы</option>
					{typesData?.data?.map((type) => (
						<option key={type.type_id} value={type.type_id}>
							{type.type}
						</option>
					))}
				</select>
			</Label>
			{competenciesData?.data && (
				<CompetencyDropdown
					competencies={competenciesData.data.map((c) => c.name)}
					selected={selectedCompetencies}
					onChange={(updated) => {
						setSelectedCompetencies(updated);
						onCompetencyFilterChange(updated);
					}}
				/>
			)}

			<MainButton className={css.mainButton} text="Создать" onClick={onCreateMaterialClick} />

			<div className={css.bottomButtons}>
				<MainButton text="Компетенции" className={css.compButton} onClick={onCompClick} />
				<MainButton text="Список типов материалов" className={css.typeButton} onClick={onMaterialTypesClick} />
				<MainButton text="Курсы" className={css.compButton} onClick={onCoursesClick} />
				<MainButton text="Выйти" className={css.typeButton} onClick={onLogoutClick} />
			</div>

			{isMaterialTypesModalOpen && (
				<MaterialTypesModal isOpen={isMaterialTypesModalOpen} onClose={() => setIsMaterialTypesModalOpen(false)} />
			)}
			{isSkillModalOpen && (
				<SkillsModal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} />
			)}
		</div>
	);
};