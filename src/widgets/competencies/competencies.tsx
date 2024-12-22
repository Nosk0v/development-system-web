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
import {useState} from "react";

interface CompetenciesProps {
	initialCompetencies: string[];
}

export const Competencies = (props: CompetenciesProps) => {
	const { initialCompetencies } = props;
	
	// Хранение порядка компетенций в состоянии
	const [competencies, setCompetencies] = useState<string[]>(initialCompetencies);

	// Настройка сенсоров
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	// Обработка завершения перетаскивания
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
