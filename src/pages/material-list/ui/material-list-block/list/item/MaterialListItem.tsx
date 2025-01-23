import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import css from './MaterialListItem.module.scss';

interface MaterialListItemProps {
	materialId: number;
	title: string;
	competencies: string[];
	imageUrl: string;
	onMaterialDeleted: (materialId: number) => void;
	onDeleteRequest: (materialId: number) => void;
}

export const MaterialListItem = ({
									 materialId,
									 title,
									 competencies,
									 imageUrl,
									 onDeleteRequest,
								 }: MaterialListItemProps) => {
	const navigate = useNavigate();
	const competenciesRef = useRef<HTMLDivElement | null>(null);

	// Переход к просмотру материала
	const onMaterialClick = () => {
		console.log(`Navigating to /view-materials/${materialId}`);
		navigate(`/view-materials/${materialId}`);
	};

	// Обработчик горизонтальной прокрутки
	useEffect(() => {
		const ref = competenciesRef.current;
		if (!ref) return;

		const handleWheel = (e: WheelEvent) => {
			if (e.deltaY !== 0) {
				e.preventDefault();
				ref.scrollLeft += e.deltaY * 0.5; // Коэффициент 0.5 делает прокрутку плавной
			}
		};

		ref.addEventListener('wheel', handleWheel);

		return () => {
			ref.removeEventListener('wheel', handleWheel);
		};
	}, []);

	return (
		<div className={css.wrapper} onClick={onMaterialClick}>
			<div className={css.content}>
				<div className={css.title}>{title}</div>
				{competencies.length > 0 && (
					<div
						className={css.competencies}
						ref={competenciesRef} // Ссылка на контейнер компетенций
					>
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
				onClick={(e) => {
					e.stopPropagation();
					onDeleteRequest(materialId);
				}}
			>
				🗑️
			</button>
		</div>
	);
};