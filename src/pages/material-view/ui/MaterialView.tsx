import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFetchMaterialsQuery } from '../../../api/materialApi.ts';
import { getUserClaimsFromAccessToken } from '../../../api/jwt.ts';
import css from './MaterialView.module.scss';
import { SecondaryButton } from '../../../widgets/cancel-button/secondary-button.tsx';



export const MaterialView = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const claims = getUserClaimsFromAccessToken();
	const isAdmin = claims?.role === 0 || claims?.role === 2;

	const { refetch } = useFetchMaterialsQuery();

	const onClose = async () => {
		try {
			await refetch();
			if (location.state?.from === 'course' && location.state.courseId) {
				navigate(`/view-course/${location.state.courseId}`);
			} else {
				navigate('/material-list');
			}
		} catch (error) {
			console.error('Ошибка при перезагрузке списка:', error);
		}
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
		navigate(`/update-material/${id}`);
	};

	return (
		<div className={css.wrapper}>
			<div className={css.buttonContainer}>
				<SecondaryButton text="Закрыть" onClick={onClose}/>
				{isAdmin && (
					<button className={css.editButton} onClick={onEdit}>
						Редактировать
					</button>
					)}
			</div>

			<div className={css.contentContainer}>
				{/* Удаляем leftColumn полностью */}

				<div className={css.rightColumn}>
					<div className={css.header}>
						<h1 className={css.title}>{material.title}</h1>
					</div>

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