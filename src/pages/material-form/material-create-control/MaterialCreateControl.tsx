import { MainButton } from '../../../widgets/button/button.tsx';
import { SecondaryButton } from '../../../widgets/cancel-button/secondary-button.tsx';
import { useNavigate } from 'react-router-dom';
import css from './MaterialCreateControl.module.scss';

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
			<MainButton text="Сохранить" onClick={onSave} />
			<SecondaryButton text="Закрыть" onClick={onClose} />
		</div>
	);
};