import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import css from './competency.module.scss';
import SvgCollection from '../../../utils/SvgCollection';

interface CompetencyProps {
	competency: string;
}

export const Competency = ({ competency}: CompetencyProps) => {
	const {
		attributes, listeners, setNodeRef, transform, transition,
	} = useSortable({ id: competency });

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
				{competency}
			</div>
		</div>
	);
};