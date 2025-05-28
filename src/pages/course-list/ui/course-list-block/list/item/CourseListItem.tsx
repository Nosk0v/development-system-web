import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import css from './CourseListItem.module.scss';
import TrashIcon from "../../../../../../assets/images/trash.svg";

interface CourseListItemProps {
	courseId: number;
	title: string;
	competencies: string[];
	onCourseDeleted: (courseId: number) => void;
	onDeleteRequest: (courseId: number) => void;
}

export const CourseListItem = ({
								   courseId,
								   title,
								   competencies,
								   onDeleteRequest,
							   }: CourseListItemProps) => {
	const navigate = useNavigate();

	const accessToken = localStorage.getItem('access_token');
	let isAdminOrSuper = false;
	if (accessToken) {
		try {
			const decoded = JSON.parse(atob(accessToken.split('.')[1]));
			const role = decoded?.role;
			isAdminOrSuper = role === 0 || role === 2;
		} catch (e) {
			console.error('Failed to decode access token:', e);
		}
	}

	const competenciesRef = useRef<HTMLDivElement | null>(null);

	const onCourseClick = () => {
		navigate(`/view-course/${courseId}`);
	};

	useEffect(() => {
		const ref = competenciesRef.current;
		if (!ref) return;

		const handleWheel = (e: WheelEvent) => {
			if (e.deltaY !== 0) {
				e.preventDefault();
				ref.scrollLeft += e.deltaY * 0.5;
			}
		};

		ref.addEventListener('wheel', handleWheel);
		return () => ref.removeEventListener('wheel', handleWheel);
	}, []);

	return (
		<div className={css.wrapper} onClick={onCourseClick}>
			<div className={css.content}>
				<div className={css.title}>{title}</div>
				{competencies.length > 0 && (
					<div className={css.competencies} ref={competenciesRef}>
						{competencies.map((competency) => (
							<div key={competency} className={css.competency}>
								{competency}
							</div>
						))}
					</div>
				)}
			</div>
			{isAdminOrSuper && (
				<button
					className={css.trashButton}
					onClick={(e) => {
						e.stopPropagation();
						onDeleteRequest(courseId);
					}}
				>
					<img src={TrashIcon} alt="Удалить" />
				</button>
			)}
		</div>
	);
};