import css from './dropdown-menu.module.scss';
import React from 'react';
import classNames from 'classnames';
import { useFetchMaterialTypeQuery } from '../../api/materialApi'; // Импортируем хук API

interface DropdownMenuProps {
	width?: number;
	height?: number;
	id?: string;
	value: number | null; // Принимаем числовой ID типа материала
	onChange: (value: number) => void; // Возвращаем числовой ID
}

export const DropdownMenu = (props: DropdownMenuProps) => {
	const { width, height, id, value, onChange } = props;

	// Получаем данные из API
	const { data, isLoading, error } = useFetchMaterialTypeQuery();

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange(Number(e.target.value));
	};

	if (isLoading) {
		return (
			<div className={css.wrapper} style={{ width, height }}>
				<select className={css.select} disabled>
					<option>Загрузка типов...</option>
				</select>
			</div>
		);
	}

	if (error) {
		return (
			<div className={css.wrapper} style={{ width, height }}>
				<select className={css.select} disabled>
					<option>Ошибка загрузки</option>
				</select>
			</div>
		);
	}

	// Преобразуем данные API в опции
	const options = data?.data.map((type) => ({
		value: type.type_id.toString(),
		label: type.type,
	})) || [];

	return (
		<div className={css.wrapper} style={{ width, height }}>
			<select
				className={classNames(css.select, {
					[css.placeholder]: !value
				})}
				id={id}
				value={value?.toString() || ''}
				onChange={handleChange}
			>
				<option value="" disabled>
					Выберите тип
				</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};