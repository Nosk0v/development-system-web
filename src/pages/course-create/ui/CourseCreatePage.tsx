import css from './CourseCreatePage.module.scss';
import { CourseCreateBlock } from './course-create-block';

export const CourseCreatePage = () => (
	<div className={css.wrapper}>
		<CourseCreateBlock />
	</div>
);
