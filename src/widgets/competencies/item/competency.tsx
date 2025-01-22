
import css from './competency.module.scss';


interface CompetencyProps {
	name: string; // Добавляем name в типы
}

export const Competency = (props: CompetencyProps) => {
	const { name } = props;

	return (
		<div
			className={css.wrapper}

		>
			<div className={css.competency}>
				{name} {/* Отображаем имя компетенции */}
			</div>
		</div>
	);
};