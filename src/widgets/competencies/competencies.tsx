import {
	DndContext,
	closestCenter,
	DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';
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

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			const oldIndex = competencies.findIndex((competency) => competency.id === parseInt(active.id as string)); // Получаем индекс исходной компетенции
			const newIndex = competencies.findIndex((competency) => competency.id === parseInt(over.id as string)); // Получаем индекс новой компетенции

			if (oldIndex !== -1 && newIndex !== -1) {
				// Перемещаем компетенции в новый порядок
				const reorderedCompetencies = arrayMove(competencies, oldIndex, newIndex);
				setCompetencies(reorderedCompetencies);
				onUpdateCompetencies(reorderedCompetencies); // Передаем новый порядок компетенций в родительский компонент
			}
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={competencies.map(c => c.id.toString())} strategy={verticalListSortingStrategy}>
				<div className={css.competencies}>
					{/* Отображаем компетенции с их ID и именами */}
					{competencies.map((competency) => (
						<Competency
							key={competency.id}
							id={competency.id.toString()} // id передаем как строку для использования в DnD
							name={competency.name}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
};