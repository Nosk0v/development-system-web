import css from './CourseListPage.module.scss';

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {CourseListBlock} from "./course-list-block/CourseListBlock.tsx";

export const CourseListPage = () => {
	const location = useLocation();

	useEffect(() => {
		if (location.state?.notification) {
			toast.success(location.state.notification);
		}
	}, [location]);

	return (
		<div className={css.wrapper}>
			<CourseListBlock />
		</div>
	);
};