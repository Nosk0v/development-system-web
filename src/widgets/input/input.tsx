import css from './input.module.scss';

interface InputProps {
	placeholder?: string;
	width?: number;
	height?: number;
	id?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Добавляем onChange
}

export const Input = (props: InputProps) => {
	const {
		placeholder,
		width,
		height,
		id,
		onChange, // Получаем onChange из props
	} = props;

	return (
		<div className={css.wrapper} style={{ width, height }}>
			<div className={css.inputContainer}>
				<input
					id={id}
					className={css.inputField}
					placeholder={placeholder}
					style={{ height }}
					onChange={onChange} // Привязываем обработчик
				/>
			</div>
		</div>
	);
};