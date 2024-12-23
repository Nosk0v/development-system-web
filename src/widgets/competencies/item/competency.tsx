import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import css from './competency.module.scss';
import SvgCollection from '../../../utils/SvgCollection';

interface CompetencyProps {
	competency: string;
	onDelete: (competency: string) => void; // Проп для удаления
}

export const Competency = ({ competency, onDelete }: CompetencyProps) => {
	const {
		attributes, listeners, setNodeRef, transform, transition,
	} = useSortable({ id: competency });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const onDeleteClick = () => {
		onDelete(competency); // Вызываем функцию удаления, передавая имя компетенции
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
				{competency}
			</div>
			<button
				className={css.delete}
				onClick={onDeleteClick}
				type="button"
				dangerouslySetInnerHTML={{ __html: SvgCollection.DELETE_POINT }}
			/>
		</div>
	);
};