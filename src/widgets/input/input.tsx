import css from './input.module.scss';

interface InputProps {
	placeholder?: string;
	width?: number;
	height?: number;
	id?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;  // Добавляем className для гибкости
	value?: string;  // Добавляем value для контролируемого компонента
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
	} = props;

	return (
		<div className={`${css.wrapper} ${className}`} style={{ width, height }}>
			<div className={css.inputContainer}>
				<input
					id={id}
					className={css.inputField}
					placeholder={placeholder || 'Введите текст...'}  // Значение по умолчанию для placeholder
					style={{ height }}
					onChange={onChange} // Обработчик onChange
					value={value}  // Привязываем value для контролируемого компонента
				/>
			</div>
		</div>
	);
};