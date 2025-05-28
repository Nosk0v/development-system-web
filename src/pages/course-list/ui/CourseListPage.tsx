import css from './CourseListPage.module.scss';

import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CourseListBlock } from './course-list-block';
import { CompletedCoursesModal } from '../../../widgets/comp-course/CompleteCourseModal.tsx';

export const CourseListPage = () => {
	const location = useLocation();
	const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

	useEffect(() => {
		if (location.state?.notification) {
			toast.success(location.state.notification);
		}
		if (location.state?.openCompletedCoursesModal) {
			setIsCompletedModalOpen(true);
		}
	}, [location.state]);

	return (
		<div className={css.wrapper}>
			<CourseListBlock />
			<CompletedCoursesModal
				isOpen={isCompletedModalOpen}
				onClose={() => setIsCompletedModalOpen(false)}
			/>
		</div>
	);
};