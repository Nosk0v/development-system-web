import React from 'react';
import css from './secondary-button.module.scss';

interface SecondaryButtonProps {
    text: string;
    width?: number;
    height?: number;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const SecondaryButton = (props: SecondaryButtonProps) => {
	const {
		text, width, height, onClick, disabled,
	} = props;
	return (
		<button
			className={`${css.secondary_button} ${disabled ? css.disabled : ''}`}
			type="button"
			onClick={onClick}
			style={{
				width, height,
			}}
		>
			{text}
		</button>
	);
};
