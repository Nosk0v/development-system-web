import css from './competencies.module.scss';
import { Competency } from './item/competency';
import { useState, useEffect } from 'react';

interface CompetenciesProps {
	initialCompetencies: { id: number, name: string }[]; // Массив объектов компетенций с id и name
	onUpdateCompetencies: (competencies: { id: number, name: string }[]) => void; // Функция для обновления компетенций в родительском компоненте
}

export const Competencies = ({ initialCompetencies, onUpdateCompetencies }: CompetenciesProps) => {
	const [competencies, setCompetencies] = useState<{ id: number, name: string }[]>(initialCompetencies);

	// Обновление списка компетенций при изменении initialCompetencies
	useEffect(() => {
		setCompetencies(initialCompetencies);
	}, [initialCompetencies]);

	// Обработчик удаления
	const handleCompetencyDelete = (id: number) => {
		const updatedCompetencies = competencies.filter(competency => competency.id !== id);
		setCompetencies(updatedCompetencies);
		onUpdateCompetencies(updatedCompetencies); // Передаем обновленный список компетенций в родительский компонент
	};

	return (
		<div className={css.competencies}>
			{/* Отображаем компетенции с их ID и именами */}
			{competencies.map((competency) => (
				<Competency
					key={competency.id}
					id={competency.id}
					name={competency.name}
					onDelete={handleCompetencyDelete} // Передаем функцию удаления
				/>
			))}
		</div>
	);
};