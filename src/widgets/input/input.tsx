import css from './input.module.scss';
import React, { KeyboardEvent } from "react";

interface InputProps {
	placeholder?: string;
	width?: number;
	height?: number;
	id?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
	value?: string;
}

export const Input = (props: InputProps) => {
	const {
		placeholder,
		width,
		height,
		id,
		onChange,
		className,
		value,  // Получаем value для передачи в input
		onKeyDown
	} = props;

	return (
		<div className={`${css.wrapper} ${className}`} style={{ width, height }}>
			<div className={css.inputContainer}>
				<input
					id={id}
					className={css.inputField}
					placeholder={placeholder || 'Введите текст...'}
					style={{ height }}
					onChange={onChange}
					value={value}
					onKeyDown={onKeyDown}
				/>
			</div>
		</div>
	);
};