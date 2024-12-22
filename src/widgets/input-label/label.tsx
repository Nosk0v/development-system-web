import React from 'react';
import css from './label.module.scss';

interface InputLabelProps {
    label?: string;
	fontSize?: string;
	color?: string;
    children?: React.ReactNode;
    id?: string;
}

export const Label = (props: InputLabelProps) => {
	const {
		label,
		fontSize,
		color,
		children,
		id,
	} = props;

	return (
		<div className={css.wrapper}>
			<label
				className={css.label}
				style={{
					fontSize,
					color,
				}}
				htmlFor={id}
			>
				{label}
			</label>
			{children}
		</div>
	);
};
