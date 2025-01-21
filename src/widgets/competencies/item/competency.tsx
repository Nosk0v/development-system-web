import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import css from './competency.module.scss';
import SvgCollection from '../../../utils/SvgCollection';

interface CompetencyProps {
	id: string;   // Добавляем id в типы
	name: string; // Добавляем name в типы
}

export const Competency = ({ id, name }: CompetencyProps) => {
	const {
		attributes, listeners, setNodeRef, transform, transition,
	} = useSortable({ id }); // id передается как строка

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			className={css.wrapper}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<div
				className="competency-svg"
				dangerouslySetInnerHTML={{ __html: SvgCollection.DRAG_POINT }}
			/>
			<div className={css.competency}>
				{name} {/* Отображаем имя компетенции */}
			</div>
		</div>
	);
};