import { useNavigate } from 'react-router-dom';
import css from './MaterialCreateControl.module.scss';
import { MainButton } from '../../../../../widgets/button/button';
import { SecondaryButton } from '../../../../../widgets/cancel-button/secondary-button';

export const MaterialCreateControl = () => {
	const navigate = useNavigate();

	const onSave = () => {
		alert('Сохранено');
	};

	const onClose = () => {
		navigate('/');
	};

	return (
		<div className={css.wrapper}>
			<MainButton
				text="Сохранить"
				onClick={onSave}
			/>
			<SecondaryButton
				text="Закрыть"
				onClick={onClose}
			/>
		</div>
	);
};
