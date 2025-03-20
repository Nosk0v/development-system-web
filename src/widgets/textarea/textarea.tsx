import css from './textarea.module.scss';
import React, {  KeyboardEvent } from "react";

interface TextAreaProps {
	placeholder?: string;
	width?: number;
	height?: number;
	id?: string;
	value?: string;  // Пропс для значения
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;  // Обработчик изменения
	onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const TextArea = (props: TextAreaProps) => {
	const {
		placeholder, width, height, id, value, onChange, onKeyDown,
	} = props;

	return (
		<textarea
			className={css.textarea}
			placeholder={placeholder  || 'Введите текст...'}
			style={{ width, height }}
			id={id}
			value={value}  // Привязываем значение
			onKeyDown={onKeyDown}
			onChange={onChange}  // Обработчик изменения
		/>
	);
};