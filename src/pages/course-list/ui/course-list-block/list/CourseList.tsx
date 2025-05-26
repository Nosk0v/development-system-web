import { useState, useEffect } from 'react';
import { useFetchCoursesQuery, useDeleteCourseMutation } from '../../../../../api/materialApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import css from './CourseList.module.scss';
import {CourseListItem} from "./item/CourseListItem.tsx";

interface Course {
	course_id: number;
	title: string;
	competencies: string[];
}

export const CourseList = ({ searchQuery }: { searchQuery: string }) => {
	const { data, error, isLoading, refetch } = useFetchCoursesQuery();
	const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

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

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const filteredCourses = courses.filter((course) =>
		course.title.toLowerCase().includes(searchQuery.toLowerCase())
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
							<button onClick={handleDeleteConfirm} disabled={isDeleting}>
								{isDeleting ? 'Удаление...' : 'Да'}
							</button>
							<button onClick={handleModalClose}>Нет</button>
						</div>
					</div>
				</div>
			)}

			<ToastContainer />
		</div>
	);
};