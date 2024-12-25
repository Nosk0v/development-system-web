import { useNavigate } from 'react-router-dom';
import css from './MaterialListItem.module.scss';

interface MaterialListItemProps {
	materialId: number;
	title: string;
	competencies: string[];
	imageUrl: string;
	onMaterialDeleted: (materialId: number) => void;
	onDeleteRequest: (materialId: number) => void; // Новый пропс для запроса на удаление
}

export const MaterialListItem = ({
									 materialId,
									 title,
									 competencies,
									 imageUrl,
									 onDeleteRequest,
								 }: MaterialListItemProps) => {
	const navigate = useNavigate();

	// Переход к просмотру материала
	const onMaterialClick = () => {
		navigate('/material-view');
	};

	return (
		<div className={css.wrapper}>
			<div className={css.content} onClick={onMaterialClick}>
				<div className={css.title}>{title}</div>
				{competencies.length > 0 && (
					<div className={css.competencies}>
						{competencies.map((competency) => (
							<div key={competency} className={css.competency}>
								{competency}
							</div>
						))}
					</div>
				)}
			</div>
			<div className={css.preview}>
				<img src={imageUrl} alt={title} />
			</div>
			<button
				className={css.deleteButton}
				onClick={() => onDeleteRequest(materialId)} // Вызываем запрос на удаление
			>
				🗑️
			</button>
		</div>
	);
};