import { useNavigate } from 'react-router-dom';
import css from './CourseCreateControl.module.scss';
import { useFetchCoursesQuery } from '../../../api/materialApi.ts';
import { SecondaryButton } from '../../../widgets/cancel-button/secondary-button.tsx';
import { MainButton } from '../../../widgets/button/button.tsx';

interface CourseCreateControlProps {
	onSave: () => void;
	mode: 'create' | 'update';
	courseId?: number;
}

export const CourseCreateControl = ({ onSave, mode, courseId }: CourseCreateControlProps) => {
	const navigate = useNavigate();
	const { refetch } = useFetchCoursesQuery();

	const onClose = async () => {
		try {
			await refetch(); // ✅ Обновить список курсов, если надо
			if (mode === 'create') {
				navigate('/courses');
			} else if (mode === 'update' && courseId) {
				navigate(`/view-course/${courseId}`, {
					state: { forceRefetch: true } // 💡 передаем сигнал
				});
			}
		} catch (error) {
			console.error('Ошибка при перезагрузке списка:', error);
		}
	};

	return (
		<div className={css.wrapper}>
			<SecondaryButton text="Закрыть" onClick={onClose} />
			<MainButton text="Сохранить" onClick={onSave} />
		</div>
	);
};