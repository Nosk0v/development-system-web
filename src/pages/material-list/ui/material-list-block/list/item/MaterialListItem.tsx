import { useNavigate } from 'react-router-dom';
import css from './MaterialListItem.module.scss';

interface MaterialListItemProps {
	title: string;
	competencies: string[]; // Массив названий компетенций
	imageUrl: string;
}

export const MaterialListItem = ({ title, competencies, imageUrl }: MaterialListItemProps) => {
	const navigate = useNavigate();

	// Обработка клика по материалу
	const onMaterialClick = () => {
		navigate('/material-view');
	};

	// Преобразуем список компетенций в массив с названиями
	const competencyNames = competencies.map((competencyName) => competencyName);

	return (
		<button type="button" onClick={onMaterialClick}>
			<div className={css.wrapper}>
				<div className={css.content}>
					<div className={css.title}>{title}</div>
					{competencyNames && competencyNames.length > 0 && (
						<div className={css.competencies}>
							{competencyNames.map((competency) => (
								<div key={competency} className={css.competency}>{competency}</div>
							))}
						</div>
					)}
				</div>
				<div className={css.preview}>
					<img src={imageUrl} alt={title} />
				</div>
			</div>
		</button>
	);
};