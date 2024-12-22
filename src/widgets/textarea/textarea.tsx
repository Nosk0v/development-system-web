import css from './textarea.module.scss';

interface TextAreaProps {
    placeholder?: string;
    width?: number;
    height?: number;
    id?: string;
}

export const TextArea = (props: TextAreaProps) => {
	const {
		placeholder, width, height, id,
	} = props;
	return (
		<textarea
			className={css.textarea}
			placeholder={placeholder}
			style={{ width, height }}
			id={id}
		/>
	);
};
