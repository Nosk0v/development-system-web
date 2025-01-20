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
	initialCompetencies: string[]; // Начальный список компетенций
}

export const Competencies = ({ initialCompetencies }: CompetenciesProps) => {
	const [competencies, setCompetencies] = useState<string[]>(initialCompetencies);

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
			const oldIndex = competencies.indexOf(active.id as string);
			const newIndex = competencies.indexOf(over.id as string);
			setCompetencies(arrayMove(competencies, oldIndex, newIndex));
		}
	};




	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={competencies} strategy={verticalListSortingStrategy}>
				<div className={css.competencies}>
					{/* Добавляем компонент Competency для каждой компетенции */}
					{competencies.map((competency) => (
						<Competency
							key={competency}
							competency={competency}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
};