import { useState } from 'react';
import css from './CourseListBlock.module.scss';

import { CourseList } from './list';
import { CourseListControl } from './control';

export const CourseListBlock = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [competencyFilter, setCompetencyFilter] = useState<string[]>([]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	return (
		<div className={css.wrapper}>
			<div className={css.listWrapper}>
				<CourseList
					searchQuery={searchQuery}
					selectedCompetencies={competencyFilter}
				/>
			</div>
			<div className={css.controlWrapper}>
				<CourseListControl
					onSearch={handleSearch}
					onCompetencyFilterChange={setCompetencyFilter}
				/>
			</div>
		</div>
	);
};