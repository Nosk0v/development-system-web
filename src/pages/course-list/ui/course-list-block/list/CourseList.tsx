import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserClaimsFromAccessToken } from '../../../../../api/jwt';
import { useFetchCoursesQuery, useDeleteCourseMutation, useRefreshTokenMutation } from '../../../../../api/materialApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import css from './CourseList.module.scss';
import { CourseListItem } from './item/CourseListItem.tsx';

interface Course {
	course_id: number;
	title: string;
	competencies: string[];
}

export const CourseList = ({
							   searchQuery,
							   selectedCompetencies = [],
						   }: {
	searchQuery: string;
	selectedCompetencies?: string[];
}) => {
	const { data, error, isLoading, refetch } = useFetchCoursesQuery();
	const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
	const [refreshToken] = useRefreshTokenMutation();
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const claims = getUserClaimsFromAccessToken();
	const isAdmin = claims?.role === 0 || claims?.role === 2;

	useEffect(() => {
		if (data?.data) {
			setCourses(data.data.map((item) => ({ ...item })));
		}
	}, [data]);

	useEffect(() => {
		document.body.style.overflow = isModalOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isModalOpen]);

	const handleCourseDeleted = (deletedId: number) => {
		setCourses((prev) => prev.filter((course) => course.course_id !== deletedId));
	};

	const handleDeleteRequest = (courseId: number) => {
		setSelectedCourseId(courseId);
		setIsModalOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (selectedCourseId !== null) {
			try {
				await deleteCourse(selectedCourseId).unwrap();
				handleCourseDeleted(selectedCourseId);
				refetch();
				toast.success('Курс успешно удалён!');
			} catch (err) {
				console.error('Ошибка при удалении курса:', err);
				toast.error('Ошибка при удалении курса');
			} finally {
				setIsModalOpen(false);
			}
		}
	};

	useEffect(() => {
		const token = localStorage.getItem('access_token');
		if (token) {
			try {
				const decoded: { exp: number } = jwtDecode(token);
				const isExpired = decoded.exp * 1000 < Date.now();
				if (!isExpired) {
					refetch();
				} else {
					refreshToken()
						.unwrap()
						.then(({ access_token }) => {
							localStorage.setItem('access_token', access_token);
							refetch();
						})
						.catch(() => {
							localStorage.removeItem('access_token');
							localStorage.removeItem('refresh_token');
							window.location.href = '/';
						});
				}
			} catch (e) {
				console.error('Ошибка декодирования токена:', e);
			}
		}
	}, [refetch, refreshToken]);

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const filteredCourses = courses.filter((course) =>
		course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
		(selectedCompetencies.length === 0 ||
			selectedCompetencies.every((c) => course.competencies.includes(c)))
	);

	if (isLoading) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка при загрузке курсов</div>;

	return (
		<div className={css.wrapper}>
			<div className={css.list}>
				{filteredCourses.length > 0 ? (
					filteredCourses.map((course) => (
						<CourseListItem
							key={course.course_id}
							courseId={course.course_id}
							title={course.title}
							competencies={course.competencies}
							onCourseDeleted={handleCourseDeleted}
							onDeleteRequest={handleDeleteRequest}
						/>
					))
				) : (
					<div className={css.noMaterials}>
						<div className={css.emoji}>😞</div>
						Курсы отсутствуют
					</div>
				)}
			</div>

			{isModalOpen && (
				<div className={css.modal} onClick={handleModalClose}>
					<div className={css.modalContent} onClick={(e) => e.stopPropagation()}>
						<p>Вы точно хотите удалить курс?</p>
						<div className={css.modalActions}>
							{isAdmin && (
								<button onClick={handleDeleteConfirm} disabled={isDeleting}>
									{isDeleting ? 'Удаление...' : 'Да'}
								</button>
							)}
							<button onClick={handleModalClose}>Нет</button>
						</div>
					</div>
				</div>
			)}

			<ToastContainer />
		</div>
	);
};