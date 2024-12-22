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
}

export const DropdownMenu = (props: DropdownMenuProps) => {
	const {
		options,
		width,
		height,
		id,
	} = props;

	return (
		<div className={css.wrapper} style={{ width, height }}>
			<select className={css.select} id={id}>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};
