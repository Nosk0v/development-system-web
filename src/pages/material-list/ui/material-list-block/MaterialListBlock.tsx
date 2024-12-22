import { useState } from 'react';
import css from './MaterialListBlock.module.scss';
import { MaterialList } from './list';
import { MaterialListControl } from './control';

export const MaterialListBlock = () => {
	const [searchQuery, setSearchQuery] = useState(''); // Состояние для хранения поискового запроса

	// Функция, которая обновляет состояние поискового запроса
	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	return (
		<div className={css.wrapper}>
			<div className={css.listWrapper}>
				<MaterialList searchQuery={searchQuery} /> {/* Передаем запрос в список */}
			</div>
			<div className={css.controlWrapper}>
				<MaterialListControl onSearch={handleSearch} />
			</div>
		</div>
	);
};