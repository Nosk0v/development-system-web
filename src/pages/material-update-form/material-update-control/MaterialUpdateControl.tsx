import { MainButton } from '../../../widgets/button/button.tsx';
import { SecondaryButton } from '../../../widgets/cancel-button/secondary-button.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import css from './MaterialUpdateControl.module.scss';

interface MaterialUpdateControlProps {
	onSave: () => void;
}

export const MaterialUpdateControl = ({ onSave }: MaterialUpdateControlProps) => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>(); // Получаем ID из URL

	const onClose = () => {

		if (id) {
			navigate(`/materials/${id}`);
		}
	};

	return (
		<div className={css.wrapper}>
			<MainButton text="Сохранить" onClick={onSave} />
			<SecondaryButton text="Закрыть" onClick={onClose} />
		</div>
	);
};