import { useParams, useNavigate } from 'react-router-dom';
import { useFetchMaterialsQuery } from '../../../api/materialApi.ts';
import css from './MaterialView.module.scss';
import { SecondaryButton } from '../../../widgets/cancel-button/secondary-button.tsx';

export const MaterialView = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const onClose = () => {
		navigate('/');
		window.location.reload();
	};

	const { data, isLoading, error } = useFetchMaterialsQuery();

	const material =
		data?.data.find((item) => item.material_id === Number(id)) || null;

	if (isLoading) {
		return <div className={css.loading}>Загрузка...</div>;
	}

	if (error) {
		return (
			<div className={css.error}>
				Ошибка: {(error as Error).message || 'Не удалось загрузить материал'}
			</div>
		);
	}

	if (!material) {
		return <div className={css.notFound}>Материал не найден</div>;
	}

	const onEdit = () => {
		// Навигация на страницу редактирования, передаем id материала
		navigate(`/material/${id}`);
	};

	return (
		<div className={css.wrapper}>
			<div className={css.buttonContainer}>
				<SecondaryButton text="Закрыть" onClick={onClose} />
				{/* Кнопка редактирования прямо в компоненте */}
				<button
					className={css.editButton}
					onClick={onEdit}
				>
					Редактировать
				</button>
			</div>

			<div className={css.contentContainer}>
				<div className={css.leftColumn}>
					<img
						src={
							material.imageUrl ||
							'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
						}
						alt={material.title}
						className={css.image}
					/>
					<div className={css.header}>
						<h1 className={css.title}>{material.title}</h1>
					</div>
				</div>

				<div className={css.rightColumn}>
					<div>
						<label>Описание:</label>
						<div className={css.description}>
							<p>{material.description}</p>
						</div>
					</div>
					<div>
						<label>Тип материала:</label>
						<div className={css.typeValue}>{material.type_name}</div>
					</div>
					<div>
						<label>Содержание:</label>
						<div className={css.content}>
							<p>{material.content}</p>
						</div>
					</div>
					<div className={css.competencies}>
						<label>Компетенции:</label>
						<div className={css.competenciesList}>
							{material.competencies.map((comp) => (
								<span key={comp} className={css.competency}>
									{comp}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};