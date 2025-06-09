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
	const extractYouTubeId = (url: string): string | null => {
		try {
			const youtubeRegex =
				/(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
			const match = url.match(youtubeRegex);
			return match ? match[1] : null;
		} catch {
			return null;
		}
	};
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

			<div className={css.header}>
				<h1 className={css.title}>{material.title}</h1>
			</div>

			<div className={css.metadataBlock}>
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
			</div>

			<div className={css.contentContainer}>
				<div className={css.rightColumn}>
					<div>
						<label>Содержание:</label>
						<div
							className={
								material.content.includes('youtube.com') || material.content.includes('youtu.be')
									? css.youtube
									: css.content
							}
						>
							{material.content.includes('youtube.com') || material.content.includes('youtu.be') ? (
								<iframe
									width="100%"
									height="100%"
									style={{borderRadius: '8px', border: 'none'}}
									src={`https://www.youtube.com/embed/${extractYouTubeId(material.content)}`}
									title="YouTube video player"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							) : (
								<p>{material.content}</p>
							)}
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