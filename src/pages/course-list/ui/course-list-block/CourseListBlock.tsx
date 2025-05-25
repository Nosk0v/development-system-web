import { useState } from 'react';
import css from './CourseListBlock.module.scss';


import {CourseList} from "./list/CourseList.tsx";
import {CourseListControl} from "./control/CourseListControl.tsx";

export const CourseListBlock = () => {
	const [searchQuery, setSearchQuery] = useState(''); // Поисковый запрос

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	return (
		<div className={css.wrapper}>
			<div className={css.listWrapper}>
				<CourseList searchQuery={searchQuery} />
			</div>
			<div className={css.controlWrapper}>
				<CourseListControl onSearch={handleSearch} />
			</div>
		</div>
	);
};