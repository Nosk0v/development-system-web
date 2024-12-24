import { useNavigate } from 'react-router-dom';
import css from './MaterialCreateControl.module.scss';
import { MainButton } from '../../../../../widgets/button/button';
import { SecondaryButton } from '../../../../../widgets/cancel-button/secondary-button';

interface MaterialCreateControlProps {
	onSave: () => void;
}

export const MaterialCreateControl = ({ onSave }: MaterialCreateControlProps) => {
	const navigate = useNavigate();

	const onClose = () => {
		navigate('/');
		window.location.reload();
	};

	return (
		<div className={css.wrapper}>
			<MainButton
				text="Сохранить"
				onClick={onSave} // Вызов метода сохранения
			/>
			<SecondaryButton
				text="Закрыть"
				onClick={onClose}
			/>
		</div>
	);
};