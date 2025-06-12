import { useState, ChangeEvent, useId, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './MaterialListControl.module.scss';

import { MainButton } from '../../../../../widgets/button/button';
import { Label } from '../../../../../widgets/input-label/label';
import { Input } from '../../../../../widgets/input/input';
import { MaterialTypesModal } from '../../../../../widgets/material-types-modal/MaterialTypesModal';
import { SkillsModal } from '../../../../../widgets/comp-modal/SkillsModal.tsx';
import { useFetchCompetenciesQuery, useFetchMaterialTypeQuery } from '../../../../../api/materialApi.ts';
import { CompetencyDropdown } from './CompetencyDropdown.tsx';

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

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedType, setSelectedType] = useState<number | null>(null);
	const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);

	useEffect(() => {
		const savedQuery = localStorage.getItem('filter_query') ?? '';
		const savedType = localStorage.getItem('filter_type');
		const savedCompetencies = JSON.parse(localStorage.getItem('filter_competencies') ?? '[]');

		setSearchQuery(savedQuery);
		setSelectedType(savedType ? Number(savedType) : null);
		setSelectedCompetencies(savedCompetencies);

		onSearch(savedQuery);
		onTypeFilterChange(savedType ? Number(savedType) : null);
		onCompetencyFilterChange(savedCompetencies);
	}, []);

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchQuery(value);
		localStorage.setItem('filter_query', value);
		onSearch(value);
	};

	const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		const typeValue = value === '' ? null : Number(value);
		setSelectedType(typeValue);
		localStorage.setItem('filter_type', value);
		onTypeFilterChange(typeValue);
	};

	const onCompetencyFilterChangeLocal = (competencies: string[]) => {
		setSelectedCompetencies(competencies);
		localStorage.setItem('filter_competencies', JSON.stringify(competencies));
		onCompetencyFilterChange(competencies);
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
		// Удаление токенов
		localStorage.removeItem('access_token');


		// Удаление фильтров и связанных данных
		localStorage.removeItem('filter_query');
		localStorage.removeItem('filter_type');
		localStorage.removeItem('filter_competencies');
		localStorage.removeItem('course_filter_competencies');



		// Редирект
		window.location.replace('/');
	};

	return (
		<div className={css.wrapper}>
			<Label label="Поиск" color="black" id={searchId}>
				<Input className={css.input} id={searchId} value={searchQuery} onChange={handleSearchChange} />
			</Label>

			<Label label="Тип материала" color="black" id="materialTypeSelect">
				<select className={css.select} id="materialTypeSelect" value={selectedType ?? ''} onChange={handleTypeChange}>
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
					onChange={onCompetencyFilterChangeLocal}
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