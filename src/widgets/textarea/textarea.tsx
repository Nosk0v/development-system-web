import {
	useRef,
	useLayoutEffect,
	useCallback,
	KeyboardEvent,
	ChangeEvent,
	TextareaHTMLAttributes,
} from 'react';
import css from './textarea.module.scss';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	id?: string;
	value?: string;
	onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
	autoGrow?: boolean;
	minRows?: number;
	maxRows?: number;
}

export const TextArea = ({
							 id,
							 value = '',
							 onChange,
							 onKeyDown,
							 placeholder = 'Введите текст...',
							 autoGrow = true,
							 minRows = 3,
							 maxRows = 12,
							 ...rest
						 }: TextAreaProps) => {
	const ref = useRef<HTMLTextAreaElement>(null);

	// Авторасширение по контенту
	useLayoutEffect(() => {
		if (!autoGrow || !ref.current) return;

		const textarea = ref.current;
		textarea.rows = minRows;

		const style = getComputedStyle(textarea);
		const lineHeight = parseFloat(style.lineHeight || '20');

		textarea.style.height = 'auto';
		const scrollRows = textarea.scrollHeight / lineHeight;

		const rows = Math.min(Math.max(scrollRows, minRows), maxRows);
		textarea.style.height = `${rows * lineHeight}px`;
	}, [value, autoGrow, minRows, maxRows]);

	// Обработка клавиши TAB
	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Tab') {
				e.preventDefault();
				const textarea = e.currentTarget;
				const start = textarea.selectionStart;
				const end = textarea.selectionEnd;

				const tab = '\t';
				const newValue =
					value.substring(0, start) + tab + value.substring(end);

				onChange?.({
					...e,
					target: { ...textarea, value: newValue },
				} as ChangeEvent<HTMLTextAreaElement>);

				setTimeout(() => {
					textarea.selectionStart = textarea.selectionEnd = start + tab.length;
				}, 0);
			}

			onKeyDown?.(e); // прокидываем дальше
		},
		[value, onChange, onKeyDown]
	);

	return (
		<textarea
			id={id}
			ref={ref}
			className={css.textarea}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			onKeyDown={handleKeyDown}
			spellCheck={false}
			autoCorrect="off"
			{...rest}
		/>
	);
};