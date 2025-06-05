import { useState } from 'react';
import css from './MaterialListBlock.module.scss';
import { MaterialList } from './list';
import { MaterialListControl } from './control';

export const MaterialListBlock = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [typeFilter, setTypeFilter] = useState<number | null>(null);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleTypeFilterChange = (typeId: number | null) => {
		setTypeFilter(typeId);
	};
	const [competencyFilter, setCompetencyFilter] = useState<string[]>([]);

	return (
		<div className={css.wrapper}>
			<div className={css.listWrapper}>
				<MaterialList
					searchQuery={searchQuery}
					typeFilter={typeFilter}
					competencyFilter={competencyFilter}
				/>
			</div>
			<div className={css.controlWrapper}>
				<MaterialListControl
					onSearch={handleSearch}
					onTypeFilterChange={handleTypeFilterChange}
					onCompetencyFilterChange={setCompetencyFilter}
				/>
			</div>
		</div>
	);
};