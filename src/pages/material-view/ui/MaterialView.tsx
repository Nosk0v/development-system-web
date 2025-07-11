import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFetchMaterialsQuery } from '../../../api/materialApi.ts';
import { getUserClaimsFromAccessToken } from '../../../api/jwt.ts';
import css from './MaterialView.module.scss';
import MicrolinkCard from '@microlink/react';
import { SecondaryButton } from '../../../widgets/cancel-button/secondary-button.tsx';
import {useEffect, useState} from 'react';

export const MaterialView = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const claims = getUserClaimsFromAccessToken();
	const isAdmin = claims?.role === 0 || claims?.role === 2;

	const [isContentLoaded, setIsContentLoaded] = useState(false);

	const isValidHttpUrl = (str: string): boolean => {
		try {
			new URL(str);
			return true;
		} catch {
			return false;
		}
	};




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
	const material = data?.data.find((item) => item.material_id === Number(id)) || null;
	useEffect(() => {
		if (!material) return;

		const isYouTube = material.content.includes('youtube.com') || material.content.includes('youtu.be');
		const isRuTube = material.content.includes('rutube.ru');
		const isURL = isValidHttpUrl(material.content);

		// моментальная загрузка видео
		if (isYouTube || isRuTube) {
			setIsContentLoaded(true); // видео iframe грузится сам по себе
			return;
		}

		// задержка только для обычных ссылок
		if (isURL) {
			const timeout = setTimeout(() => setIsContentLoaded(true), 1500);
			return () => clearTimeout(timeout);
		}


		// текст — грузить сразу
		setIsContentLoaded(true);
	}, [material]);
	if (isLoading) return <div className={css.loading}>Загрузка...</div>;
	if (error) return <div className={css.error}>Ошибка: {(error as Error).message || 'Не удалось загрузить материал'}</div>;


	const onEdit = () => navigate(`/update-material/${id}`);

	if (!material) return <div className={css.notFound}>Материал не найден</div>;

	const isYouTube = material.content.includes('youtube.com') || material.content.includes('youtu.be');
	const isRuTube = material.content.includes('rutube.ru');
	const isURL = isValidHttpUrl(material.content);
	if (isYouTube && !extractYouTubeId(material.content)) {
		return <div className={css.error}>Ошибка: некорректная ссылка на YouTube</div>;
	}
	return (
		<div className={css.wrapper}>
			<div className={css.buttonContainer}>
				<SecondaryButton text="Закрыть" onClick={onClose} />
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
					<div className={css.description}><p>{material.description}</p></div>
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
						{(isYouTube || isRuTube || isURL) && !isContentLoaded && (
							<div className={css.videoPlaceholder}>
								<div className={css.spinner} />
							</div>
						)}

						{isYouTube && isContentLoaded && (
							<div className={css.youtube}>
								<iframe
									width="560"
									height="315"
									style={{ borderRadius: '8px', border: 'none' }}
									src={`https://www.youtube.com/embed/${extractYouTubeId(material.content)}`}
									title="YouTube video player"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									onLoad={() => setIsContentLoaded(true)}
								/>
							</div>
						)}

						{isRuTube && isContentLoaded && (
							<div className={css.rutube}>
								<iframe
									width="560"
									height="315"
									style={{ borderRadius: '8px', border: 'none' }}
									src={material.content.replace('/video/', '/play/embed/')}
									title="RuTube video player"
									allow="autoplay; fullscreen"
									allowFullScreen
									onLoad={() => setIsContentLoaded(true)}
								/>
							</div>
						)}

						{isURL && !isYouTube && !isRuTube && isContentLoaded && (
							<div className={css.linkPreview}>
								<MicrolinkCard
									url={material.content}
									size="large"
								/>
							</div>
						)}

						{!isYouTube && !isRuTube && !isURL && (
							<div className={css.content}>
								{material.content.replace(/\\n/g, '\n').replace(/\\t/g, '\t')}
							</div>
						)}
					</div>

					<div className={css.competencies}>
						<label>Компетенции:</label>
						<div className={css.competenciesList}>
							{material.competencies.map((comp) => (
								<span key={comp} className={css.competency}>{comp}</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};