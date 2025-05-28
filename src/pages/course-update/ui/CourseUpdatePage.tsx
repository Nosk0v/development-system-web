import css from './CourseUpdatePage.module.scss';
import {CourseUpdateBlock} from "./course-update-block/CourseUpdateBlock.tsx";


export const CourseUpdatePage = () => (
	<div className={css.wrapper}>
		<CourseUpdateBlock />
	</div>
);
