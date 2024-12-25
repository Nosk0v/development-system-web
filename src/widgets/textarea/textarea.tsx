import css from './textarea.module.scss';

interface TextAreaProps {
	placeholder?: string;
	width?: number;
	height?: number;
	id?: string;
	value?: string;  // Пропс для значения
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;  // Обработчик изменения
}

export const TextArea = (props: TextAreaProps) => {
	const {
		placeholder, width, height, id, value, onChange,
	} = props;

	return (
		<textarea
			className={css.textarea}
			placeholder={placeholder  || 'Введите текст...'}
			style={{ width, height }}
			id={id}
			value={value}  // Привязываем значение
			onChange={onChange}  // Обработчик изменения
		/>
	);
};