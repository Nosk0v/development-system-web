import css from './dropdown-menu.module.scss';
import React from "react";
import classNames from 'classnames';

interface OptionType {
	value: string;
	label: string;
}

interface DropdownMenuProps {
	options: OptionType[];
	width?: number;
	height?: number;
	id?: string;
	value: string; // Текущее выбранное значение
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Обработчик изменений
}

export const DropdownMenu = (props: DropdownMenuProps) => {
	const { options, width, height, id, value, onChange } = props;

	return (
		<div className={css.wrapper} style={{ width, height }}>
			<select
				className={classNames(css.select, { [css.placeholder]: value === '' })}
				id={id}
				value={value}
				onChange={onChange}
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