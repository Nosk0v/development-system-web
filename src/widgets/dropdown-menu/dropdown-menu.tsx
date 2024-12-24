import css from './dropdown-menu.module.scss';

interface OptionType {
	value: string;
	label: string;
}

interface DropdownMenuProps {
	options: OptionType[];
	width?: number;
	height?: number;
	id?: string;
	value: string;  // Добавляем value для текущего выбранного значения
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;  // Добавляем обработчик изменений
}

export const DropdownMenu = (props: DropdownMenuProps) => {
	const {
		options,
		width,
		height,
		id,
		value,
		onChange
	} = props;

	return (
		<div className={css.wrapper} style={{ width, height }}>
			<select className={css.select} id={id} value={value} onChange={onChange}>
				{/* Элемент для "Выберите тип", который будет по умолчанию */}
				<option value="" disabled>Выберите тип</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};