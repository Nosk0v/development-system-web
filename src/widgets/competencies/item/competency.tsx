import css from './competency.module.scss';
import TrashIcon from '../../../assets/images/trash.svg';

interface CompetencyProps {
	id: number; // ID компетенции для удаления
	name: string; // Имя компетенции
	onDelete: (id: number) => void; // Функция для удаления компетенции
}

export const Competency = ({ id, name, onDelete }: CompetencyProps) => {
	return (
		<div className={css.wrapper}>
			<div className={css.content}>
				<div className={css.name}>{name}</div>
				<button
					className={css.trashButton}
					onClick={(e) => {
						e.stopPropagation(); // Чтобы клик не активировал другие действия
						onDelete(id); // Удалить компетенцию
					}}
				>
					<img src={TrashIcon} alt={"Удалить"}/>
				</button>
			</div>
		</div>
	);
};