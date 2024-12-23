import css from './input.module.scss';

interface InputProps {
	placeholder?: string;
	width?: number;
	height?: number;
	id?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;  // Добавляем className для гибкости
}

export const Input = (props: InputProps) => {
	const {
		placeholder,
		width,
		height,
		id,
		onChange,
		className, // Получаем className для добавления кастомных стилей
	} = props;

	return (
		<div className={`${css.wrapper} ${className}`} style={{ width, height }}>
			<div className={css.inputContainer}>
				<input
					id={id}
					className={css.inputField}
					placeholder={placeholder || 'Введите текст...'}  // Добавляем значение по умолчанию для placeholder
					style={{ height }}
					onChange={onChange} // Обработчик onChange
				/>
			</div>
		</div>
	);
};